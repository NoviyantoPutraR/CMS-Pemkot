-- ============================================
-- Migration: Hapus Kategori Layanan dan Kategori Wisata
-- Tanggal: 2024
-- Deskripsi: Menghapus tabel kategori_layanan dan kategori_wisata
--            serta kolom kategori_id dari tabel layanan dan wisata
-- ============================================

-- 1. Hapus foreign key constraints terlebih dahulu
ALTER TABLE IF EXISTS layanan DROP CONSTRAINT IF EXISTS layanan_kategori_id_fkey;
ALTER TABLE IF EXISTS wisata DROP CONSTRAINT IF EXISTS wisata_kategori_id_fkey;

-- 2. Hapus indexes terkait kategori
DROP INDEX IF EXISTS idx_layanan_kategori_id;
DROP INDEX IF EXISTS idx_wisata_kategori_id;
DROP INDEX IF EXISTS idx_kategori_layanan_slug;
DROP INDEX IF EXISTS idx_kategori_layanan_parent_id;
DROP INDEX IF EXISTS idx_kategori_layanan_urutan;
DROP INDEX IF EXISTS idx_kategori_wisata_slug;
DROP INDEX IF EXISTS idx_kategori_wisata_urutan;

-- 3. Hapus RLS policies untuk tabel kategori
DROP POLICY IF EXISTS "Kategori layanan dapat dibaca semua orang" ON kategori_layanan;
DROP POLICY IF EXISTS "Admin dapat mengelola kategori layanan" ON kategori_layanan;
DROP POLICY IF EXISTS "Kategori wisata dapat dibaca semua orang" ON kategori_wisata;
DROP POLICY IF EXISTS "Admin dapat mengelola kategori wisata" ON kategori_wisata;

-- 4. Hapus kolom kategori_id dari tabel layanan dan wisata
ALTER TABLE IF EXISTS layanan DROP COLUMN IF EXISTS kategori_id;
ALTER TABLE IF EXISTS wisata DROP COLUMN IF EXISTS kategori_id;

-- 5. Hapus tabel kategori (akan otomatis menghapus self-reference constraint)
DROP TABLE IF EXISTS kategori_layanan CASCADE;
DROP TABLE IF EXISTS kategori_wisata CASCADE;

-- ============================================
-- Catatan:
-- - CASCADE pada DROP TABLE akan menghapus semua constraints yang terkait
-- - Data yang sudah ada di tabel layanan dan wisata akan tetap ada, hanya kolom kategori_id yang dihapus
-- - Pastikan backup database sebelum menjalankan migration ini
-- ============================================

