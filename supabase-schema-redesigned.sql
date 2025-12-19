-- ============================================
-- Database Schema Redesigned untuk CMS Pemerintah Kota
-- Penamaan Bahasa Indonesia, Normalisasi 5NF, ACID Compliance
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Untuk full-text search

-- ============================================
-- TABEL UTAMA
-- ============================================

-- 1. Tabel: pengguna
-- Deskripsi: Manajemen pengguna admin yang terhubung dengan Supabase Auth
CREATE TABLE IF NOT EXISTS pengguna (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  peran TEXT NOT NULL DEFAULT 'admin' CHECK (peran IN ('admin', 'super_admin')),
  nama_lengkap TEXT,
  aktif BOOLEAN NOT NULL DEFAULT true,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel: berita
-- Deskripsi: Informasi aktual dan cepat berubah (kegiatan wali kota, pengumuman, hasil rapat, rilis resmi)
CREATE TABLE IF NOT EXISTS berita (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  konten TEXT NOT NULL,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_description TEXT,
  meta_keywords TEXT,
  dilihat INTEGER DEFAULT 0,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dipublikasikan_pada TIMESTAMP WITH TIME ZONE
);

-- 3. Tabel: artikel
-- Deskripsi: Konten mendalam dan tidak bergantung waktu (edukasi publik, analisis kebijakan, profil daerah, tips layanan)
CREATE TABLE IF NOT EXISTS artikel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  konten TEXT NOT NULL,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_description TEXT,
  meta_keywords TEXT,
  dilihat INTEGER DEFAULT 0,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dipublikasikan_pada TIMESTAMP WITH TIME ZONE
);

-- 4. Tabel: agenda_kota
-- Deskripsi: Agenda kegiatan kota yang dibuat lebih awal dan bisa diperbarui
CREATE TABLE IF NOT EXISTS agenda_kota (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  deskripsi TEXT,
  tanggal_mulai TIMESTAMP WITH TIME ZONE NOT NULL,
  tanggal_selesai TIMESTAMP WITH TIME ZONE,
  lokasi TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'selesai', 'dibatalkan')),
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel: layanan
-- Deskripsi: Detail layanan publik
CREATE TABLE IF NOT EXISTS layanan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  konten TEXT NOT NULL,
  icon_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_description TEXT,
  dilihat INTEGER DEFAULT 0,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabel: perangkat_daerah
