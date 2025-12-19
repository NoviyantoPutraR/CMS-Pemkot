-- ============================================
-- Fix Existing Data: Update dibuat_oleh untuk user yang NULL
-- Deskripsi: Set dibuat_oleh untuk user yang belum punya (untuk existing data)
-- Tanggal: 2024
-- ============================================

-- ============================================
-- OPTION 1: Set dibuat_oleh = id untuk Superadmin
-- (Superadmin dibuat sendiri, tidak ada creator)
-- ============================================
UPDATE pengguna
SET dibuat_oleh = id
WHERE peran = 'superadmin' 
  AND dibuat_oleh IS NULL;

-- ============================================
-- OPTION 2: Set dibuat_oleh untuk Admin SKPD
-- Jika ada multiple superadmin, pilih yang pertama
-- ============================================
UPDATE pengguna p1
SET dibuat_oleh = (
  SELECT id FROM pengguna 
  WHERE peran = 'superadmin' 
  ORDER BY dibuat_pada ASC 
  LIMIT 1
)
WHERE p1.peran = 'admin_skpd' 
  AND p1.dibuat_oleh IS NULL;

-- ============================================
-- OPTION 3: Set dibuat_oleh untuk Penulis
-- Set ke Admin SKPD pertama yang ada (atau superadmin jika tidak ada admin_skpd)
-- ============================================
UPDATE pengguna p1
SET dibuat_oleh = COALESCE(
  (
    SELECT id FROM pengguna 
    WHERE peran = 'admin_skpd' 
    ORDER BY dibuat_pada ASC 
    LIMIT 1
  ),
  (
    SELECT id FROM pengguna 
    WHERE peran = 'superadmin' 
    ORDER BY dibuat_pada ASC 
    LIMIT 1
  )
)
WHERE p1.peran = 'penulis' 
  AND p1.dibuat_oleh IS NULL;

-- ============================================
-- Verify: Check masih ada NULL tidak
-- ============================================
SELECT 
  peran,
  COUNT(*) as total,
  COUNT(dibuat_oleh) as dengan_dibuat_oleh,
  COUNT(*) - COUNT(dibuat_oleh) as tanpa_dibuat_oleh
FROM pengguna
GROUP BY peran;

-- Expected: tanpa_dibuat_oleh = 0 untuk semua peran
-- (kecuali superadmin, dimana dibuat_oleh = id sendiri adalah valid)

-- ============================================
-- Show data yang sudah di-update
-- ============================================
SELECT 
  p1.id,
  p1.email,
  p1.peran,
  p1.dibuat_oleh,
  p2.email as dibuat_oleh_email,
  p2.peran as dibuat_oleh_peran
FROM pengguna p1
LEFT JOIN pengguna p2 ON p1.dibuat_oleh = p2.id
ORDER BY p1.dibuat_pada DESC;

