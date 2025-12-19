# Dokumentasi Desain Database CMS Pemerintah Kota

## Overview

Database ini dirancang dengan prinsip:
- **Normalisasi 5NF**: Menghindari redundansi data
- **Single Source of Truth**: Setiap data hanya ada di satu tempat
- **ACID Compliance**: Transaksi database yang konsisten
- **Penamaan Bahasa Indonesia**: Kecuali kolom standar (id, created_at, updated_at)
- **Optimasi Query**: Indexes strategis untuk performa
- **Security**: RLS policies untuk keamanan data

## Struktur Tabel

### 1. pengguna
**Deskripsi**: Manajemen pengguna admin yang terhubung dengan Supabase Auth.

**Kolom**:
- `id` (UUID, PK): Terhubung dengan `auth.users(id)`
- `email` (TEXT): Email admin (unique)
- `peran` (TEXT): 'admin' atau 'super_admin'
- `nama_lengkap` (TEXT): Nama lengkap admin
- `aktif` (BOOLEAN): Status aktif/nonaktif
- `dibuat_pada`, `diperbarui_pada` (TIMESTAMP): Audit trail

**Relasi**: 
- Tidak ada relasi langsung (kolom audit trail sudah dihapus)

**RLS**: Admin hanya bisa CRUD jika `is_admin()` = true

---

### 2. kategori_berita
**Deskripsi**: Kategori untuk mengelompokkan berita.

**Kolom**:
- `id` (UUID, PK)
- `nama` (TEXT): Nama kategori
- `slug` (TEXT, UNIQUE): URL slug
- `deskripsi` (TEXT): Deskripsi kategori
- `urutan` (INTEGER): Untuk sorting
- `dibuat_pada` (TIMESTAMP)

**Indexes**: slug, urutan

**RLS**: Public read, Admin CRUD

---

### 3. berita
**Deskripsi**: Informasi aktual dan cepat berubah (kegiatan wali kota, pengumuman, hasil rapat, rilis resmi).

**Kolom**:
- `id` (UUID, PK)
- `judul` (TEXT): Judul berita
- `slug` (TEXT, UNIQUE): URL slug
- `konten` (TEXT): Konten HTML
- `thumbnail_url` (TEXT): URL thumbnail
- `kategori_id` (UUID, FK): → kategori_berita
- `status` (TEXT): 'draft', 'published', 'archived'
- `meta_description`, `meta_keywords` (TEXT): SEO
- `dilihat` (INTEGER): Counter views
- `dibuat_pada`, `diperbarui_pada`, `dipublikasikan_pada` (TIMESTAMP)

**Indexes**: 
- slug, status, kategori_id, dibuat_pada, dipublikasikan_pada
- Full-text search pada judul (gin_trgm_ops)

**RLS**: Public read (published only), Admin CRUD

**Trigger**: Auto-set `dipublikasikan_pada` saat status berubah ke 'published'

---

### 4. kategori_artikel
**Deskripsi**: Kategori untuk mengelompokkan artikel.

**Struktur**: Sama dengan kategori_berita

---

### 5. artikel
**Deskripsi**: Konten mendalam dan tidak bergantung waktu (edukasi publik, analisis kebijakan, profil daerah, tips layanan).

**Struktur**: Mirip dengan berita, tetapi terpisah untuk perbedaan fungsi.

**Perbedaan dengan Berita**:
- Artikel lebih fokus pada konten edukatif dan analitis
- Berita lebih fokus pada informasi aktual dan cepat berubah

---

### 6. agenda_kota
**Deskripsi**: Agenda kegiatan kota yang dibuat lebih awal dan bisa diperbarui.

**Kolom**:
- `id` (UUID, PK)
- `judul` (TEXT)
- `deskripsi` (TEXT)
- `tanggal_mulai` (TIMESTAMP): Wajib
- `tanggal_selesai` (TIMESTAMP): Opsional
- `lokasi` (TEXT)
- `status` (TEXT): 'draft', 'published', 'selesai', 'dibatalkan'
- `dibuat_pada`, `diperbarui_pada` (TIMESTAMP)

**Indexes**: tanggal_mulai, status, composite (tanggal_mulai, status)

**RLS**: Public read (published only), Admin CRUD

