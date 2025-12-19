-- ============================================
-- Storage Policies untuk CMS Pemerintah Kota
-- Sesuai dengan struktur database redesigned
-- ============================================

-- Helper function untuk check admin
-- (Sudah dibuat di supabase-schema-redesigned.sql, tapi diulang di sini untuk referensi)
-- CREATE OR REPLACE FUNCTION is_admin()
-- RETURNS BOOLEAN AS $$
-- BEGIN
--   RETURN EXISTS (
--     SELECT 1 FROM admin_pengguna
--     WHERE id = auth.uid() AND aktif = true
--   );
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- BUCKET: berita
-- ============================================
-- Storage untuk thumbnail berita

-- Public: Baca semua file
CREATE POLICY "Public dapat membaca thumbnail berita"
ON storage.objects FOR SELECT
USING (bucket_id = 'berita');

-- Admin: Upload file
CREATE POLICY "Admin dapat upload thumbnail berita"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'berita' AND
  is_admin()
);

-- Admin: Update file
CREATE POLICY "Admin dapat update thumbnail berita"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'berita' AND
  is_admin()
);

-- Admin: Delete file
CREATE POLICY "Admin dapat menghapus thumbnail berita"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'berita' AND
  is_admin()
);

-- ============================================
-- BUCKET: artikel
-- ============================================
-- Storage untuk thumbnail artikel

CREATE POLICY "Public dapat membaca thumbnail artikel"
ON storage.objects FOR SELECT
USING (bucket_id = 'artikel');

CREATE POLICY "Admin dapat upload thumbnail artikel"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'artikel' AND
  is_admin()
);

CREATE POLICY "Admin dapat update thumbnail artikel"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'artikel' AND
  is_admin()
);

CREATE POLICY "Admin dapat menghapus thumbnail artikel"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'artikel' AND
  is_admin()
);

-- ============================================
-- BUCKET: layanan
-- ============================================
-- Storage untuk icon/gambar layanan

CREATE POLICY "Public dapat membaca icon layanan"
ON storage.objects FOR SELECT
USING (bucket_id = 'layanan');

CREATE POLICY "Admin dapat upload icon layanan"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'layanan' AND
  is_admin()
);

CREATE POLICY "Admin dapat update icon layanan"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'layanan' AND
  is_admin()
);

CREATE POLICY "Admin dapat menghapus icon layanan"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'layanan' AND
  is_admin()
);

-- ============================================
-- BUCKET: wisata
-- ============================================
-- Storage untuk gambar wisata

CREATE POLICY "Public dapat membaca gambar wisata"
ON storage.objects FOR SELECT
USING (bucket_id = 'wisata');

CREATE POLICY "Admin dapat upload gambar wisata"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wisata' AND
  is_admin()
);

CREATE POLICY "Admin dapat update gambar wisata"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'wisata' AND
  is_admin()
);

CREATE POLICY "Admin dapat menghapus gambar wisata"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wisata' AND
  is_admin()
);

-- ============================================
-- BUCKET: perangkat_daerah
-- ============================================
-- Storage untuk foto perangkat daerah

CREATE POLICY "Public dapat membaca foto perangkat daerah"
ON storage.objects FOR SELECT
USING (bucket_id = 'perangkat_daerah');

CREATE POLICY "Admin dapat upload foto perangkat daerah"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'perangkat_daerah' AND
  is_admin()
);

CREATE POLICY "Admin dapat update foto perangkat daerah"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'perangkat_daerah' AND
  is_admin()
);

CREATE POLICY "Admin dapat menghapus foto perangkat daerah"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'perangkat_daerah' AND
  is_admin()
);

-- ============================================
-- BUCKET: transparansi
-- ============================================
-- Storage untuk file Excel dan PDF anggaran

CREATE POLICY "Public dapat membaca file transparansi anggaran"
ON storage.objects FOR SELECT
USING (bucket_id = 'transparansi');

CREATE POLICY "Admin dapat upload file transparansi anggaran"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'transparansi' AND
  is_admin()
);

CREATE POLICY "Admin dapat update file transparansi anggaran"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'transparansi' AND
  is_admin()
);

CREATE POLICY "Admin dapat menghapus file transparansi anggaran"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'transparansi' AND
  is_admin()
);

-- ============================================
-- BUCKET: video
-- ============================================
-- Storage untuk file video (jika tidak menggunakan URL eksternal)

CREATE POLICY "Public dapat membaca file video"
ON storage.objects FOR SELECT
USING (bucket_id = 'video');

CREATE POLICY "Admin dapat upload file video"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'video' AND
  is_admin()
);

CREATE POLICY "Admin dapat update file video"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'video' AND
  is_admin()
);

CREATE POLICY "Admin dapat menghapus file video"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'video' AND
  is_admin()
);

-- ============================================
-- BUCKET: infografis
-- ============================================
-- Storage untuk file infografis

CREATE POLICY "Public dapat membaca file infografis"
ON storage.objects FOR SELECT
USING (bucket_id = 'infografis');

CREATE POLICY "Admin dapat upload file infografis"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'infografis' AND
  is_admin()
);

CREATE POLICY "Admin dapat update file infografis"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'infografis' AND
  is_admin()
);

CREATE POLICY "Admin dapat menghapus file infografis"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'infografis' AND
  is_admin()
);

-- ============================================
-- BUCKET: pengumuman
-- ============================================
-- Storage untuk file lampiran pengumuman

CREATE POLICY "Public dapat membaca file lampiran pengumuman"
ON storage.objects FOR SELECT
USING (bucket_id = 'pengumuman');

CREATE POLICY "Admin dapat upload file lampiran pengumuman"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pengumuman' AND
  is_admin()
);

CREATE POLICY "Admin dapat update file lampiran pengumuman"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pengumuman' AND
  is_admin()
);

CREATE POLICY "Admin dapat menghapus file lampiran pengumuman"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pengumuman' AND
  is_admin()
);

-- ============================================
-- BUCKET: assets
-- ============================================
-- Storage untuk assets umum

CREATE POLICY "Public dapat membaca assets umum"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

CREATE POLICY "Admin dapat upload assets umum"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assets' AND
  is_admin()
);

CREATE POLICY "Admin dapat update assets umum"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'assets' AND
  is_admin()
);

CREATE POLICY "Admin dapat menghapus assets umum"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assets' AND
  is_admin()
);

-- ============================================
-- CATATAN PENTING
-- ============================================

-- 1. Pastikan semua bucket sudah dibuat di Supabase Dashboard:
--    - berita
--    - artikel
--    - layanan
--    - wisata
--    - perangkat_daerah
--    - transparansi
--    - video
--    - infografis
--    - pengumuman
--    - assets

-- 2. Function is_admin() harus sudah dibuat di database
--    (sudah ada di supabase-schema-redesigned.sql)

-- 3. Storage policies ini menggunakan RLS yang sama dengan database policies
--    - Public: Read-only access
--    - Admin: Full CRUD access

-- 4. Untuk file upload validation, lakukan di application layer:
--    - File type validation
--    - File size limits
--    - Image dimensions (jika diperlukan)

