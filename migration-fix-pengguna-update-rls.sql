-- ============================================
-- Fix RLS Policy untuk UPDATE pengguna
-- Deskripsi: Allow Admin SKPD untuk update Penulis yang dibuatnya (termasuk toggle status)
-- Tanggal: 2024
-- ============================================

-- Drop existing policy
DROP POLICY IF EXISTS "allow_update_pengguna" ON pengguna;

-- Create new policy yang lebih eksplisit
CREATE POLICY "allow_update_pengguna" ON pengguna
  FOR UPDATE
  TO authenticated
  USING (
    -- Superadmin bisa update semua user
    is_superadmin() OR
    -- Admin SKPD bisa update Penulis yang dibuatnya
    (
      is_admin_skpd() AND 
      EXISTS (
        SELECT 1 FROM pengguna p
        WHERE p.id = pengguna.id
          AND p.dibuat_oleh = auth.uid()
          AND p.peran = 'penulis'
      )
    ) OR
    -- Semua user bisa update sendiri (untuk nama_lengkap)
    id = auth.uid()
  );

-- ============================================
-- Verify Policy
-- ============================================

-- Check policy sudah terpasang
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'pengguna' AND cmd = 'UPDATE';
-- Expected: policy 'allow_update_pengguna' exists

-- ============================================
-- Test Query (untuk debugging)
-- ============================================

-- Check apakah policy work untuk Admin SKPD
-- (Jalankan sebagai Admin SKPD yang sedang login)
-- SELECT 
--   id,
--   email,
--   peran,
--   dibuat_oleh,
--   is_admin_skpd() as is_admin_check,
--   CASE 
--     WHEN is_admin_skpd() AND EXISTS (
--       SELECT 1 FROM pengguna p
--       WHERE p.id = pengguna.id
--         AND p.dibuat_oleh = auth.uid()
--         AND p.peran = 'penulis'
--     ) THEN 'CAN_UPDATE'
--     WHEN id = auth.uid() THEN 'CAN_UPDATE_SELF'
--     ELSE 'CANNOT_UPDATE'
--   END as update_permission
-- FROM pengguna
-- WHERE peran = 'penulis';

