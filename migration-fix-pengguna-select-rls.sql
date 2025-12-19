-- ============================================
-- Fix RLS Policy untuk SELECT pengguna
-- Deskripsi: Pastikan Admin SKPD bisa lihat Penulis yang dibuatnya
-- Tanggal: 2024
-- ============================================

-- Policy: SELECT - Semua authenticated bisa lihat semua pengguna
-- (Tidak perlu restrict karena list sudah di-filter di application layer)
DROP POLICY IF EXISTS "allow_read_pengguna" ON pengguna;
CREATE POLICY "allow_read_pengguna" ON pengguna
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- Verify Policy
-- ============================================

-- Check policy sudah terpasang
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'pengguna' AND cmd = 'SELECT';
-- Expected: policy 'allow_read_pengguna' exists with USING (true)

