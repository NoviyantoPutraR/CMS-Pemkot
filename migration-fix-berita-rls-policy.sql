-- ============================================
-- Migration: Perbaiki RLS Policy untuk Tabel Berita
-- ============================================
-- Masalah: Policy INSERT berita gagal karena subquery tidak bisa bypass RLS
-- Solusi: Gunakan helper function is_admin() dengan SECURITY DEFINER
-- ============================================

-- Helper function untuk check admin
-- Function ini berjalan dengan SECURITY DEFINER sehingga bisa bypass RLS
-- saat memeriksa tabel admin_pengguna
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Cek apakah user ada di admin_pengguna
  -- Function ini menggunakan SECURITY DEFINER sehingga berjalan dengan
  -- privilege superuser dan bisa bypass RLS saat memeriksa admin_pengguna
  RETURN EXISTS (
    SELECT 1 FROM admin_pengguna
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Drop policy lama untuk berita (jika ada)
-- ============================================

DROP POLICY IF EXISTS "Admin dapat melihat semua berita" ON berita;
DROP POLICY IF EXISTS "Admin dapat menambah berita" ON berita;
DROP POLICY IF EXISTS "Admin dapat mengupdate berita" ON berita;
DROP POLICY IF EXISTS "Admin dapat menghapus berita" ON berita;

-- ============================================
-- Recreate policies untuk berita menggunakan is_admin()
-- ============================================

-- Admin: Baca semua berita
CREATE POLICY "Admin dapat melihat semua berita"
  ON berita FOR SELECT
  USING (is_admin());

-- Admin: Insert berita
CREATE POLICY "Admin dapat menambah berita"
  ON berita FOR INSERT
  WITH CHECK (is_admin());

-- Admin: Update berita
CREATE POLICY "Admin dapat mengupdate berita"
  ON berita FOR UPDATE
  USING (is_admin());

-- Admin: Delete berita
CREATE POLICY "Admin dapat menghapus berita"
  ON berita FOR DELETE
  USING (is_admin());

-- ============================================
-- Catatan:
-- - Function is_admin() menggunakan SECURITY DEFINER sehingga bisa bypass RLS
-- - Policy "Berita published dapat dibaca semua orang" tetap dipertahankan
-- - Pastikan user sudah terdaftar sebagai admin di tabel admin_pengguna
-- ============================================

