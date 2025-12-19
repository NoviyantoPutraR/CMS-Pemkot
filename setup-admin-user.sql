-- ============================================
-- Setup Admin User Pertama
-- ============================================
-- Email: admin@example.com
-- Password: sahabatadmin
-- Nama Lengkap: Putra Ramadhan
-- ============================================

-- Buat user di Supabase Auth
-- Note: Gunakan Supabase Dashboard > Authentication > Users > Add User
-- atau gunakan Management API untuk create user
-- Setelah user dibuat, jalankan script di bawah untuk insert ke pengguna

-- Insert ke tabel pengguna
-- GANTI 'USER_ID_DARI_SUPABASE_AUTH' dengan UUID user yang baru dibuat
INSERT INTO pengguna (id, email, peran, nama_lengkap)
VALUES (
  'USER_ID_DARI_SUPABASE_AUTH', -- Ganti dengan UUID dari Supabase Auth
  'admin@example.com',
  'admin',
  'Putra Ramadhan'
)
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  nama_lengkap = EXCLUDED.nama_lengkap;

-- ============================================
-- ALTERNATIF: Jika ingin membuat user langsung via SQL
-- (Hanya jika Supabase Auth settings mengizinkan)
-- ============================================

-- Buat user via auth.users (jika memiliki akses)
-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at,
--   raw_app_meta_data,
--   raw_user_meta_data,
--   is_super_admin,
--   confirmation_token,
--   email_change,
--   email_change_token_new,
--   recovery_token
-- )
-- VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   'admin@example.com',
--   crypt('sahabatadmin', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW(),
--   '{"provider":"email","providers":["email"]}',
--   '{}',
--   false,
--   '',
--   '',
--   '',
--   ''
-- );

