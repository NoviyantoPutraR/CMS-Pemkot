-- ============================================
-- Migration: Add Role & Permission Management System
-- Deskripsi: Menambahkan sistem role bertingkat dengan hak akses dinamis
-- Tanggal: 2024
-- ============================================

-- ============================================
-- 1. ALTER TABLE: pengguna
-- Menambahkan kolom untuk role management
-- ============================================

-- Tambah kolom diperbarui_pada jika belum ada (untuk existing tables)
ALTER TABLE pengguna ADD COLUMN IF NOT EXISTS diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Tambah kolom dibuat_oleh untuk tracking hierarki
ALTER TABLE pengguna ADD COLUMN IF NOT EXISTS dibuat_oleh UUID REFERENCES pengguna(id) ON DELETE SET NULL;

-- Set default value untuk existing records
UPDATE pengguna SET diperbarui_pada = dibuat_pada WHERE diperbarui_pada IS NULL;

-- Drop constraint lama dan buat constraint baru untuk peran
ALTER TABLE pengguna DROP CONSTRAINT IF EXISTS pengguna_peran_check;
ALTER TABLE pengguna ADD CONSTRAINT pengguna_peran_check 
  CHECK (peran IN ('superadmin', 'admin_skpd', 'penulis'));

-- Update existing data: migrate 'super_admin' to 'superadmin' and 'admin' to 'admin_skpd'
UPDATE pengguna SET peran = 'superadmin' WHERE peran = 'super_admin';
UPDATE pengguna SET peran = 'admin_skpd' WHERE peran = 'admin';

-- ============================================
-- 2. CREATE TABLE: hak_akses
-- Tabel master untuk hak akses halaman
-- ============================================

CREATE TABLE IF NOT EXISTS hak_akses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode_halaman TEXT NOT NULL UNIQUE,
  nama_halaman TEXT NOT NULL,
  deskripsi TEXT,
  kategori TEXT NOT NULL CHECK (kategori IN ('superadmin_only', 'admin_skpd_options', 'penulis_options')),
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk kategori
CREATE INDEX IF NOT EXISTS idx_hak_akses_kategori ON hak_akses(kategori);

-- ============================================
-- 3. CREATE TABLE: pengguna_hak_akses
-- Junction table untuk relasi many-to-many
-- ============================================

CREATE TABLE IF NOT EXISTS pengguna_hak_akses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pengguna_id UUID NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
  hak_akses_id UUID NOT NULL REFERENCES hak_akses(id) ON DELETE CASCADE,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pengguna_id, hak_akses_id)
);

-- Indexes untuk performa query
CREATE INDEX IF NOT EXISTS idx_pengguna_hak_akses_pengguna ON pengguna_hak_akses(pengguna_id);
CREATE INDEX IF NOT EXISTS idx_pengguna_hak_akses_hak_akses ON pengguna_hak_akses(hak_akses_id);

-- ============================================
-- 4. SEED DATA: hak_akses
-- Data master hak akses untuk semua halaman
-- ============================================

-- Kategori: superadmin_only (Dashboard & Manajemen Pengguna)
INSERT INTO hak_akses (kode_halaman, nama_halaman, deskripsi, kategori) VALUES
  ('dashboard', 'Dashboard', 'Halaman dashboard utama', 'superadmin_only'),
  ('manajemen_pengguna', 'Manajemen Pengguna', 'Kelola pengguna dan hak akses', 'superadmin_only')
ON CONFLICT (kode_halaman) DO NOTHING;

-- Kategori: admin_skpd_options (Halaman yang bisa diakses Admin SKPD)
INSERT INTO hak_akses (kode_halaman, nama_halaman, deskripsi, kategori) VALUES
  ('layanan', 'Layanan', 'Kelola layanan publik', 'admin_skpd_options'),
  ('perangkat_daerah', 'Perangkat Daerah', 'Kelola perangkat daerah', 'admin_skpd_options'),
  ('transparansi', 'Transparansi Anggaran', 'Kelola transparansi anggaran', 'admin_skpd_options'),
  ('halaman', 'Halaman Statis', 'Kelola halaman statis', 'admin_skpd_options'),
  ('pengaturan', 'Pengaturan Situs', 'Kelola pengaturan situs', 'admin_skpd_options')
