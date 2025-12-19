-- ============================================
-- Migration: Hapus Kategori Berita dan Kategori Artikel
-- ============================================

-- 1. Drop foreign key constraints
ALTER TABLE berita DROP CONSTRAINT IF EXISTS berita_kategori_id_fkey;
ALTER TABLE artikel DROP CONSTRAINT IF EXISTS artikel_kategori_id_fkey;

-- 2. Drop indexes terkait kategori
DROP INDEX IF EXISTS idx_berita_kategori_id;
DROP INDEX IF EXISTS idx_artikel_kategori_id;
DROP INDEX IF EXISTS idx_kategori_berita_slug;
DROP INDEX IF EXISTS idx_kategori_berita_urutan;
DROP INDEX IF EXISTS idx_kategori_artikel_slug;
DROP INDEX IF EXISTS idx_kategori_artikel_urutan;

-- 3. Drop kolom kategori_id dari berita dan artikel
ALTER TABLE berita DROP COLUMN IF EXISTS kategori_id;
ALTER TABLE artikel DROP COLUMN IF EXISTS kategori_id;

-- 4. Drop RLS policies untuk kategori
DROP POLICY IF EXISTS "Kategori berita dapat dibaca semua orang" ON kategori_berita;
DROP POLICY IF EXISTS "Admin dapat mengelola kategori berita" ON kategori_berita;
DROP POLICY IF EXISTS "Kategori artikel dapat dibaca semua orang" ON kategori_artikel;
DROP POLICY IF EXISTS "Admin dapat mengelola kategori artikel" ON kategori_artikel;

-- 5. Drop tabel kategori_berita dan kategori_artikel
DROP TABLE IF EXISTS kategori_berita CASCADE;
DROP TABLE IF EXISTS kategori_artikel CASCADE;

-- ============================================
-- Catatan
-- ============================================
-- Setelah migration ini:
-- 1. Data kategori yang sudah ada akan hilang
-- 2. Kolom kategori_id di berita dan artikel akan dihapus
-- 3. Semua foreign key constraints akan dihapus
-- 4. Indexes terkait akan dihapus
-- 5. RLS policies akan dihapus
-- 
-- Pastikan untuk:
-- - Backup data jika diperlukan
-- - Update frontend code untuk remove kategori references
-- - Test semua fitur setelah migration

