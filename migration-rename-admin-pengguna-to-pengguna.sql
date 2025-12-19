-- ============================================
-- Migration: Rename admin_pengguna to pengguna
-- ============================================

-- Rename tabel
ALTER TABLE admin_pengguna RENAME TO pengguna;

-- ============================================
-- Update Indexes
-- ============================================
ALTER INDEX IF EXISTS idx_admin_pengguna_email RENAME TO idx_pengguna_email;
ALTER INDEX IF EXISTS idx_admin_pengguna_peran RENAME TO idx_pengguna_peran;
ALTER INDEX IF EXISTS idx_admin_pengguna_aktif RENAME TO idx_pengguna_aktif;

-- ============================================
-- Update Trigger
-- ============================================
DROP TRIGGER IF EXISTS update_admin_pengguna_updated_at ON pengguna;
CREATE TRIGGER update_pengguna_updated_at 
  BEFORE UPDATE ON pengguna
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Update RLS Policies
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Admin dapat melihat semua admin" ON pengguna;
DROP POLICY IF EXISTS "Admin dapat menambah admin baru" ON pengguna;
DROP POLICY IF EXISTS "Admin dapat mengupdate admin" ON pengguna;
DROP POLICY IF EXISTS "Admin dapat menghapus admin" ON pengguna;

-- Create new policies dengan nama konsisten
CREATE POLICY "Admin dapat melihat semua pengguna" 
  ON pengguna FOR SELECT 
  USING (is_admin());

CREATE POLICY "Admin dapat menambah pengguna baru"
  ON pengguna FOR INSERT 
  WITH CHECK (is_admin());

CREATE POLICY "Admin dapat mengupdate pengguna"
  ON pengguna FOR UPDATE 
  USING (is_admin());

CREATE POLICY "Admin dapat menghapus pengguna"
  ON pengguna FOR DELETE 
  USING (is_admin() AND id != auth.uid());

-- ============================================
-- Update Comments (jika ada)
-- ============================================
COMMENT ON TABLE pengguna IS 'Manajemen pengguna admin yang terhubung dengan Supabase Auth. Menggunakan peran untuk membedakan admin dan super_admin.';

-- ============================================
-- Verification
-- ============================================
-- Uncomment untuk verify setelah migration
-- SELECT 
--   tablename, 
--   indexname 
-- FROM pg_indexes 
-- WHERE tablename = 'pengguna';
-- 
-- SELECT 
--   schemaname,
--   tablename,
--   policyname
-- FROM pg_policies
-- WHERE tablename = 'pengguna';