-- Deskripsi: Tabel terstruktur untuk perangkat daerah
CREATE TABLE IF NOT EXISTS perangkat_daerah (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_perangkat TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  jabatan_kepala TEXT,
  nama_kepala TEXT,
  foto_url TEXT,
  kontak TEXT,
  alamat TEXT,
  deskripsi TEXT,
  urutan INTEGER DEFAULT 0,
  aktif BOOLEAN NOT NULL DEFAULT true,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabel: transparansi_anggaran
-- Deskripsi: Tabel terstruktur untuk anggaran per tahun dengan file Excel dan PDF
CREATE TABLE IF NOT EXISTS transparansi_anggaran (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tahun INTEGER NOT NULL UNIQUE CHECK (tahun >= 2021 AND tahun <= 2026),
  file_excel_url TEXT,
  file_pdf_url TEXT,
  deskripsi TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabel: halaman
-- Deskripsi: Halaman statis (Visi Misi, Informasi Kota, Tentang, Kontak, dll)
CREATE TABLE IF NOT EXISTS halaman (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  judul TEXT NOT NULL,
  konten TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabel: wisata
-- Deskripsi: Destinasi wisata di kota
CREATE TABLE IF NOT EXISTS wisata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  deskripsi TEXT NOT NULL,
  konten TEXT,
  gambar_url TEXT,
  alamat TEXT,
  koordinat_lat DECIMAL(10, 8),
  koordinat_lng DECIMAL(11, 8),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_description TEXT,
  dilihat INTEGER DEFAULT 0,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Tabel: video
-- Deskripsi: Video informasi publik
CREATE TABLE IF NOT EXISTS video (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  deskripsi TEXT,
  url_video TEXT NOT NULL, -- URL YouTube, Vimeo, atau file video
  thumbnail_url TEXT,
  durasi INTEGER, -- Durasi dalam detik
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  dilihat INTEGER DEFAULT 0,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Tabel: pengumuman
-- Deskripsi: Pengumuman resmi dari pemerintah kota
CREATE TABLE IF NOT EXISTS pengumuman (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  konten TEXT NOT NULL,
  file_lampiran_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tanggal_berlaku_mulai DATE,
  tanggal_berlaku_selesai DATE,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dipublikasikan_pada TIMESTAMP WITH TIME ZONE
);

-- 14. Tabel: sosial_media
-- Deskripsi: Link sosial media (Instagram, Facebook, X, YouTube, TikTok)
CREATE TABLE IF NOT EXISTS sosial_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL UNIQUE CHECK (platform IN ('instagram', 'facebook', 'twitter', 'youtube', 'tiktok')),
  url TEXT NOT NULL,
  ikon_url TEXT,
  aktif BOOLEAN NOT NULL DEFAULT true,
  urutan INTEGER DEFAULT 0,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Tabel: pengaturan_situs
-- Deskripsi: Pengaturan umum situs (alamat, WhatsApp, email, dll)
CREATE TABLE IF NOT EXISTS pengaturan_situs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kunci TEXT NOT NULL UNIQUE,
  nilai TEXT NOT NULL,
  tipe TEXT NOT NULL DEFAULT 'text' CHECK (tipe IN ('text', 'url', 'email', 'phone', 'number', 'boolean')),
  deskripsi TEXT,
  grup TEXT, -- Untuk mengelompokkan pengaturan
  urutan INTEGER DEFAULT 0,
  dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES UNTUK OPTIMASI QUERY
-- ============================================

-- Indexes untuk pengguna
CREATE INDEX IF NOT EXISTS idx_pengguna_email ON pengguna(email);
CREATE INDEX IF NOT EXISTS idx_pengguna_peran ON pengguna(peran);
CREATE INDEX IF NOT EXISTS idx_pengguna_aktif ON pengguna(aktif);

-- Indexes untuk berita
CREATE INDEX IF NOT EXISTS idx_berita_slug ON berita(slug);
CREATE INDEX IF NOT EXISTS idx_berita_status ON berita(status);
CREATE INDEX IF NOT EXISTS idx_berita_dibuat_pada ON berita(dibuat_pada DESC);
CREATE INDEX IF NOT EXISTS idx_berita_dipublikasikan_pada ON berita(dipublikasikan_pada DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_berita_status_dibuat_pada ON berita(status, dibuat_pada DESC);
-- Full-text search index untuk judul dan konten
CREATE INDEX IF NOT EXISTS idx_berita_judul_trgm ON berita USING gin(judul gin_trgm_ops);

-- Indexes untuk artikel
CREATE INDEX IF NOT EXISTS idx_artikel_slug ON artikel(slug);
CREATE INDEX IF NOT EXISTS idx_artikel_status ON artikel(status);
CREATE INDEX IF NOT EXISTS idx_artikel_dibuat_pada ON artikel(dibuat_pada DESC);
CREATE INDEX IF NOT EXISTS idx_artikel_dipublikasikan_pada ON artikel(dipublikasikan_pada DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_artikel_judul_trgm ON artikel USING gin(judul gin_trgm_ops);

-- Indexes untuk agenda_kota
CREATE INDEX IF NOT EXISTS idx_agenda_kota_tanggal_mulai ON agenda_kota(tanggal_mulai);
CREATE INDEX IF NOT EXISTS idx_agenda_kota_status ON agenda_kota(status);
CREATE INDEX IF NOT EXISTS idx_agenda_kota_tanggal_status ON agenda_kota(tanggal_mulai, status) WHERE status = 'published';

-- Indexes untuk layanan
CREATE INDEX IF NOT EXISTS idx_layanan_slug ON layanan(slug);
CREATE INDEX IF NOT EXISTS idx_layanan_status ON layanan(status);
CREATE INDEX IF NOT EXISTS idx_layanan_dibuat_pada ON layanan(dibuat_pada DESC);
CREATE INDEX IF NOT EXISTS idx_layanan_judul_trgm ON layanan USING gin(judul gin_trgm_ops);

-- Indexes untuk perangkat_daerah
CREATE INDEX IF NOT EXISTS idx_perangkat_daerah_slug ON perangkat_daerah(slug);
CREATE INDEX IF NOT EXISTS idx_perangkat_daerah_aktif ON perangkat_daerah(aktif);
CREATE INDEX IF NOT EXISTS idx_perangkat_daerah_urutan ON perangkat_daerah(urutan);

-- Indexes untuk transparansi_anggaran
CREATE INDEX IF NOT EXISTS idx_transparansi_anggaran_tahun ON transparansi_anggaran(tahun DESC);
CREATE INDEX IF NOT EXISTS idx_transparansi_anggaran_status ON transparansi_anggaran(status);

-- Indexes untuk halaman
CREATE INDEX IF NOT EXISTS idx_halaman_slug ON halaman(slug);

-- Indexes untuk wisata
CREATE INDEX IF NOT EXISTS idx_wisata_slug ON wisata(slug);
CREATE INDEX IF NOT EXISTS idx_wisata_status ON wisata(status);
CREATE INDEX IF NOT EXISTS idx_wisata_dibuat_pada ON wisata(dibuat_pada DESC);
CREATE INDEX IF NOT EXISTS idx_wisata_nama_trgm ON wisata USING gin(nama gin_trgm_ops);

-- Indexes untuk video
CREATE INDEX IF NOT EXISTS idx_video_slug ON video(slug);
CREATE INDEX IF NOT EXISTS idx_video_status ON video(status);
CREATE INDEX IF NOT EXISTS idx_video_dibuat_pada ON video(dibuat_pada DESC);

-- Indexes untuk pengumuman
CREATE INDEX IF NOT EXISTS idx_pengumuman_slug ON pengumuman(slug);
CREATE INDEX IF NOT EXISTS idx_pengumuman_status ON pengumuman(status);
CREATE INDEX IF NOT EXISTS idx_pengumuman_tanggal_berlaku_mulai ON pengumuman(tanggal_berlaku_mulai);
CREATE INDEX IF NOT EXISTS idx_pengumuman_dipublikasikan_pada ON pengumuman(dipublikasikan_pada DESC) WHERE status = 'published';

-- Indexes untuk sosial_media
CREATE INDEX IF NOT EXISTS idx_sosial_media_platform ON sosial_media(platform);
CREATE INDEX IF NOT EXISTS idx_sosial_media_aktif ON sosial_media(aktif);
CREATE INDEX IF NOT EXISTS idx_sosial_media_urutan ON sosial_media(urutan);

-- Indexes untuk pengaturan_situs
CREATE INDEX IF NOT EXISTS idx_pengaturan_situs_kunci ON pengaturan_situs(kunci);
CREATE INDEX IF NOT EXISTS idx_pengaturan_situs_grup ON pengaturan_situs(grup);

-- ============================================
-- FUNCTIONS DAN TRIGGERS
-- ============================================

-- Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.diperbarui_pada = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers untuk auto-update updated_at
CREATE TRIGGER update_pengguna_updated_at BEFORE UPDATE ON pengguna
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_berita_updated_at BEFORE UPDATE ON berita
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artikel_updated_at BEFORE UPDATE ON artikel
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agenda_kota_updated_at BEFORE UPDATE ON agenda_kota
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_layanan_updated_at BEFORE UPDATE ON layanan
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_perangkat_daerah_updated_at BEFORE UPDATE ON perangkat_daerah
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transparansi_anggaran_updated_at BEFORE UPDATE ON transparansi_anggaran
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_halaman_updated_at BEFORE UPDATE ON halaman
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wisata_updated_at BEFORE UPDATE ON wisata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_updated_at BEFORE UPDATE ON video
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pengumuman_updated_at BEFORE UPDATE ON pengumuman
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sosial_media_updated_at BEFORE UPDATE ON sosial_media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pengaturan_situs_updated_at BEFORE UPDATE ON pengaturan_situs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function untuk auto-set dipublikasikan_pada saat status berubah ke published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.dipublikasikan_pada = NOW();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers untuk auto-set dipublikasikan_pada
CREATE TRIGGER set_berita_published_at BEFORE UPDATE ON berita
  FOR EACH ROW EXECUTE FUNCTION set_published_at();

CREATE TRIGGER set_artikel_published_at BEFORE UPDATE ON artikel
  FOR EACH ROW EXECUTE FUNCTION set_published_at();

CREATE TRIGGER set_pengumuman_published_at BEFORE UPDATE ON pengumuman
  FOR EACH ROW EXECUTE FUNCTION set_published_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS untuk semua tabel
ALTER TABLE pengguna ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE artikel ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_kota ENABLE ROW LEVEL SECURITY;
ALTER TABLE layanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE perangkat_daerah ENABLE ROW LEVEL SECURITY;
ALTER TABLE transparansi_anggaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE halaman ENABLE ROW LEVEL SECURITY;
ALTER TABLE wisata ENABLE ROW LEVEL SECURITY;
ALTER TABLE video ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE sosial_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengaturan_situs ENABLE ROW LEVEL SECURITY;

-- Helper function untuk check admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pengguna
    WHERE id = auth.uid() AND aktif = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- POLICIES UNTUK pengguna
-- ============================================

-- Admin dapat melihat semua pengguna
CREATE POLICY "Admin dapat melihat semua pengguna"
  ON pengguna FOR SELECT
  USING (is_admin());

-- Admin dapat menambah pengguna baru
CREATE POLICY "Admin dapat menambah pengguna baru"
  ON pengguna FOR INSERT
  WITH CHECK (is_admin());

-- Admin dapat mengupdate pengguna
CREATE POLICY "Admin dapat mengupdate pengguna"
  ON pengguna FOR UPDATE
  USING (is_admin());

-- Admin dapat menghapus pengguna (tidak bisa delete diri sendiri)
CREATE POLICY "Admin dapat menghapus pengguna"
  ON pengguna FOR DELETE
  USING (is_admin() AND id != auth.uid());

-- ============================================
-- POLICIES UNTUK berita
-- ============================================

-- Public: Baca berita yang published
CREATE POLICY "Berita published dapat dibaca semua orang"
  ON berita FOR SELECT
  USING (status = 'published');

-- Admin: Baca semua berita
CREATE POLICY "Admin dapat melihat semua berita"
  ON berita FOR SELECT
  USING (is_admin());

-- Admin: Insert berita
CREATE POLICY "Admin dapat menambah berita"
  ON berita FOR INSERT
  WITH CHECK (is_admin());

-- Admin: Update berita
CREATE POLICY "Admin dapat mengupdate berita"
  ON berita FOR UPDATE
  USING (is_admin());

-- Admin: Delete berita
CREATE POLICY "Admin dapat menghapus berita"
  ON berita FOR DELETE
  USING (is_admin());

-- ============================================
-- POLICIES UNTUK artikel
-- ============================================

-- Public: Baca artikel yang published
CREATE POLICY "Artikel published dapat dibaca semua orang"
  ON artikel FOR SELECT
  USING (status = 'published');

-- Admin: Baca semua artikel
CREATE POLICY "Admin dapat melihat semua artikel"
  ON artikel FOR SELECT
  USING (is_admin());

-- Admin: Insert artikel
CREATE POLICY "Admin dapat menambah artikel"
  ON artikel FOR INSERT
  WITH CHECK (is_admin());

-- Admin: Update artikel
CREATE POLICY "Admin dapat mengupdate artikel"
  ON artikel FOR UPDATE
  USING (is_admin());

-- Admin: Delete artikel
CREATE POLICY "Admin dapat menghapus artikel"
  ON artikel FOR DELETE
  USING (is_admin());

-- ============================================
-- POLICIES UNTUK agenda_kota
-- ============================================

-- Public: Baca agenda yang published
CREATE POLICY "Agenda kota published dapat dibaca semua orang"
  ON agenda_kota FOR SELECT
  USING (status = 'published');

-- Admin: Baca semua agenda
CREATE POLICY "Admin dapat melihat semua agenda kota"
  ON agenda_kota FOR SELECT
  USING (is_admin());

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola agenda kota"
  ON agenda_kota FOR ALL
  USING (is_admin());

-- ============================================
-- POLICIES UNTUK layanan
-- ============================================

-- Public: Baca layanan yang published
CREATE POLICY "Layanan published dapat dibaca semua orang"
  ON layanan FOR SELECT
  USING (status = 'published');

-- Admin: Baca semua layanan
CREATE POLICY "Admin dapat melihat semua layanan"
  ON layanan FOR SELECT
  USING (is_admin());

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola layanan"
  ON layanan FOR ALL
  USING (is_admin());

-- ============================================
-- POLICIES UNTUK perangkat_daerah
-- ============================================

-- Public: Baca perangkat daerah yang aktif
CREATE POLICY "Perangkat daerah aktif dapat dibaca semua orang"
  ON perangkat_daerah FOR SELECT
  USING (aktif = true);

-- Admin: Baca semua perangkat daerah
CREATE POLICY "Admin dapat melihat semua perangkat daerah"
  ON perangkat_daerah FOR SELECT
  USING (is_admin());

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola perangkat daerah"
  ON perangkat_daerah FOR ALL
  USING (is_admin());

-- ============================================
-- POLICIES UNTUK transparansi_anggaran
-- ============================================

-- Public: Baca anggaran yang published
CREATE POLICY "Anggaran published dapat dibaca semua orang"
  ON transparansi_anggaran FOR SELECT
  USING (status = 'published');

-- Admin: Baca semua anggaran
CREATE POLICY "Admin dapat melihat semua anggaran"
  ON transparansi_anggaran FOR SELECT
  USING (is_admin());

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola transparansi anggaran"
  ON transparansi_anggaran FOR ALL
  USING (is_admin());

-- ============================================
-- POLICIES UNTUK halaman
-- ============================================

-- Public: Baca semua halaman
CREATE POLICY "Halaman dapat dibaca semua orang"
  ON halaman FOR SELECT
  USING (true);

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola halaman"
  ON halaman FOR ALL
  USING (is_admin());

-- ============================================
-- POLICIES UNTUK wisata
-- ============================================

-- Public: Baca wisata yang published
CREATE POLICY "Wisata published dapat dibaca semua orang"
  ON wisata FOR SELECT
  USING (status = 'published');

-- Admin: Baca semua wisata
CREATE POLICY "Admin dapat melihat semua wisata"
  ON wisata FOR SELECT
  USING (is_admin());

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola wisata"
  ON wisata FOR ALL
  USING (is_admin());

-- ============================================
-- POLICIES UNTUK video
-- ============================================

-- Public: Baca video yang published
CREATE POLICY "Video published dapat dibaca semua orang"
  ON video FOR SELECT
  USING (status = 'published');

-- Admin: Baca semua video
CREATE POLICY "Admin dapat melihat semua video"
  ON video FOR SELECT
  USING (is_admin());

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola video"
  ON video FOR ALL
  USING (is_admin());

-- ============================================
-- POLICIES UNTUK pengumuman
-- ============================================

-- Public: Baca pengumuman yang published
CREATE POLICY "Pengumuman published dapat dibaca semua orang"
  ON pengumuman FOR SELECT
  USING (status = 'published');

-- Admin: Baca semua pengumuman
CREATE POLICY "Admin dapat melihat semua pengumuman"
  ON pengumuman FOR SELECT
  USING (is_admin());

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola pengumuman"
  ON pengumuman FOR ALL
  USING (is_admin());

-- ============================================
-- POLICIES UNTUK sosial_media
-- ============================================

-- Public: Baca sosial media yang aktif
CREATE POLICY "Sosial media aktif dapat dibaca semua orang"
  ON sosial_media FOR SELECT
  USING (aktif = true);

-- Admin: Baca semua sosial media
CREATE POLICY "Admin dapat melihat semua sosial media"
  ON sosial_media FOR SELECT
  USING (is_admin());

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola sosial media"
  ON sosial_media FOR ALL
  USING (is_admin());

-- ============================================
-- POLICIES UNTUK pengaturan_situs
-- ============================================

-- Public: Baca semua pengaturan
CREATE POLICY "Pengaturan situs dapat dibaca semua orang"
  ON pengaturan_situs FOR SELECT
  USING (true);

-- Admin: CRUD penuh
CREATE POLICY "Admin dapat mengelola pengaturan situs"
  ON pengaturan_situs FOR ALL
  USING (is_admin());

-- ============================================
-- DATA INISIAL
-- ============================================

-- Insert halaman statis default
INSERT INTO halaman (slug, judul, konten) VALUES
  ('tentang', 'Tentang Kami', '<p>Halaman tentang pemerintah kota. Silakan edit konten ini.</p>'),
  ('kontak', 'Kontak', '<p>Informasi kontak pemerintah kota. Silakan edit konten ini.</p>'),
  ('visi-misi', 'Visi Misi', '<p>Visi dan misi pemerintah kota. Silakan edit konten ini.</p>'),
  ('informasi-kota', 'Informasi Kota', '<p>Informasi tentang kota. Silakan edit konten ini.</p>'),
  ('struktur-organisasi', 'Struktur Organisasi', '<p>Struktur organisasi pemerintah kota. Silakan edit konten ini.</p>')
ON CONFLICT (slug) DO NOTHING;

-- Insert pengaturan situs default
INSERT INTO pengaturan_situs (kunci, nilai, tipe, deskripsi, grup) VALUES
  ('alamat', 'Jl. Contoh No. 123, Kota Contoh', 'text', 'Alamat Pemerintah Kota', 'kontak'),
  ('whatsapp', '6281234567890', 'phone', 'Nomor WhatsApp', 'kontak'),
  ('email', 'info@pemerintahkota.go.id', 'email', 'Email Kontak', 'kontak'),
  ('telepon', '(021) 1234-5678', 'phone', 'Nomor Telepon', 'kontak'),
  ('nama_situs', 'Portal Pemerintah Kota', 'text', 'Nama Situs', 'umum'),
  ('deskripsi_situs', 'Portal informasi resmi pemerintah kota', 'text', 'Deskripsi Situs', 'umum')
ON CONFLICT (kunci) DO NOTHING;

-- Insert sosial media default (inactive)
INSERT INTO sosial_media (platform, url, aktif) VALUES
  ('instagram', 'https://instagram.com/pemerintahkota', false),
  ('facebook', 'https://facebook.com/pemerintahkota', false),
  ('twitter', 'https://twitter.com/pemerintahkota', false),
  ('youtube', 'https://youtube.com/@pemerintahkota', false),
  ('tiktok', 'https://tiktok.com/@pemerintahkota', false)
ON CONFLICT (platform) DO NOTHING;

-- ============================================
-- KOMENTAR DESAIN
-- ============================================

COMMENT ON TABLE pengguna IS 'Manajemen pengguna admin yang terhubung dengan Supabase Auth. Menggunakan peran untuk membedakan admin dan super_admin.';
COMMENT ON TABLE berita IS 'Informasi aktual dan cepat berubah. Memiliki status draft/published/archived. Auto-set dipublikasikan_pada saat publish.';
COMMENT ON TABLE artikel IS 'Konten mendalam dan tidak bergantung waktu. Terpisah dari berita untuk perbedaan fungsi.';
COMMENT ON TABLE agenda_kota IS 'Agenda kegiatan kota yang dibuat lebih awal dan bisa diperbarui. Memiliki tanggal_mulai dan tanggal_selesai.';
COMMENT ON TABLE layanan IS 'Detail layanan publik.';
COMMENT ON TABLE perangkat_daerah IS 'Tabel terstruktur untuk perangkat daerah. Minimal berisi nama_perangkat, jabatan_kepala, foto, kontak.';
COMMENT ON TABLE transparansi_anggaran IS 'Tabel terstruktur untuk anggaran per tahun (2021-2026). Admin upload file Excel/PDF, publik download.';
COMMENT ON TABLE halaman IS 'Halaman statis untuk konten yang jarang berubah seperti Visi Misi, Informasi Kota, dll.';
COMMENT ON TABLE wisata IS 'Destinasi wisata di kota. Mendukung koordinat untuk peta.';
COMMENT ON TABLE video IS 'Video informasi publik. Mendukung URL YouTube/Vimeo atau file video.';
COMMENT ON TABLE pengumuman IS 'Pengumuman resmi dari pemerintah kota. Memiliki tanggal berlaku untuk otomatisasi.';
COMMENT ON TABLE sosial_media IS 'Link sosial media (Instagram, Facebook, X, YouTube, TikTok). Dapat diaktifkan/nonaktifkan.';
COMMENT ON TABLE pengaturan_situs IS 'Pengaturan umum situs menggunakan key-value. Mendukung berbagai tipe data dan pengelompokan.';

COMMENT ON COLUMN transparansi_anggaran.tahun IS 'Tahun anggaran dengan constraint 2021-2026 sesuai requirement.';
COMMENT ON COLUMN pengaturan_situs.tipe IS 'Tipe data untuk validasi: text, url, email, phone, number, boolean.';
COMMENT ON COLUMN pengaturan_situs.grup IS 'Pengelompokan pengaturan untuk kemudahan manajemen di admin panel.';

