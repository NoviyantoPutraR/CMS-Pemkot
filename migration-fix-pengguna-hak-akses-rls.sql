-- ============================================
-- Fix RLS Policy untuk pengguna_hak_akses
-- Deskripsi: Perbaiki policy INSERT agar Admin SKPD bisa assign permissions ke Penulis
-- Tanggal: 2024
-- ============================================

-- Policy: INSERT - Superadmin bisa assign ke admin_skpd, Admin SKPD bisa assign ke penulis
-- IMPORTANT: Pastikan user pengguna sudah di-create dengan dibuat_oleh = auth.uid() SEBELUM insert permissions
DROP POLICY IF EXISTS "allow_assign_permissions" ON pengguna_hak_akses;
CREATE POLICY "allow_assign_permissions" ON pengguna_hak_akses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Superadmin bisa assign ke semua admin_skpd
    is_superadmin() OR
    (
      -- Admin SKPD bisa assign ke penulis yang dibuatnya
      -- Note: pengguna_id di WITH CHECK clause refers to the column being inserted
      is_admin_skpd() AND 
      pengguna_id IN (
        SELECT id FROM pengguna 
        WHERE dibuat_oleh = auth.uid() 
          AND peran = 'penulis'
      )
    )
  );

-- ============================================
-- Verify Policy
-- ============================================

-- Check policy sudah terpasang
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'pengguna_hak_akses' AND cmd = 'INSERT';
-- Expected: policy 'allow_assign_permissions' exists