---

### 7. kategori_layanan
**Deskripsi**: Kategori layanan dengan dukungan hierarki (parent-child untuk subkategori).

**Kolom**:
- `id` (UUID, PK)
- `nama` (TEXT)
- `slug` (TEXT, UNIQUE)
- `deskripsi` (TEXT)
- `parent_id` (UUID, FK): → kategori_layanan (self-reference)
- `urutan` (INTEGER)
- `icon_url` (TEXT)
- `dibuat_pada` (TIMESTAMP)

**Hierarki**:
- Kategori utama: `parent_id` = NULL (contoh: "Layanan Publik")
- Subkategori: `parent_id` = UUID kategori utama (contoh: "Pelayanan Pemerintah Kota")

**Indexes**: slug, parent_id, urutan

**RLS**: Public read, Admin CRUD

---

### 8. layanan
**Deskripsi**: Detail layanan publik yang terhubung dengan kategori.

**Kolom**:
- `id` (UUID, PK)
- `judul` (TEXT)
- `slug` (TEXT, UNIQUE)
- `konten` (TEXT): HTML
- `icon_url` (TEXT)
- `kategori_id` (UUID, FK): → kategori_layanan
- `status` (TEXT): 'draft', 'published', 'archived'
- `meta_description` (TEXT)
- `dilihat` (INTEGER)
- `dibuat_pada`, `diperbarui_pada` (TIMESTAMP)

**Indexes**: slug, status, kategori_id, dibuat_pada, full-text search

**RLS**: Public read (published only), Admin CRUD

---

### 9. perangkat_daerah
**Deskripsi**: Tabel terstruktur untuk perangkat daerah.

**Kolom**:
- `id` (UUID, PK)
- `nama_perangkat` (TEXT): Nama perangkat daerah
- `slug` (TEXT, UNIQUE)
- `jabatan_kepala` (TEXT): Jabatan kepala perangkat
- `nama_kepala` (TEXT): Nama kepala perangkat
- `foto_url` (TEXT): URL foto (opsional)
- `kontak` (TEXT): Kontak perangkat (opsional)
- `alamat` (TEXT)
- `deskripsi` (TEXT)
- `urutan` (INTEGER)
- `aktif` (BOOLEAN)
- `dibuat_pada`, `diperbarui_pada` (TIMESTAMP)

**Indexes**: slug, aktif, urutan

**RLS**: Public read (aktif only), Admin CRUD

---

### 10. transparansi_anggaran
**Deskripsi**: Tabel terstruktur untuk anggaran per tahun (2021-2026).

**Kolom**:
- `id` (UUID, PK)
- `tahun` (INTEGER, UNIQUE): Constraint 2021-2026
- `file_excel_url` (TEXT): URL file Excel
- `file_pdf_url` (TEXT): URL file PDF (opsional)
- `deskripsi` (TEXT)
- `status` (TEXT): 'draft', 'published'
- `dibuat_pada`, `diperbarui_pada` (TIMESTAMP)

**Workflow**:
1. Admin pilih tahun
2. Upload file Excel ke Supabase Storage
3. Upload file PDF (opsional)
4. Klik publish
5. Publik bisa lihat daftar tahun dan download file

**Indexes**: tahun, status

**RLS**: Public read (published only), Admin CRUD

---

### 11. halaman
**Deskripsi**: Halaman statis (Visi Misi, Informasi Kota, Tentang, Kontak, dll).

**Kolom**:
- `id` (UUID, PK)
- `slug` (TEXT, UNIQUE)
- `judul` (TEXT)
- `konten` (TEXT): HTML
- `meta_description`, `meta_keywords` (TEXT)
- `dibuat_pada`, `diperbarui_pada` (TIMESTAMP)

**Indexes**: slug

**RLS**: Public read, Admin CRUD

---

### 12. kategori_wisata
**Deskripsi**: Kategori untuk mengelompokkan destinasi wisata.

**Struktur**: Mirip dengan kategori_berita

---

### 13. wisata
**Deskripsi**: Destinasi wisata di kota.