ON CONFLICT (kode_halaman) DO NOTHING;

-- Kategori: penulis_options (Halaman yang bisa diakses Penulis)
INSERT INTO hak_akses (kode_halaman, nama_halaman, deskripsi, kategori) VALUES
  ('berita', 'Berita', 'Kelola berita', 'penulis_options'),
  ('artikel', 'Artikel', 'Kelola artikel', 'penulis_options'),
  ('agenda_kota', 'Agenda Kota', 'Kelola agenda kegiatan kota', 'penulis_options'),
  ('wisata', 'Wisata', 'Kelola destinasi wisata', 'penulis_options'),
  ('video', 'Video', 'Kelola video informasi', 'penulis_options'),
  ('pengumuman', 'Pengumuman', 'Kelola pengumuman resmi', 'penulis_options'),
  ('sosial_media', 'Sosial Media', 'Kelola sosial media', 'penulis_options')
ON CONFLICT (kode_halaman) DO NOTHING;

-- ============================================
-- 5. HELPER FUNCTIONS
-- Functions untuk membantu RLS policies
-- ============================================

-- Function: get_user_role
-- Return peran user yang sedang login
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT peran FROM pengguna WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function: get_user_permissions
-- Return array kode_halaman yang boleh diakses user
CREATE OR REPLACE FUNCTION get_user_permissions()
RETURNS TEXT[] AS $$
  SELECT ARRAY_AGG(ha.kode_halaman)
  FROM pengguna_hak_akses pha
  JOIN hak_akses ha ON pha.hak_akses_id = ha.id
  WHERE pha.pengguna_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function: can_access_page
-- Check apakah user bisa akses halaman tertentu
CREATE OR REPLACE FUNCTION can_access_page(page_code TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM pengguna_hak_akses pha
    JOIN hak_akses ha ON pha.hak_akses_id = ha.id
    WHERE pha.pengguna_id = auth.uid()
      AND ha.kode_halaman = page_code
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function: is_superadmin
-- Check apakah user adalah superadmin
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM pengguna 
    WHERE id = auth.uid() AND peran = 'superadmin'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function: is_admin_skpd
-- Check apakah user adalah admin_skpd
CREATE OR REPLACE FUNCTION is_admin_skpd()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM pengguna 
    WHERE id = auth.uid() AND peran = 'admin_skpd'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- 6. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS untuk tabel baru
ALTER TABLE hak_akses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengguna_hak_akses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS: hak_akses
-- ============================================

-- Policy: SELECT - Semua authenticated user bisa lihat hak_akses
DROP POLICY IF EXISTS "allow_read_hak_akses" ON hak_akses;
CREATE POLICY "allow_read_hak_akses" ON hak_akses
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: INSERT/UPDATE/DELETE - Disabled (data seed only)
DROP POLICY IF EXISTS "deny_write_hak_akses" ON hak_akses;
CREATE POLICY "deny_write_hak_akses" ON hak_akses
  FOR ALL
  TO authenticated
  USING (false);

-- ============================================
-- RLS: pengguna_hak_akses
-- ============================================

-- Policy: SELECT - User bisa lihat hak akses sendiri dan user yang dibuatnya
DROP POLICY IF EXISTS "allow_read_own_permissions" ON pengguna_hak_akses;
CREATE POLICY "allow_read_own_permissions" ON pengguna_hak_akses
  FOR SELECT
  TO authenticated
  USING (
    pengguna_id = auth.uid() OR
    pengguna_id IN (
      SELECT id FROM pengguna WHERE dibuat_oleh = auth.uid()
    ) OR
    is_superadmin()
  );

-- Policy: INSERT - Superadmin bisa assign ke admin_skpd, Admin SKPD bisa assign ke penulis
DROP POLICY IF EXISTS "allow_assign_permissions" ON pengguna_hak_akses;
CREATE POLICY "allow_assign_permissions" ON pengguna_hak_akses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_superadmin() OR
    (
      is_admin_skpd() AND 
      pengguna_id IN (
        SELECT id FROM pengguna 
        WHERE dibuat_oleh = auth.uid() AND peran = 'penulis'
      )
    )
  );

