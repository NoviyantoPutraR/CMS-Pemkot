-- ============================================
-- Migration: Restrukturisasi Grup Pengaturan Situs
-- ============================================
-- Rename grup "kontak" → "footer" dan "umum" → "hero"
-- Hapus field whatsapp
-- Duplikasi nama_situs dan deskripsi_situs untuk kedua grup
-- Update urutan field sesuai spesifikasi
-- ============================================

-- 0. Ubah constraint kunci dari UNIQUE menjadi UNIQUE (kunci, grup)
--    untuk memungkinkan kunci yang sama di grup berbeda
ALTER TABLE pengaturan_situs 
DROP CONSTRAINT IF EXISTS pengaturan_situs_kunci_key;

ALTER TABLE pengaturan_situs 
ADD CONSTRAINT pengaturan_situs_kunci_grup_unique UNIQUE (kunci, grup);

-- 1. Update grup "kontak" → "footer"
UPDATE pengaturan_situs 
SET grup = 'footer' 
WHERE grup = 'kontak';

-- 2. Update grup "umum" → "hero"
UPDATE pengaturan_situs 
SET grup = 'hero' 
WHERE grup = 'umum';

-- 3. Hapus record whatsapp
DELETE FROM pengaturan_situs 
WHERE kunci = 'whatsapp';

-- 4. Update urutan field di grup footer
-- nama_situs: urutan 1 (jika sudah ada di footer, jika belum akan diinsert nanti)
UPDATE pengaturan_situs 
SET urutan = 1 
WHERE grup = 'footer' AND kunci = 'nama_situs';

UPDATE pengaturan_situs 
SET urutan = 2 
WHERE grup = 'footer' AND kunci = 'deskripsi_situs';

UPDATE pengaturan_situs 
SET urutan = 3 
WHERE grup = 'footer' AND kunci = 'alamat';

UPDATE pengaturan_situs 
SET urutan = 4 
WHERE grup = 'footer' AND kunci = 'email';

UPDATE pengaturan_situs 
SET urutan = 5 
WHERE grup = 'footer' AND kunci = 'telepon';

-- 5. Insert nama_situs dan deskripsi_situs ke grup footer (jika belum ada)
-- Menggunakan kunci yang sama dengan grup hero karena constraint sudah diubah menjadi UNIQUE (kunci, grup)
INSERT INTO pengaturan_situs (kunci, nilai, tipe, deskripsi, grup, urutan)
SELECT 
  'nama_situs',
  COALESCE((SELECT nilai FROM pengaturan_situs WHERE kunci = 'nama_situs' AND grup = 'hero'), 'Portal Pemerintah Kota'),
  'text',
  'Nama Situs (Footer)',
  'footer',
  1
WHERE NOT EXISTS (
  SELECT 1 FROM pengaturan_situs WHERE kunci = 'nama_situs' AND grup = 'footer'
);

INSERT INTO pengaturan_situs (kunci, nilai, tipe, deskripsi, grup, urutan)
SELECT 
  'deskripsi_situs',
  COALESCE((SELECT nilai FROM pengaturan_situs WHERE kunci = 'deskripsi_situs' AND grup = 'hero'), 'Portal informasi resmi pemerintah kota'),
  'text',
  'Deskripsi Situs (Footer)',
  'footer',
  2
WHERE NOT EXISTS (
  SELECT 1 FROM pengaturan_situs WHERE kunci = 'deskripsi_situs' AND grup = 'footer'
);

-- 6. Update urutan field di grup hero
UPDATE pengaturan_situs 
SET urutan = 1 
WHERE grup = 'hero' AND kunci = 'nama_situs';

UPDATE pengaturan_situs 
SET urutan = 2 
WHERE grup = 'hero' AND kunci = 'deskripsi_situs';

-- ============================================
-- Verification
-- ============================================
-- Uncomment untuk verify setelah migration
-- SELECT kunci, nilai, grup, urutan 
-- FROM pengaturan_situs 
-- WHERE grup IN ('footer', 'hero')
-- ORDER BY grup, urutan;

