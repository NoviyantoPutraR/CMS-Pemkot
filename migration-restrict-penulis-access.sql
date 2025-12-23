-- ============================================
-- Migration: Restrict Penulis Access
-- Deskripsi: Membatasi hak akses penulis hanya ke berita dan artikel.
--             Memindahkan agenda_kota, wisata, video, pengumuman, sosial_media ke admin_skpd_options.
-- Tanggal: 2024
-- ============================================

-- ============================================
-- 1. UPDATE KATEGORI HAK AKSES
-- Mengubah kategori dari penulis_options ke admin_skpd_options
-- ============================================

UPDATE hak_akses 
SET 
  kategori = 'admin_skpd_options',
  diperbarui_pada = NOW()
WHERE kode_halaman IN ('agenda_kota', 'wisata', 'video', 'pengumuman', 'sosial_media')
  AND kategori = 'penulis_options';

-- ============================================
-- 2. HAPUS RELASI PENULIS DENGAN 5 HAK AKSES
-- Menghapus semua permission yang sudah diberikan ke penulis untuk 5 halaman tersebut
-- ============================================

DELETE FROM pengguna_hak_akses pha
USING hak_akses ha, pengguna p
WHERE pha.hak_akses_id = ha.id
  AND pha.pengguna_id = p.id
  AND p.peran = 'penulis'
  AND ha.kode_halaman IN ('agenda_kota', 'wisata', 'video', 'pengumuman', 'sosial_media');

-- ============================================
-- 3. VERIFIKASI
-- Query untuk verifikasi perubahan (tidak dieksekusi, hanya untuk reference)
-- ============================================

-- Uncomment query di bawah untuk verifikasi setelah migration:
-- 
-- -- Cek kategori hak_akses setelah update
-- SELECT kode_halaman, nama_halaman, kategori 
-- FROM hak_akses 
-- ORDER BY kategori, kode_halaman;
-- 
-- -- Cek penulis yang masih punya akses ke 5 halaman tersebut (harus 0 rows)
-- SELECT p.email, p.peran, ha.kode_halaman, ha.nama_halaman
-- FROM pengguna_hak_akses pha
-- JOIN pengguna p ON pha.pengguna_id = p.id
-- JOIN hak_akses ha ON pha.hak_akses_id = ha.id
-- WHERE p.peran = 'penulis'
--   AND ha.kode_halaman IN ('agenda_kota', 'wisata', 'video', 'pengumuman', 'sosial_media');
-- 
-- -- Cek semua permission yang dimiliki penulis (harusnya hanya berita dan artikel)
-- SELECT p.email, p.peran, ha.kode_halaman, ha.nama_halaman, ha.kategori
-- FROM pengguna_hak_akses pha
-- JOIN pengguna p ON pha.pengguna_id = p.id
-- JOIN hak_akses ha ON pha.hak_akses_id = ha.id
-- WHERE p.peran = 'penulis'
-- ORDER BY p.email, ha.kode_halaman;

-- ============================================
-- MIGRATION COMPLETED
-- ============================================

