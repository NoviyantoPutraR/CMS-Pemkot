-- ============================================
-- Migration: Add tugas_dan_fungsi to halaman
-- Deskripsi: Menambahkan kolom tugas_dan_fungsi (JSONB) ke tabel halaman
--             untuk menyimpan daftar tugas dan fungsi secara dinamis.
-- Tanggal: 2024
-- ============================================

-- Tambahkan kolom tugas_dan_fungsi ke tabel halaman
ALTER TABLE halaman 
ADD COLUMN IF NOT EXISTS tugas_dan_fungsi JSONB DEFAULT '[]'::jsonb;

-- Update data existing untuk halaman "tentang" dengan data default
-- (jika belum ada data)
UPDATE halaman 
SET tugas_dan_fungsi = '[
  "Melaksanakan urusan pemerintahan daerah provinsi sesuai dengan peraturan perundang-undangan",
  "Menyelenggarakan urusan pemerintahan umum di daerah provinsi",
  "Melaksanakan pembinaan dan koordinasi atas penyelenggaraan pemerintahan daerah kabupaten/kota",
  "Melaksanakan pembinaan dan pengawasan penyelenggaraan pemerintahan desa",
  "Meningkatkan kualitas pelayanan publik di wilayah provinsi",
  "Mendorong peningkatan kesejahteraan masyarakat melalui program pembangunan daerah"
]'::jsonb
WHERE slug = 'tentang' 
  AND (tugas_dan_fungsi IS NULL OR tugas_dan_fungsi = '[]'::jsonb);

-- ============================================
-- VERIFIKASI
-- Query untuk verifikasi setelah migration (tidak dieksekusi, hanya untuk reference)
-- ============================================

-- Uncomment query di bawah untuk verifikasi setelah migration:
-- 
-- -- Cek struktur tabel halaman
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'halaman'
-- ORDER BY ordinal_position;
-- 
-- -- Cek data tugas_dan_fungsi untuk halaman tentang
-- SELECT slug, judul, tugas_dan_fungsi
-- FROM halaman
-- WHERE slug = 'tentang';

-- ============================================
-- MIGRATION COMPLETED
-- ============================================

