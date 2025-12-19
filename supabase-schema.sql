-- ============================================
-- Database Schema untuk CMS Pemerintah Kota
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabel: kategori_berita
CREATE TABLE IF NOT EXISTS kategori_berita (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel: admin_pengguna
CREATE TABLE IF NOT EXISTS admin_pengguna (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  peran TEXT NOT NULL DEFAULT 'admin',
  nama_lengkap TEXT,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel: berita
CREATE TABLE IF NOT EXISTS berita (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  konten TEXT NOT NULL,
  thumbnail_url TEXT,
  kategori_id UUID REFERENCES kategori_berita(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  meta_description TEXT,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dibuat_oleh UUID REFERENCES admin_pengguna(id) ON DELETE SET NULL
);

-- Tabel: layanan
CREATE TABLE IF NOT EXISTS layanan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  konten TEXT NOT NULL,
  icon_url TEXT,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dibuat_oleh UUID REFERENCES admin_pengguna(id) ON DELETE SET NULL
);

-- Tabel: halaman
CREATE TABLE IF NOT EXISTS halaman (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  judul TEXT NOT NULL,
  konten TEXT NOT NULL,
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_oleh UUID REFERENCES admin_pengguna(id) ON DELETE SET NULL
);

-- Indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_berita_slug ON berita(slug);
CREATE INDEX IF NOT EXISTS idx_berita_status ON berita(status);
CREATE INDEX IF NOT EXISTS idx_berita_kategori ON berita(kategori_id);
CREATE INDEX IF NOT EXISTS idx_berita_dibuat_pada ON berita(dibuat_pada DESC);
CREATE INDEX IF NOT EXISTS idx_kategori_slug ON kategori_berita(slug);
CREATE INDEX IF NOT EXISTS idx_layanan_dibuat_pada ON layanan(dibuat_pada DESC);
CREATE INDEX IF NOT EXISTS idx_halaman_slug ON halaman(slug);

-- Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.diperbarui_pada = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers untuk auto-update updated_at
CREATE TRIGGER update_berita_updated_at BEFORE UPDATE ON berita
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_layanan_updated_at BEFORE UPDATE ON layanan
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_halaman_updated_at BEFORE UPDATE ON halaman
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE kategori_berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_pengguna ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE layanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE halaman ENABLE ROW LEVEL SECURITY;

-- Policies untuk kategori_berita
-- Public: Baca semua
CREATE POLICY "Kategori berita dapat dibaca semua orang"
  ON kategori_berita FOR SELECT
  USING (true);

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola kategori berita"
  ON kategori_berita FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Policies untuk admin_pengguna
-- Admin: Baca semua admin
CREATE POLICY "Admin dapat melihat semua admin"
  ON admin_pengguna FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Insert admin baru (hanya super admin atau admin pertama)
CREATE POLICY "Admin dapat menambah admin baru"
  ON admin_pengguna FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Update admin
CREATE POLICY "Admin dapat mengupdate admin"
  ON admin_pengguna FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Delete admin (tidak bisa delete diri sendiri)
CREATE POLICY "Admin dapat menghapus admin"
  ON admin_pengguna FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
      AND admin_pengguna.id != admin_pengguna.id
    )
  );

-- Policies untuk berita
-- Public: Baca berita yang published
CREATE POLICY "Berita published dapat dibaca semua orang"
  ON berita FOR SELECT
  USING (status = 'published');

-- Admin: Baca semua berita
CREATE POLICY "Admin dapat melihat semua berita"
  ON berita FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Insert berita
CREATE POLICY "Admin dapat menambah berita"
  ON berita FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Update berita
CREATE POLICY "Admin dapat mengupdate berita"
  ON berita FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Delete berita
CREATE POLICY "Admin dapat menghapus berita"
  ON berita FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Policies untuk layanan
-- Public: Baca semua layanan
CREATE POLICY "Layanan dapat dibaca semua orang"
  ON layanan FOR SELECT
  USING (true);

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola layanan"
  ON layanan FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Policies untuk halaman
-- Public: Baca semua halaman
CREATE POLICY "Halaman dapat dibaca semua orang"
  ON halaman FOR SELECT
  USING (true);

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola halaman"
  ON halaman FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- ============================================
-- Initial Data (Halaman Statis)
-- ============================================

-- Insert halaman statis default
INSERT INTO halaman (slug, judul, konten) VALUES
  ('tentang', 'Tentang Kami', '<p>Halaman tentang pemerintah kota. Silakan edit konten ini.</p>'),
  ('kontak', 'Kontak', '<p>Informasi kontak pemerintah kota. Silakan edit konten ini.</p>'),
  ('visi-misi', 'Visi Misi', '<p>Visi dan misi pemerintah kota. Silakan edit konten ini.</p>'),
  ('struktur-organisasi', 'Struktur Organisasi', '<p>Struktur organisasi pemerintah kota. Silakan edit konten ini.</p>')
ON CONFLICT (slug) DO NOTHING;

