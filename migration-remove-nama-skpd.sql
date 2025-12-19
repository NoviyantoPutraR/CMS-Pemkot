-- ============================================
-- Migration: Remove Column nama_skpd
-- Deskripsi: Menghapus kolom nama_skpd dari tabel pengguna
-- Tanggal: 2024
-- ============================================

-- Drop kolom nama_skpd
ALTER TABLE pengguna DROP COLUMN IF EXISTS nama_skpd;

-- Drop comment jika ada
COMMENT ON COLUMN pengguna.nama_skpd IS NULL;

-- Verify kolom sudah terhapus
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'pengguna' AND column_name = 'nama_skpd';
-- Expected: 0 rows (kolom sudah terhapus)

