-- ============================================
-- Migration: Add visi and misi to halaman
-- Deskripsi: Menambahkan kolom visi (TEXT) dan misi (JSONB) ke tabel halaman
--             untuk menyimpan data visi dan misi secara dinamis.
-- Tanggal: 2024
-- ============================================

-- Tambahkan kolom visi ke tabel halaman
ALTER TABLE halaman 
ADD COLUMN IF NOT EXISTS visi TEXT;

-- Tambahkan kolom misi ke tabel halaman
ALTER TABLE halaman 
ADD COLUMN IF NOT EXISTS misi JSONB DEFAULT '[]'::jsonb;

-- Update data existing untuk halaman "visi-misi" dengan data default
-- (jika belum ada data)
UPDATE halaman 
SET 
  visi = 'Terwujudnya masyarakat Jawa Timur yang adil, sejahtera, unggul, dan berdaulat dengan tata kelola pemerintahan yang partisipatif inklusif melalui kerja bersama dan semangat gotong royong.',
  misi = '[
    "Meningkatkan kualitas sumber daya manusia yang berkarakter, berdaya saing, dan berakhlak mulia",
    "Memperkuat infrastruktur dan konektivitas untuk mendukung pertumbuhan ekonomi yang berkelanjutan",
    "Mengembangkan ekonomi kerakyatan dan meningkatkan kesejahteraan masyarakat",
    "Meningkatkan pelayanan publik yang berkualitas, transparan, dan akuntabel",
    "Memperkuat ketahanan pangan, energi, dan lingkungan hidup"
  ]'::jsonb
WHERE slug = 'visi-misi' 
  AND (visi IS NULL OR misi IS NULL OR misi = '[]'::jsonb);

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
-- -- Cek data visi dan misi untuk halaman visi-misi
-- SELECT slug, judul, visi, misi
-- FROM halaman
-- WHERE slug = 'visi-misi';

-- ============================================
-- MIGRATION COMPLETED
-- ============================================