-- Policy: DELETE - Superadmin bisa hapus hak akses admin_skpd, Admin SKPD bisa hapus hak akses penulis
DROP POLICY IF EXISTS "allow_remove_permissions" ON pengguna_hak_akses;
CREATE POLICY "allow_remove_permissions" ON pengguna_hak_akses
  FOR DELETE
  TO authenticated
  USING (
    is_superadmin() OR
    (is_admin_skpd() AND pengguna_id IN (
      SELECT id FROM pengguna WHERE dibuat_oleh = auth.uid()
    ))
  );

-- ============================================
-- UPDATE RLS: pengguna
-- Update policies yang sudah ada
-- ============================================

-- Policy: SELECT - Tetap sama, semua authenticated bisa lihat
DROP POLICY IF EXISTS "allow_read_pengguna" ON pengguna;
CREATE POLICY "allow_read_pengguna" ON pengguna
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: INSERT - Superadmin bisa create admin_skpd, Admin SKPD bisa create penulis
DROP POLICY IF EXISTS "allow_insert_pengguna" ON pengguna;
CREATE POLICY "allow_insert_pengguna" ON pengguna
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Superadmin bisa create admin_skpd
    (is_superadmin() AND peran = 'admin_skpd') OR
    -- Admin SKPD bisa create penulis (dibuat_oleh akan di-set oleh application layer)
    (is_admin_skpd() AND peran = 'penulis')
  );

-- Policy: UPDATE - Superadmin bisa update semua, Admin SKPD bisa update Penulis yang dibuatnya, Admin SKPD & Penulis bisa update sendiri
DROP POLICY IF EXISTS "allow_update_pengguna" ON pengguna;
CREATE POLICY "allow_update_pengguna" ON pengguna
  FOR UPDATE
  TO authenticated
  USING (
    -- Superadmin bisa update semua user
    is_superadmin() OR
    -- Admin SKPD bisa update Penulis yang dibuatnya
    (
      is_admin_skpd() AND 
      id IN (
        SELECT id FROM pengguna 
        WHERE dibuat_oleh = auth.uid() AND peran = 'penulis'
      )
    ) OR
    -- Admin SKPD & Penulis bisa update sendiri (untuk nama_lengkap)
    id = auth.uid()
  );

-- Policy: DELETE - Hanya superadmin bisa delete
DROP POLICY IF EXISTS "allow_delete_pengguna" ON pengguna;
CREATE POLICY "allow_delete_pengguna" ON pengguna
  FOR DELETE
  TO authenticated
  USING (is_superadmin() AND id != auth.uid());

-- ============================================
-- 7. TRIGGERS
-- Auto-update diperbarui_pada untuk tabel baru
-- ============================================

-- Function untuk auto-update diperbarui_pada (jika belum ada)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.diperbarui_pada = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk pengguna
DROP TRIGGER IF EXISTS update_pengguna_updated_at ON pengguna;
CREATE TRIGGER update_pengguna_updated_at
  BEFORE UPDATE ON pengguna
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk hak_akses
DROP TRIGGER IF EXISTS update_hak_akses_updated_at ON hak_akses;
CREATE TRIGGER update_hak_akses_updated_at
  BEFORE UPDATE ON hak_akses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. COMMENTS
-- Dokumentasi untuk tabel dan kolom
-- ============================================

COMMENT ON TABLE hak_akses IS 'Tabel master hak akses halaman';
COMMENT ON COLUMN hak_akses.kode_halaman IS 'Kode unik halaman (berita, artikel, dll)';
COMMENT ON COLUMN hak_akses.kategori IS 'Kategori hak akses: superadmin_only, admin_skpd_options, penulis_options';

COMMENT ON TABLE pengguna_hak_akses IS 'Junction table relasi pengguna dan hak akses';

COMMENT ON COLUMN pengguna.dibuat_oleh IS 'User ID yang membuat user ini (tracking hierarki)';

-- ============================================
-- MIGRATION COMPLETED
-- ============================================

