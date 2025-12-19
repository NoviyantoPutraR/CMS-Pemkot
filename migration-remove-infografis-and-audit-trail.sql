-- ============================================
-- Migration: Hapus Tabel Infografis dan Kolom Audit Trail
-- ============================================

-- 1. Hapus tabel infografis
DROP TABLE IF EXISTS infografis CASCADE;

-- 2. Hapus kolom dibuat_oleh dari semua tabel
ALTER TABLE berita DROP COLUMN IF EXISTS dibuat_oleh;
ALTER TABLE artikel DROP COLUMN IF EXISTS dibuat_oleh;
ALTER TABLE agenda_kota DROP COLUMN IF EXISTS dibuat_oleh;
ALTER TABLE layanan DROP COLUMN IF EXISTS dibuat_oleh;
ALTER TABLE perangkat_daerah DROP COLUMN IF EXISTS dibuat_oleh;
ALTER TABLE transparansi_anggaran DROP COLUMN IF EXISTS dibuat_oleh;
ALTER TABLE wisata DROP COLUMN IF EXISTS dibuat_oleh;
ALTER TABLE video DROP COLUMN IF EXISTS dibuat_oleh;
ALTER TABLE pengumuman DROP COLUMN IF EXISTS dibuat_oleh;

-- 3. Hapus kolom diperbarui_oleh dari halaman
ALTER TABLE halaman DROP COLUMN IF EXISTS diperbarui_oleh;

-- 4. Hapus indexes yang terkait dengan kolom dibuat_oleh
DROP INDEX IF EXISTS idx_berita_dibuat_oleh;
DROP INDEX IF EXISTS idx_artikel_dibuat_oleh;
DROP INDEX IF EXISTS idx_layanan_dibuat_oleh;
DROP INDEX IF EXISTS idx_agenda_kota_dibuat_oleh;
DROP INDEX IF EXISTS idx_perangkat_daerah_dibuat_oleh;
DROP INDEX IF EXISTS idx_transparansi_anggaran_dibuat_oleh;
DROP INDEX IF EXISTS idx_wisata_dibuat_oleh;
DROP INDEX IF EXISTS idx_video_dibuat_oleh;
DROP INDEX IF EXISTS idx_pengumuman_dibuat_oleh;
DROP INDEX IF EXISTS idx_infografis_dibuat_oleh;

-- 5. Hapus indexes yang terkait dengan kolom diperbarui_oleh
DROP INDEX IF EXISTS idx_halaman_diperbarui_oleh;

-- Catatan: Foreign key constraints akan otomatis terhapus saat kolom dihapus
-- RLS policies tidak perlu diubah karena tidak reference kolom audit trail