**Kolom**:
- `id` (UUID, PK)
- `nama` (TEXT)
- `slug` (TEXT, UNIQUE)
- `deskripsi` (TEXT)
- `konten` (TEXT): HTML lengkap
- `gambar_url` (TEXT)
- `kategori_id` (UUID, FK): → kategori_wisata
- `alamat` (TEXT)
- `koordinat_lat`, `koordinat_lng` (DECIMAL): Untuk peta
- `status` (TEXT): 'draft', 'published', 'archived'
- `meta_description` (TEXT)
- `dilihat` (INTEGER)
- `dibuat_pada`, `diperbarui_pada` (TIMESTAMP)

**Indexes**: slug, status, kategori_id, koordinat (untuk geospatial queries)

**RLS**: Public read (published only), Admin CRUD

---

### 14. video
**Deskripsi**: Video informasi publik.

**Kolom**:
- `id` (UUID, PK)
- `judul` (TEXT)
- `slug` (TEXT, UNIQUE)
- `deskripsi` (TEXT)
- `url_video` (TEXT): URL YouTube, Vimeo, atau file video
- `thumbnail_url` (TEXT)
- `durasi` (INTEGER): Durasi dalam detik
- `status` (TEXT): 'draft', 'published', 'archived'
- `dilihat` (INTEGER)
- `dibuat_pada`, `diperbarui_pada` (TIMESTAMP)

**Indexes**: slug, status, dibuat_pada

**RLS**: Public read (published only), Admin CRUD

---

### 15. pengumuman
**Deskripsi**: Pengumuman resmi dari pemerintah kota.

**Kolom**:
- `id` (UUID, PK)
- `judul` (TEXT)
- `slug` (TEXT, UNIQUE)
- `konten` (TEXT): HTML
- `file_lampiran_url` (TEXT): File lampiran (opsional)
- `status` (TEXT): 'draft', 'published', 'archived'
- `tanggal_berlaku_mulai`, `tanggal_berlaku_selesai` (DATE): Untuk otomatisasi
- `dibuat_pada`, `diperbarui_pada`, `dipublikasikan_pada` (TIMESTAMP)

**Indexes**: slug, status, tanggal_berlaku_mulai, dipublikasikan_pada

**RLS**: Public read (published only), Admin CRUD

**Trigger**: Auto-set `dipublikasikan_pada` saat status berubah ke 'published'

---

### 16. sosial_media
**Deskripsi**: Link sosial media (Instagram, Facebook, X, YouTube, TikTok).

**Kolom**:
- `id` (UUID, PK)
- `platform` (TEXT, UNIQUE): 'instagram', 'facebook', 'twitter', 'youtube', 'tiktok'
- `url` (TEXT): URL profil/platform
- `ikon_url` (TEXT): URL ikon custom (opsional)
- `aktif` (BOOLEAN): Dapat diaktifkan/nonaktifkan
- `urutan` (INTEGER)
- `dibuat_pada`, `diperbarui_pada` (TIMESTAMP)

**Indexes**: platform, aktif, urutan

**RLS**: Public read (aktif only), Admin CRUD

---

### 17. pengaturan_situs
**Deskripsi**: Pengaturan umum situs menggunakan key-value pattern.

**Kolom**:
- `id` (UUID, PK)
- `kunci` (TEXT, UNIQUE): Key pengaturan
- `nilai` (TEXT): Value pengaturan
- `tipe` (TEXT): 'text', 'url', 'email', 'phone', 'number', 'boolean'
- `deskripsi` (TEXT)
- `grup` (TEXT): Pengelompokan (contoh: 'kontak', 'umum')
- `urutan` (INTEGER)
- `dibuat_pada`, `diperbarui_pada` (TIMESTAMP)

**Contoh Data**:
- `alamat`: Alamat Pemerintah Kota
- `whatsapp`: Nomor WhatsApp
- `email`: Email kontak
- `telepon`: Nomor telepon
- `nama_situs`: Nama situs
- `deskripsi_situs`: Deskripsi situs

**Indexes**: kunci, grup

**RLS**: Public read, Admin CRUD

---

## Relasi Antar Tabel

### Diagram Relasi

