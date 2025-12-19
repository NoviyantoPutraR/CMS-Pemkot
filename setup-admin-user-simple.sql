-- ============================================
-- Setup Admin User Pertama - Versi Sederhana
-- ============================================
-- 
-- INSTRUKSI:
-- 1. Buat user terlebih dahulu di Supabase Dashboard:
--    - Buka Authentication > Users
--    - Klik "Add User" atau "Invite User"
--    - Email: admin@example.com
--    - Password: sahabatadmin
--    - Set "Auto Confirm User" = true
--    - Copy User ID yang baru dibuat
--
-- 2. Ganti 'PASTE_USER_ID_HERE' di bawah dengan User ID yang sudah di-copy
--
-- 3. Jalankan script SQL ini di Supabase SQL Editor
-- ============================================

-- Insert ke tabel pengguna
-- GANTI 'PASTE_USER_ID_HERE' dengan UUID user dari Supabase Auth
INSERT INTO pengguna (id, email, peran, nama_lengkap)
VALUES (
  'PASTE_USER_ID_HERE', -- ⚠️ GANTI INI dengan UUID dari Supabase Auth
  'admin@example.com',
  'admin',
  'Putra Ramadhan'
)
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  nama_lengkap = EXCLUDED.nama_lengkap,
  peran = EXCLUDED.peran;

-- Verifikasi
SELECT * FROM pengguna WHERE email = 'admin@example.com';

