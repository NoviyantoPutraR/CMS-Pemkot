-- ============================================
-- Storage Buckets & Policies
-- ============================================

-- Create storage buckets (run di Supabase Dashboard atau via API)
-- Bucket: berita
-- Bucket: layanan
-- Bucket: assets

-- Policies untuk bucket 'berita'
-- Public: Baca semua file
CREATE POLICY "Berita thumbnail dapat dibaca semua orang"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'berita');

-- Admin: Upload file
CREATE POLICY "Admin dapat upload thumbnail berita"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'berita' AND
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Update file
CREATE POLICY "Admin dapat update thumbnail berita"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'berita' AND
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Delete file
CREATE POLICY "Admin dapat hapus thumbnail berita"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'berita' AND
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Policies untuk bucket 'layanan'
-- Public: Baca semua file
CREATE POLICY "Layanan icon dapat dibaca semua orang"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'layanan');

-- Admin: Upload file
CREATE POLICY "Admin dapat upload icon layanan"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'layanan' AND
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Update file
CREATE POLICY "Admin dapat update icon layanan"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'layanan' AND
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Delete file
CREATE POLICY "Admin dapat hapus icon layanan"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'layanan' AND
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Policies untuk bucket 'assets'
-- Public: Baca semua file
CREATE POLICY "Assets dapat dibaca semua orang"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assets');

-- Admin: Upload file
CREATE POLICY "Admin dapat upload assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'assets' AND
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Update file
CREATE POLICY "Admin dapat update assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'assets' AND
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

-- Admin: Delete file
CREATE POLICY "Admin dapat hapus assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'assets' AND
    EXISTS (
      SELECT 1 FROM admin_pengguna
      WHERE admin_pengguna.id = auth.uid()
    )
  );