```
pengguna (1) ──┐
               │
               ├──> berita (N)
                     ├──> artikel (N)
                     ├──> agenda_kota (N)
                     ├──> layanan (N)
                     ├──> perangkat_daerah (N)
                     ├──> transparansi_anggaran (N)
                     ├──> halaman (N)
                     ├──> wisata (N)
                     ├──> video (N)
                     ├──> infografis (N)
                     └──> pengumuman (N)

kategori_berita (1) ──> berita (N)
kategori_artikel (1) ──> artikel (N)
kategori_layanan (1) ──> layanan (N)
kategori_layanan (1) ──> kategori_layanan (N) [self-reference untuk hierarki]
kategori_wisata (1) ──> wisata (N)
```

---

## Indexes Strategy

### Single Column Indexes
- **slug**: Untuk semua tabel dengan slug (fast lookup)
- **status**: Untuk filtering berdasarkan status
- **dibuat_pada**: Untuk sorting berdasarkan tanggal
- **Foreign keys**: Untuk performa join

### Composite Indexes
- `(status, dibuat_pada DESC)`: Untuk query "latest published"
- `(tanggal_mulai, status)`: Untuk agenda kota yang akan datang

### Full-Text Search Indexes
- **GIN indexes** dengan `pg_trgm` extension untuk:
  - `berita.judul`
  - `artikel.judul`
  - `layanan.judul`
  - `wisata.nama`

---

## Row Level Security (RLS)

### Prinsip RLS

1. **Public Access**: 
   - SELECT untuk konten dengan `status = 'published'`
   - SELECT untuk data yang `aktif = true`
   - SELECT untuk halaman dan pengaturan (selalu readable)

2. **Admin Access**:
   - CRUD penuh untuk semua tabel
   - Menggunakan helper function `is_admin()` yang check `pengguna.id = auth.uid() AND aktif = true`

3. **Conditional Policies**:
   - Berita/Artikel: Public hanya bisa baca yang published
   - Admin bisa baca semua (draft, published, archived)

### Helper Function

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pengguna
    WHERE id = auth.uid() AND aktif = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Triggers

### 1. Auto-update `diperbarui_pada`
**Function**: `update_updated_at_column()`
**Applied to**: Semua tabel dengan kolom `diperbarui_pada`

### 2. Auto-set `dipublikasikan_pada`
**Function**: `set_published_at()`
**Applied to**: 
- `berita`
- `artikel`
- `pengumuman`

**Logic**: Set `dipublikasikan_pada = NOW()` saat status berubah dari non-published ke 'published'

---

## Storage Buckets

### Bucket Structure

1. **berita**: Thumbnail berita
2. **artikel**: Thumbnail artikel
3. **layanan**: Icon/gambar layanan
4. **wisata**: Gambar wisata
5. **perangkat_daerah**: Foto perangkat daerah
6. **transparansi**: File Excel dan PDF anggaran
7. **video**: File video (jika tidak menggunakan URL eksternal)
8. **infografis**: File infografis
9. **pengumuman**: File lampiran pengumuman
10. **assets**: Assets umum

### Storage Policies
File terpisah: `supabase-storage-policies-redesigned.sql`

---

## Normalisasi 5NF

### Prinsip yang Diterapkan

1. **1NF**: Semua kolom atomic (tidak ada array atau nested data)
2. **2NF**: Tidak ada partial dependency (semua non-key attributes fully dependent on primary key)
3. **3NF**: Tidak ada transitive dependency
4. **4NF**: Tidak ada multi-valued dependency
5. **5NF**: Tidak ada join dependency yang tidak trivial

### Contoh Normalisasi

**Kategori Layanan dengan Hierarki**:
- Menggunakan self-reference (`parent_id`) daripada denormalisasi
- Setiap kategori hanya memiliki satu parent (atau NULL)
- Tidak ada redundansi data kategori

**Timestamps**:
- `dibuat_pada` dan `diperbarui_pada` untuk tracking waktu
- `dipublikasikan_pada` terpisah untuk tracking kapan dipublish

---

## ACID Compliance

### Atomicity
- Semua transaksi database atomic (all or nothing)
- Foreign key constraints dengan ON DELETE CASCADE/SET NULL

### Consistency
- CHECK constraints untuk validasi data (status, tahun, peran, dll)
- UNIQUE constraints untuk mencegah duplikasi
- NOT NULL constraints untuk data wajib

### Isolation
- RLS policies memastikan isolasi data per user
- Admin hanya bisa akses data sesuai permission

### Durability
- PostgreSQL ACID guarantees
- Timestamp untuk audit trail

---

## Optimasi Query

### Query Patterns yang Dioptimalkan

1. **Latest Published Content**:
   - Composite index: `(status, dibuat_pada DESC)`
   - WHERE clause: `status = 'published' ORDER BY dibuat_pada DESC`

2. **Search by Slug**:
   - Unique index pada `slug`
   - Fast lookup untuk detail pages

3. **Filter by Category**:
   - Index pada foreign key `kategori_id`
   - Fast join dengan tabel kategori

4. **Full-Text Search**:
   - GIN indexes dengan `pg_trgm`
   - Query: `WHERE judul ILIKE '%keyword%'` atau menggunakan full-text search

5. **Hierarchical Categories**:
   - Index pada `parent_id`
   - Recursive query untuk mendapatkan semua subkategori

---

## Data Inisial

### Halaman Statis Default
- `tentang`: Tentang Kami
- `kontak`: Kontak
- `visi-misi`: Visi Misi
- `informasi-kota`: Informasi Kota
- `struktur-organisasi`: Struktur Organisasi

### Pengaturan Situs Default
- `alamat`: Alamat Pemerintah Kota
- `whatsapp`: Nomor WhatsApp
- `email`: Email kontak
- `telepon`: Nomor telepon
- `nama_situs`: Nama situs
- `deskripsi_situs`: Deskripsi situs

### Sosial Media Default
- Instagram, Facebook, Twitter, YouTube, TikTok (semua inactive by default)

---

## Migration dari Schema Lama

### Tabel yang Tetap
- `pengguna`: Struktur sama, hanya tambah kolom `aktif`
- `kategori_berita`: Struktur sama, tambah `deskripsi` dan `urutan`
- `berita`: Struktur sama, tambah `dipublikasikan_pada`, `meta_keywords`, `dilihat`
- `layanan`: Struktur sama, tambah `slug`, `kategori_id`, `status`, `meta_description`, `dilihat`
- `halaman`: Struktur sama

### Tabel Baru
- `artikel` dan `kategori_artikel`
- `agenda_kota`
- `kategori_layanan` (dengan hierarki)
- `perangkat_daerah`
- `transparansi_anggaran`
- `kategori_wisata` dan `wisata`
- `video`
- `pengumuman`
- `sosial_media`
- `pengaturan_situs`

### Migration Steps
1. Backup data existing
2. Run `supabase-schema-redesigned.sql`
3. Migrate data dari schema lama ke schema baru
4. Update service files di frontend
5. Test semua fitur

---

## Best Practices

1. **Penamaan**: Konsisten menggunakan Bahasa Indonesia
2. **Timestamps**: Selalu gunakan `TIMESTAMP WITH TIME ZONE`
3. **UUID**: Gunakan UUID untuk semua primary keys
4. **Slugs**: Unique dan URL-friendly
5. **Status**: Gunakan enum-like dengan CHECK constraint
6. **Soft Delete**: Gunakan status 'archived' daripada hard delete
7. **Audit Trail**: Selalu track `dibuat_oleh`, `diperbarui_oleh`, timestamps
8. **Indexes**: Jangan over-index, hanya index yang diperlukan untuk query patterns
9. **RLS**: Always enable RLS, buat policies yang jelas
10. **Foreign Keys**: Selalu gunakan ON DELETE CASCADE/SET NULL sesuai kebutuhan

---

## Maintenance

### Regular Tasks
1. Monitor query performance
2. Update indexes jika query patterns berubah
3. Review RLS policies untuk security
4. Backup database secara berkala
5. Monitor storage usage

### Monitoring Queries
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;

-- Check index usage
SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;
```

---

## Kesimpulan

Database ini dirancang untuk:
- **Skalabilitas**: Mendukung pertumbuhan data
- **Performansi**: Indexes strategis untuk query cepat
- **Keamanan**: RLS policies untuk proteksi data
- **Maintainability**: Struktur yang jelas dan terdokumentasi
- **Fleksibilitas**: Mendukung fitur-fitur baru di masa depan

