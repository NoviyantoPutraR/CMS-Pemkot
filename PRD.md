# Product Requirement Document (PRD)
## CMS Website Pemerintah Kota

**Versi**: 2.3 (Updated setelah Restriksi Hak Akses Penulis)  
**Tanggal Update**: 2024  
**Status**: Active Development

### Changelog

**Versi 2.3 - Restriksi Hak Akses Penulis:**
- ✅ Pembatasan hak akses penulis hanya ke berita dan artikel
- ✅ Pemindahan agenda_kota, wisata, video, pengumuman, sosial_media ke admin_skpd_options
- ✅ Penghapusan otomatis hak akses penulis yang sudah ada untuk 5 halaman tersebut
- ✅ Update seed data migration untuk kategori hak akses baru

**Versi 2.2 - Database Cleanup & Role-Permission System:**
- ✅ Penghapusan kolom `nama_skpd` dari tabel `pengguna`
- ✅ Penghapusan kolom `dibuat_oleh` dari semua tabel konten (berita, artikel, agenda_kota, layanan, perangkat_daerah, transparansi_anggaran, wisata, video, pengumuman)
- ✅ Penghapusan kolom `diperbarui_oleh` dari tabel `halaman`
- ✅ Penghapusan tabel `infografis` (tidak digunakan)
- ✅ Simplifikasi struktur database dengan menghapus audit trail columns
- ✅ Implementasi sistem Role & Permission Management dengan tabel `hak_akses` dan `pengguna_hak_akses`
- ✅ Sistem peran bertingkat: superadmin → admin_skpd → penulis
- ✅ Hak akses dinamis berbasis database untuk fleksibilitas

**Versi 2.1 - Simplifikasi Kategori:**
- ✅ Penghapusan tabel kategori_berita dan kategori_artikel
- ✅ Penghapusan kolom kategori_id dari tabel berita dan artikel
- ✅ Penghapusan tabel kategori_layanan dan kategori_wisata
- ✅ Penghapusan kolom kategori_id dari tabel layanan dan wisata
- ✅ Simplifikasi struktur berita, artikel, layanan, dan wisata tanpa kategori
- ✅ Update fitur admin panel untuk remove kategori management

**Versi 2.0 - Database Redesign:**
- ✅ Penambahan 9 tabel baru (artikel, agenda_kota, perangkat_daerah, transparansi_anggaran, wisata, video, pengumuman, sosial_media, pengaturan_situs)
- ✅ Pemisahan berita dan artikel (berita untuk informasi aktual, artikel untuk konten mendalam)
- ✅ Fitur transparansi anggaran dengan upload file Excel/PDF
- ✅ Manajemen perangkat daerah dengan foto dan kontak
- ✅ Manajemen destinasi wisata dengan koordinat peta
- ✅ Manajemen konten multimedia (video)
- ✅ Manajemen pengumuman resmi dengan file lampiran
- ✅ Manajemen sosial media dan pengaturan situs
- ✅ Peningkatan struktur database dengan normalisasi 5NF
- ✅ Penambahan kolom untuk SEO (meta_keywords, meta_description)
- ✅ Penambahan counter views (dilihat) untuk tracking
- ✅ Status aktif/nonaktif untuk admin dan perangkat daerah
- ✅ Auto-triggers untuk timestamps dan published date
- ✅ Storage buckets diperluas dari 3 menjadi 10 buckets

**Versi 1.0 - Initial Release:**
- Fitur dasar: berita, layanan, halaman statis, manajemen admin

### 1. Executive Summary

Website CMS untuk Pemerintah Kota dengan dua bagian utama:
- **Public Website**: Tampilan publik untuk warga
- **Admin CMS Panel**: Panel administrasi untuk mengelola konten

### 2. Objectives

- Menyediakan platform publik untuk informasi pemerintah kota
- Memudahkan admin dalam mengelola konten (berita, artikel, layanan, agenda, wisata, video, pengumuman, halaman)
- Menyediakan sistem manajemen pengguna admin
- Menyediakan fitur pencarian dan filter untuk konten
- Menyediakan transparansi anggaran untuk publik
- Menyediakan informasi perangkat daerah
- Menyediakan manajemen konten multimedia (video)

### 3. Target Users

#### 3.1 Public Users
- Warga kota yang mencari informasi
- Pengunjung website

#### 3.2 Admin Users
- Admin yang mengelola konten
- Super admin yang mengelola pengguna

### 4. Technical Stack

- **Frontend**: ReactJS + Vite + TailwindCSS
- **Backend**: Supabase (Database, Auth, Storage)
- **State Management**: Zustand
- **Routing**: React Router v6
- **UI Components**: Shadcn UI (Admin Panel)
- **Rich Text Editor**: React Quill
- **Form Validation**: React Hook Form + Zod

### 5. Database Schema

Database dirancang dengan prinsip normalisasi 5NF, ACID compliance, dan penamaan Bahasa Indonesia. Total 15 tabel utama (setelah penghapusan kategori_berita, kategori_artikel, kategori_layanan, kategori_wisata, dan infografis; serta penambahan hak_akses dan pengguna_hak_akses untuk sistem role & permission).

**Prinsip Desain:**
- **Normalisasi 5NF**: Menghindari redundansi data, setiap data hanya ada di satu tempat
- **ACID Compliance**: Transaksi database yang konsisten dan reliable
- **Penamaan Bahasa Indonesia**: Semua tabel dan kolom menggunakan Bahasa Indonesia (kecuali id, created_at, updated_at)
- **Optimasi Query**: Indexes strategis untuk performa query
- **Security**: Row Level Security (RLS) policies untuk keamanan data
- **Timestamps**: Tracking dibuat_pada, diperbarui_pada untuk semua tabel

#### 5.1 Tabel: `pengguna`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key (linked ke Supabase Auth) |
| email | text | Email admin (unique) |
| peran | text | 'superadmin', 'admin_skpd', atau 'penulis' |
| nama_lengkap | text | Nama lengkap (nullable) |
| aktif | boolean | Status aktif/nonaktif |
| dibuat_oleh | uuid | ID pengguna yang membuat (nullable, untuk tracking admin yang membuat penulis) |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |

**Catatan**: Kolom `nama_skpd` sudah dihapus. Sistem menggunakan role-based permission system dengan peran: superadmin, admin_skpd, dan penulis.

#### 5.2 Tabel: `berita`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| judul | text | Judul berita |
| slug | text | URL slug (unique) |
| konten | text | Konten berita (HTML) |
| thumbnail_url | text | URL thumbnail |
| status | text | 'draft', 'published', 'archived' |
| meta_description | text | Meta description untuk SEO |
| meta_keywords | text | Meta keywords untuk SEO |
| dilihat | integer | Counter views |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |
| dipublikasikan_pada | timestamp | Waktu dipublikasikan |

**Deskripsi**: Informasi aktual dan cepat berubah (kegiatan wali kota, pengumuman, hasil rapat, rilis resmi). **Catatan**: Tidak menggunakan kategori (tabel kategori_berita sudah dihapus). Kolom `dibuat_oleh` sudah dihapus untuk simplifikasi.

#### 5.3 Tabel: `artikel`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| judul | text | Judul artikel |
| slug | text | URL slug (unique) |
| konten | text | Konten artikel (HTML) |
| thumbnail_url | text | URL thumbnail |
| status | text | 'draft', 'published', 'archived' |
| meta_description | text | Meta description untuk SEO |
| meta_keywords | text | Meta keywords untuk SEO |
| dilihat | integer | Counter views |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |
| dipublikasikan_pada | timestamp | Waktu dipublikasikan |

**Deskripsi**: Konten mendalam dan tidak bergantung waktu (edukasi publik, analisis kebijakan, profil daerah, tips layanan). **Catatan**: Tidak menggunakan kategori (tabel kategori_artikel sudah dihapus). Kolom `dibuat_oleh` sudah dihapus untuk simplifikasi.

#### 5.4 Tabel: `agenda_kota`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| judul | text | Judul agenda |
| deskripsi | text | Deskripsi agenda |
| tanggal_mulai | timestamp | Waktu mulai (wajib) |
| tanggal_selesai | timestamp | Waktu selesai (opsional) |
| lokasi | text | Lokasi kegiatan |
| status | text | 'draft', 'published', 'selesai', 'dibatalkan' |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |

**Catatan**: Kolom `dibuat_oleh` sudah dihapus untuk simplifikasi.

#### 5.6 Tabel: `layanan`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| judul | text | Judul layanan |
| slug | text | URL slug (unique) |
| konten | text | Konten layanan (HTML) |
| icon_url | text | URL icon/gambar |
| status | text | 'draft', 'published', 'archived' |
| meta_description | text | Meta description untuk SEO |
| dilihat | integer | Counter views |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |

**Catatan**: Tabel `layanan` tidak menggunakan kategori (kolom `kategori_id` sudah dihapus). Kolom `dibuat_oleh` sudah dihapus untuk simplifikasi.

#### 5.7 Tabel: `perangkat_daerah`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| nama_perangkat | text | Nama perangkat daerah |
| slug | text | URL slug (unique) |
| jabatan_kepala | text | Jabatan kepala perangkat |
| nama_kepala | text | Nama kepala perangkat |
| foto_url | text | URL foto (opsional) |
| kontak | text | Kontak perangkat (opsional) |
| alamat | text | Alamat perangkat |
| deskripsi | text | Deskripsi perangkat |
| urutan | integer | Untuk sorting |
| aktif | boolean | Status aktif/nonaktif |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |

**Catatan**: Kolom `dibuat_oleh` sudah dihapus untuk simplifikasi.

#### 5.8 Tabel: `transparansi_anggaran`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| tahun | integer | Tahun anggaran (2021-2026, unique) |
| file_excel_url | text | URL file Excel |
| file_pdf_url | text | URL file PDF (opsional) |
| deskripsi | text | Deskripsi anggaran |
| status | text | 'draft', 'published' |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |

**Catatan**: Kolom `dibuat_oleh` sudah dihapus untuk simplifikasi.

#### 5.9 Tabel: `halaman`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| slug | text | URL slug (unique) |
| judul | text | Judul halaman |
| konten | text | Konten halaman (HTML) |
| meta_description | text | Meta description untuk SEO |
| meta_keywords | text | Meta keywords untuk SEO |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |

**Catatan**: Kolom `diperbarui_oleh` sudah dihapus untuk simplifikasi.


#### 5.11 Tabel: `wisata`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| nama | text | Nama destinasi wisata |
| slug | text | URL slug (unique) |
| deskripsi | text | Deskripsi singkat |
| konten | text | Konten lengkap (HTML) |
| gambar_url | text | URL gambar utama |
| alamat | text | Alamat destinasi |
| koordinat_lat | decimal | Latitude untuk peta |
| koordinat_lng | decimal | Longitude untuk peta |
| status | text | 'draft', 'published', 'archived' |
| meta_description | text | Meta description untuk SEO |
| dilihat | integer | Counter views |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |

**Catatan**: Tabel `wisata` tidak menggunakan kategori (kolom `kategori_id` sudah dihapus). Kolom `dibuat_oleh` sudah dihapus untuk simplifikasi.

#### 5.12 Tabel: `video`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| judul | text | Judul video |
| slug | text | URL slug (unique) |
| deskripsi | text | Deskripsi video |
| url_video | text | URL YouTube, Vimeo, atau file video |
| thumbnail_url | text | URL thumbnail |
| durasi | integer | Durasi dalam detik |
| status | text | 'draft', 'published', 'archived' |
| dilihat | integer | Counter views |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |

**Catatan**: Kolom `dibuat_oleh` sudah dihapus untuk simplifikasi.

#### 5.13 Tabel: `pengumuman`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| judul | text | Judul pengumuman |
| slug | text | URL slug (unique) |
| konten | text | Konten pengumuman (HTML) |
| file_lampiran_url | text | URL file lampiran (opsional) |
| status | text | 'draft', 'published', 'archived' |
| tanggal_berlaku_mulai | date | Tanggal mulai berlaku |
| tanggal_berlaku_selesai | date | Tanggal selesai berlaku |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |
| dipublikasikan_pada | timestamp | Waktu dipublikasikan |

**Catatan**: Kolom `dibuat_oleh` sudah dihapus untuk simplifikasi.

#### 5.15 Tabel: `sosial_media`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| platform | text | 'instagram', 'facebook', 'twitter', 'youtube', 'tiktok' (unique) |
| url | text | URL profil/platform |
| ikon_url | text | URL ikon custom (opsional) |
| aktif | boolean | Status aktif/nonaktif |
| urutan | integer | Untuk sorting |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |

#### 5.16 Tabel: `pengaturan_situs`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| kunci | text | Key pengaturan (unique per grup) |
| nilai | text | Value pengaturan |
| tipe | text | 'text', 'url', 'email', 'phone', 'number', 'boolean' |
| deskripsi | text | Deskripsi pengaturan |
| grup | text | Pengelompokan (contoh: 'footer', 'hero') |
| urutan | integer | Untuk sorting |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |

**Deskripsi**: Pengaturan umum situs menggunakan key-value pattern dengan constraint UNIQUE (kunci, grup) untuk memungkinkan kunci yang sama di grup berbeda. Grup 'footer' berisi: nama_situs, deskripsi_situs, alamat, email, telepon. Grup 'hero' berisi: nama_situs, deskripsi_situs.

#### 5.17 Tabel: `hak_akses`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| kode_halaman | text | Kode unik halaman (berita, artikel, dll) (unique) |
| nama_halaman | text | Nama tampilan halaman |
| deskripsi | text | Deskripsi halaman (nullable) |
| kategori | text | 'superadmin_only', 'admin_skpd_options', 'penulis_options' |
| dibuat_pada | timestamp | Waktu dibuat |
| diperbarui_pada | timestamp | Waktu diperbarui |

**Deskripsi**: Tabel master untuk hak akses halaman. Menggunakan sistem role-based permission dengan 3 kategori:
- **superadmin_only**: Hanya dapat diakses superadmin (dashboard, manajemen_pengguna)
- **admin_skpd_options**: Dapat diakses Admin SKPD (layanan, perangkat_daerah, transparansi, halaman, pengaturan, agenda_kota, wisata, video, pengumuman, sosial_media)
- **penulis_options**: Dapat diakses Penulis (berita, artikel)

**Catatan**: Data di tabel ini adalah seed data dan tidak dapat diubah melalui aplikasi (read-only untuk authenticated users).

#### 5.18 Tabel: `pengguna_hak_akses`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| pengguna_id | uuid | Foreign key ke `pengguna.id` (ON DELETE CASCADE) |
| hak_akses_id | uuid | Foreign key ke `hak_akses.id` (ON DELETE CASCADE) |
| dibuat_pada | timestamp | Waktu dibuat |
| UNIQUE(pengguna_id, hak_akses_id) | | Constraint untuk mencegah duplikasi |

**Deskripsi**: Junction table untuk relasi many-to-many antara pengguna dan hak akses. Menyimpan permission yang diberikan kepada setiap pengguna. Superadmin dapat mengatur hak akses untuk Admin SKPD, dan Admin SKPD dapat mengatur hak akses untuk Penulis yang dibuatnya.

#### 5.19 Supabase Storage Buckets
- `berita`: Untuk thumbnail berita
- `artikel`: Untuk thumbnail artikel
- `layanan`: Untuk icon/gambar layanan
- `wisata`: Untuk gambar wisata
- `perangkat_daerah`: Untuk foto perangkat daerah
- `transparansi`: Untuk file Excel dan PDF anggaran
- `video`: Untuk file video (jika tidak menggunakan URL eksternal)
- `pengumuman`: Untuk file lampiran pengumuman
- `assets`: Untuk assets umum

### 6. Features

#### 6.1 Public Website

##### 6.1.1 Homepage (/)
- Hero section
- Daftar berita terbaru (maks 6)
- Daftar artikel terbaru (maks 6)
- Agenda kota mendatang (maks 5)
- Daftar layanan terbaru (maks 6)
- Footer dengan kontak dan sosial media

##### 6.1.2 Halaman Berita (/berita)
- Daftar berita dengan pagination
- Search functionality
- Grid layout dengan cards

##### 6.1.3 Detail Berita (/berita/:slug)
- Judul berita
- Konten lengkap
- Tanggal publikasi
- Berita terkait (maks 4)
- Meta tags untuk SEO

##### 6.1.4 Halaman Artikel (/artikel)
- Daftar artikel dengan pagination
- Search functionality
- Grid layout dengan cards

##### 6.1.5 Detail Artikel (/artikel/:slug)
- Judul artikel
- Konten lengkap
- Tanggal publikasi
- Artikel terkait (maks 4)
- Meta tags untuk SEO

##### 6.1.6 Halaman Layanan (/layanan)
- List layanan publik
- Grid layout dengan cards

##### 6.1.7 Detail Layanan (/layanan/:slug)
- Judul layanan
- Konten lengkap
- Icon atau gambar
- Meta tags untuk SEO

##### 6.1.8 Halaman Agenda Kota (/agenda)
- List agenda kota dengan filter tanggal
- Status: Mendatang, Berlangsung, Selesai, Dibatalkan
- Calendar view (optional)

##### 6.1.9 Halaman Perangkat Daerah (/perangkat-daerah)
- List perangkat daerah aktif
- Detail perangkat dengan foto, kontak, alamat
- Grid atau list layout

##### 6.1.10 Halaman Transparansi Anggaran (/transparansi-anggaran)
- List anggaran per tahun (2021-2026)
- Download file Excel dan PDF
- Filter by tahun

##### 6.1.11 Halaman Wisata (/wisata)
- List destinasi wisata
- Map view dengan koordinat (optional)
- Grid layout dengan cards

##### 6.1.12 Detail Wisata (/wisata/:slug)
- Nama destinasi
- Konten lengkap
- Gambar
- Alamat dan koordinat
- Map integration (optional)
- Meta tags untuk SEO

##### 6.1.13 Halaman Video (/video)
- List video informasi publik
- Grid layout dengan video player
- Filter by status

##### 6.1.14 Halaman Pengumuman (/pengumuman)
- List pengumuman resmi
- Filter by status dan tanggal berlaku
- Download file lampiran (jika ada)

##### 6.1.16 Halaman Tentang (/tentang)
- Mengambil data dari tabel halaman (slug: 'tentang')

##### 6.1.17 Halaman Kontak (/kontak)
- Mengambil data dari tabel halaman (slug: 'kontak')
- Informasi kontak dari pengaturan_situs

#### 6.2 Admin Panel (CMS)

##### 6.2.1 Authentication
- Login dengan email & password (Supabase Auth)
- Session management
- Protected routes
- Logout functionality

##### 6.2.2 Dashboard (/admin)
- Statistik ringkas:
  - Jumlah berita (total, published, draft)
  - Jumlah artikel (total, published, draft)
  - Jumlah layanan (total, published, draft)
  - Jumlah agenda kota
  - Jumlah wisata
  - Jumlah video
  - Jumlah pengumuman
  - Jumlah halaman statis
  - Jumlah admin pengguna
- Quick actions
- Recent activities
- Chart/grafik untuk analitik (optional)

##### 6.2.3 Manajemen Berita (/admin/berita)
- **List Berita**:
  - Data table dengan pagination
  - Search by judul
  - Filter by status
  - Actions: Edit, Delete, Toggle Publish
  - Status badge (draft/published/archived)
- **Tambah Berita**:
  - Form dengan validasi
  - Rich text editor untuk konten
  - Upload thumbnail ke Supabase Storage
  - Status selection (draft/published/archived)
  - Meta description dan keywords
  - Auto-generate slug dari judul
- **Edit Berita**:
  - Similar to Tambah Berita
  - Pre-fill form dengan data existing
  - Update thumbnail option

##### 6.2.4 Manajemen Artikel (/admin/artikel)
- **List Artikel**:
  - Data table dengan pagination
  - Search by judul
  - Filter by status
  - Actions: Edit, Delete, Toggle Publish
  - Status badge (draft/published/archived)
- **Tambah Artikel**:
  - Form dengan validasi
  - Rich text editor untuk konten
  - Upload thumbnail ke Supabase Storage
  - Status selection (draft/published/archived)
  - Meta description dan keywords
  - Auto-generate slug dari judul
- **Edit Artikel**:
  - Similar to Tambah Artikel
  - Pre-fill form dengan data existing
  - Update thumbnail option

##### 6.2.6 Manajemen Layanan (/admin/layanan)
- **List Layanan**:
  - Data table dengan pagination
  - Search functionality
  - Filter by status
  - Actions: Edit, Delete, Toggle Publish
  - Status badge (draft/published/archived)
- **Tambah Layanan**:
  - Form dengan validasi
  - Rich text editor untuk konten
  - Upload icon/gambar ke Supabase Storage
  - Status selection (draft/published/archived)
  - Meta description
  - Auto-generate slug dari judul
- **Edit Layanan**:
  - Similar to Tambah Layanan
  - Pre-fill form dengan data existing
  - Update icon option

##### 6.2.7 Manajemen Agenda Kota (/admin/agenda)
- **List Agenda**:
  - Data table dengan pagination
  - Search functionality
  - Filter by status & tanggal
  - Calendar view (optional)
  - Actions: Edit, Delete, Toggle Status
  - Status badge (draft/published/selesai/dibatalkan)
- **Tambah Agenda**:
  - Form dengan validasi
  - Judul dan deskripsi
  - Tanggal mulai (wajib)
  - Tanggal selesai (opsional)
  - Lokasi
  - Status selection
- **Edit Agenda**:
  - Similar to Tambah Agenda
  - Pre-fill form dengan data existing
  - Update status (selesai/dibatalkan)

##### 6.2.8 Manajemen Perangkat Daerah (/admin/perangkat-daerah)
- **List Perangkat**:
  - Data table dengan pagination
  - Search functionality
  - Filter by aktif/nonaktif
  - Sort by urutan
  - Actions: Edit, Delete, Toggle Aktif
- **Tambah Perangkat**:
  - Form dengan validasi
  - Nama perangkat
  - Jabatan dan nama kepala
  - Upload foto (opsional)
  - Kontak dan alamat
  - Deskripsi
  - Urutan
  - Status aktif
  - Auto-generate slug
- **Edit Perangkat**:
  - Similar to Tambah Perangkat
  - Pre-fill form dengan data existing

##### 6.2.9 Manajemen Transparansi Anggaran (/admin/transparansi-anggaran)
- **List Anggaran**:
  - Data table per tahun (2021-2026)
  - Display: Tahun, File Excel, File PDF, Status
  - Actions: Edit, Delete, Toggle Publish
- **Tambah/Edit Anggaran**:
  - Form dengan validasi
  - Pilih tahun (2021-2026, unique)
  - Upload file Excel (wajib)
  - Upload file PDF (opsional)
  - Deskripsi
  - Status selection

##### 6.2.10 Manajemen Wisata (/admin/wisata)
- **List Wisata**:
  - Data table dengan pagination
  - Search functionality
  - Filter by status
  - Actions: Edit, Delete, Toggle Publish
  - Status badge (draft/published/archived)
- **Tambah Wisata**:
  - Form dengan validasi
  - Nama destinasi
  - Deskripsi dan konten lengkap (rich text editor)
  - Upload gambar ke Supabase Storage
  - Alamat
  - Koordinat (lat, lng) untuk peta
  - Status selection
  - Meta description
  - Auto-generate slug
- **Edit Wisata**:
  - Similar to Tambah Wisata
  - Pre-fill form dengan data existing
  - Map picker untuk koordinat (optional)

##### 6.2.12 Manajemen Video (/admin/video)
- **List Video**:
  - Data table dengan pagination
  - Search functionality
  - Filter by status
  - Actions: Edit, Delete, Toggle Publish
  - Status badge (draft/published/archived)
- **Tambah Video**:
  - Form dengan validasi
  - Judul dan deskripsi
  - URL video (YouTube, Vimeo, atau file)
  - Upload thumbnail (opsional)
  - Durasi (detik)
  - Status selection
  - Auto-generate slug
- **Edit Video**:
  - Similar to Tambah Video
  - Pre-fill form dengan data existing

##### 6.2.13 Manajemen Pengumuman (/admin/pengumuman)
- **List Pengumuman**:
  - Data table dengan pagination
  - Search functionality
  - Filter by status & tanggal berlaku
  - Actions: Edit, Delete, Toggle Publish
  - Status badge (draft/published/archived)
- **Tambah Pengumuman**:
  - Form dengan validasi
  - Judul dan konten (rich text editor)
  - Upload file lampiran (opsional)
  - Tanggal berlaku mulai (opsional)
  - Tanggal berlaku selesai (opsional)
  - Status selection
  - Auto-generate slug
- **Edit Pengumuman**:
  - Similar to Tambah Pengumuman
  - Pre-fill form dengan data existing

##### 6.2.15 Manajemen Halaman Statis (/admin/halaman)
- **List Halaman**:
  - Data table
  - Halaman: Tentang, Kontak, Visi Misi, Struktur Organisasi, Informasi Kota
- **Edit Halaman**:
  - Rich text editor untuk konten
  - Update judul dan konten
  - Meta description dan keywords
  - Auto-save timestamp

##### 6.2.16 Manajemen Sosial Media (/admin/sosial-media)
- **List Sosial Media**:
  - Data table
  - Platform: Instagram, Facebook, Twitter, YouTube, TikTok
  - Display: Platform, URL, Status Aktif
  - Actions: Edit, Toggle Aktif
- **Edit Sosial Media**:
  - Update URL
  - Upload ikon custom (opsional)
  - Toggle aktif/nonaktif
  - Update urutan

##### 6.2.17 Manajemen Pengaturan Situs (/admin/pengaturan)
- **List Pengaturan**:
  - Data table dengan grup (kontak, umum)
  - Display: Kunci, Nilai, Tipe, Grup
  - Actions: Edit
- **Edit Pengaturan**:
  - Update nilai sesuai tipe (text, url, email, phone, number, boolean)
  - Validasi sesuai tipe

##### 6.2.18 Manajemen Pengguna Admin (/admin/pengguna)
- **List Admin**:
  - Data table
  - Display: Email, Nama Lengkap, Peran, Status Aktif, Tanggal Dibuat
  - Filter by peran & status aktif
  - Actions: Edit, Delete, Toggle Aktif
  - **Catatan**: Hanya superadmin yang dapat mengelola semua pengguna. Admin SKPD hanya dapat mengelola penulis yang dibuatnya.
- **Tambah Admin**:
  - Form dengan validasi
  - Email input
  - Password input
  - Nama lengkap
  - Pilih peran (superadmin/admin_skpd/penulis)
  - Status aktif (default: true)
  - Create user via Supabase Auth
  - **Catatan**: Admin SKPD hanya dapat membuat penulis. Superadmin dapat membuat semua jenis peran.
- **Edit Admin**:
  - Update nama lengkap
  - Update password (optional)
  - Update peran (optional, hanya superadmin)
  - Toggle status aktif
  - **Catatan**: Admin SKPD hanya dapat mengedit penulis yang dibuatnya. Superadmin dapat mengedit semua pengguna.

### 7. User Stories

#### 7.1 Public User Stories
- Sebagai warga, saya ingin melihat berita terbaru di homepage
- Sebagai warga, saya ingin melihat artikel terbaru di homepage
- Sebagai warga, saya ingin melihat agenda kota mendatang di homepage
- Sebagai warga, saya ingin mencari berita berdasarkan kata kunci
- Sebagai warga, saya ingin membaca detail berita lengkap
- Sebagai warga, saya ingin membaca artikel untuk edukasi dan informasi mendalam
- Sebagai warga, saya ingin melihat daftar layanan publik
- Sebagai warga, saya ingin melihat detail layanan
- Sebagai warga, saya ingin melihat agenda kegiatan kota
- Sebagai warga, saya ingin melihat informasi perangkat daerah
- Sebagai warga, saya ingin download file anggaran untuk transparansi
- Sebagai warga, saya ingin melihat destinasi wisata di kota
- Sebagai warga, saya ingin melihat video informasi publik
- Sebagai warga, saya ingin melihat pengumuman resmi pemerintah
- Sebagai warga, saya ingin melihat informasi tentang pemerintah kota
- Sebagai warga, saya ingin melihat kontak pemerintah kota
- Sebagai warga, saya ingin mengakses sosial media pemerintah kota

#### 7.2 Admin User Stories
- Sebagai admin, saya ingin login ke CMS panel
- Sebagai admin, saya ingin melihat dashboard dengan statistik lengkap
- Sebagai admin, saya ingin menambah berita baru
- Sebagai admin, saya ingin mengedit berita yang sudah ada
- Sebagai admin, saya ingin menghapus berita
- Sebagai admin, saya ingin mengubah status berita (draft/published/archived)
- Sebagai admin, saya ingin menambah artikel baru
- Sebagai admin, saya ingin mengelola artikel
- Sebagai admin, saya ingin mengelola layanan publik
- Sebagai admin, saya ingin membuat agenda kegiatan kota
- Sebagai admin, saya ingin mengupdate status agenda (selesai/dibatalkan)
- Sebagai admin, saya ingin mengelola data perangkat daerah
- Sebagai admin, saya ingin upload file anggaran (Excel/PDF) per tahun
- Sebagai admin, saya ingin mengelola destinasi wisata dengan koordinat peta
- Sebagai admin, saya ingin mengelola video informasi publik
- Sebagai admin, saya ingin membuat pengumuman resmi dengan file lampiran
- Sebagai admin, saya ingin mengedit halaman statis
- Sebagai admin, saya ingin mengelola sosial media links
- Sebagai admin, saya ingin mengelola pengaturan situs (kontak, umum)
- Sebagai admin, saya ingin mengelola pengguna admin dengan status aktif/nonaktif
- Sebagai admin, saya ingin upload gambar untuk berbagai jenis konten

### 8. UI/UX Requirements

#### 8.1 Public Website
- Clean, minimalis, modern
- Gaya website pemerintahan (formal, profesional)
- Responsive design (mobile, tablet, desktop)
- Loading states untuk semua async operations
- Error handling dengan user-friendly messages

#### 8.2 Admin Panel
- Shadcn UI components
- Clean, modern, profesional
- Dark mode support (optional)
- Responsive design
- Toast notifications untuk feedback
- Form validation dengan pesan error Bahasa Indonesia
- Confirmation modals untuk delete actions

### 9. Security Requirements

- Row Level Security (RLS) policies di Supabase untuk semua tabel
- **Role-based Permission System**:
  - Helper functions: `is_superadmin()`, `is_admin_skpd()`, `get_user_role()`, `get_user_permissions()`, `can_access_page()`
  - Hierarki peran: superadmin → admin_skpd → penulis
  - Superadmin memiliki akses penuh ke dashboard dan manajemen pengguna
  - Admin SKPD dapat mengelola penulis yang dibuatnya dan mengatur hak akses mereka
  - Penulis hanya dapat mengakses halaman sesuai permission yang diberikan
- Public read access hanya untuk konten dengan `status = 'published'` atau `aktif = true`
- Role-based write access untuk operasi CRUD sesuai peran dan permission
- Validate file uploads (type & size) di application layer
- Sanitize rich text content untuk mencegah XSS
- Secure API endpoints dengan RLS dan permission checks
- Password requirements untuk admin (min 8 karakter, huruf dan angka)
- Session timeout (optional)
- Storage policies untuk bucket Supabase Storage (role-based write, public read)
- RLS policies untuk tabel `hak_akses` (read-only untuk authenticated) dan `pengguna_hak_akses` (berdasarkan hierarki peran)

### 10. Performance Requirements

- Fast page load times (< 3 detik untuk homepage)
- Optimized images (lazy loading, responsive images)
- Server-side pagination untuk semua list data
- Debounced search untuk performance
- Efficient database queries dengan indexes strategis:
  - Single column indexes untuk slug, status, foreign keys
  - Composite indexes untuk query patterns (status + tanggal)
  - GIN indexes untuk full-text search (judul berita, artikel, layanan, wisata)
- Caching untuk data yang jarang berubah (pengaturan, sosial media)
- Optimized storage access dengan CDN

### 11. SEO Requirements

- Meta tags untuk setiap halaman
- Open Graph tags untuk social sharing
- Semantic HTML
- Proper heading hierarchy
- Alt text untuk images
- Sitemap (optional)

### 12. Validation Rules

#### 12.1 Berita
- Judul: Required, min 10 karakter, max 200 karakter
- Slug: Required, unique, auto-generate dari judul
- Konten: Required, min 50 karakter
- Thumbnail: Required, image file (jpg, png, webp), max 2MB
- Status: Required, enum ('draft', 'published', 'archived')
- Meta description: Optional, max 160 karakter
- Meta keywords: Optional, max 255 karakter

#### 12.2 Artikel
- Judul: Required, min 10 karakter, max 200 karakter
- Slug: Required, unique, auto-generate dari judul
- Konten: Required, min 50 karakter
- Thumbnail: Required, image file (jpg, png, webp), max 2MB
- Status: Required, enum ('draft', 'published', 'archived')
- Meta description: Optional, max 160 karakter
- Meta keywords: Optional, max 255 karakter

#### 12.3 Agenda Kota
- Judul: Required, min 10 karakter, max 200 karakter
- Deskripsi: Optional, max 1000 karakter
- Tanggal mulai: Required, timestamp
- Tanggal selesai: Optional, timestamp, harus >= tanggal_mulai
- Lokasi: Optional, max 200 karakter
- Status: Required, enum ('draft', 'published', 'selesai', 'dibatalkan')

#### 12.5 Layanan
- Judul: Required, min 10 karakter, max 200 karakter
- Slug: Required, unique, auto-generate dari judul
- Konten: Required, min 50 karakter
- Icon: Required, image file (jpg, png, webp), max 2MB
- Status: Required, enum ('draft', 'published', 'archived')
- Meta description: Optional, max 160 karakter

#### 12.6 Perangkat Daerah
- Nama perangkat: Required, min 5 karakter, max 100 karakter
- Slug: Required, unique, auto-generate dari nama
- Jabatan kepala: Optional, max 100 karakter
- Nama kepala: Optional, max 100 karakter
- Foto: Optional, image file (jpg, png, webp), max 2MB
- Kontak: Optional, max 200 karakter
- Alamat: Optional, max 500 karakter
- Deskripsi: Optional, max 1000 karakter
- Urutan: Optional, integer
- Aktif: Required, boolean

#### 12.7 Transparansi Anggaran
- Tahun: Required, integer, range 2021-2026, unique
- File Excel: Required, file (xlsx, xls), max 10MB
- File PDF: Optional, file (pdf), max 10MB
- Deskripsi: Optional, max 500 karakter
- Status: Required, enum ('draft', 'published')

#### 12.8 Wisata
- Nama: Required, min 5 karakter, max 100 karakter
- Slug: Required, unique, auto-generate dari nama
- Deskripsi: Optional, max 500 karakter
- Konten: Required, min 50 karakter
- Gambar: Required, image file (jpg, png, webp), max 5MB
- Alamat: Optional, max 500 karakter
- Koordinat lat: Optional, decimal (-90 to 90)
- Koordinat lng: Optional, decimal (-180 to 180)
- Status: Required, enum ('draft', 'published', 'archived')
- Meta description: Optional, max 160 karakter

#### 12.9 Video
- Judul: Required, min 10 karakter, max 200 karakter
- Slug: Required, unique, auto-generate dari judul
- Deskripsi: Optional, max 500 karakter
- URL video: Required, valid URL (YouTube, Vimeo, atau file)
- Thumbnail: Optional, image file (jpg, png, webp), max 2MB
- Durasi: Optional, integer (detik), min 0
- Status: Required, enum ('draft', 'published', 'archived')

#### 12.10 Pengumuman
- Judul: Required, min 10 karakter, max 200 karakter
- Slug: Required, unique, auto-generate dari judul
- Konten: Required, min 50 karakter
- File lampiran: Optional, file (pdf, doc, docx), max 10MB
- Tanggal berlaku mulai: Optional, date
- Tanggal berlaku selesai: Optional, date, harus >= tanggal_mulai
- Status: Required, enum ('draft', 'published', 'archived')

#### 12.12 Halaman
- Judul: Required, min 10 karakter, max 200 karakter
- Konten: Required, min 50 karakter
- Meta description: Optional, max 160 karakter
- Meta keywords: Optional, max 255 karakter

#### 12.13 Sosial Media
- Platform: Required, enum ('instagram', 'facebook', 'twitter', 'youtube', 'tiktok'), unique
- URL: Required, valid URL
- Ikon: Optional, image file (jpg, png, webp, svg), max 1MB
- Aktif: Required, boolean
- Urutan: Optional, integer

#### 12.14 Pengaturan Situs
- Kunci: Required, unique, max 100 karakter
- Nilai: Required, max 1000 karakter
- Tipe: Required, enum ('text', 'url', 'email', 'phone', 'number', 'boolean')
- Grup: Optional, max 50 karakter
- Urutan: Optional, integer

#### 12.15 Pengguna
- Email: Required, valid email format, unique
- Password: Required, min 8 karakter, harus ada huruf dan angka
- Nama lengkap: Optional, max 100 karakter
- Peran: Required, enum ('superadmin', 'admin_skpd', 'penulis')
- Aktif: Required, boolean
- Dibuat oleh: Optional, uuid (untuk tracking admin yang membuat penulis)

### 13. Error Handling

- User-friendly error messages dalam Bahasa Indonesia
- Error boundaries untuk React components
- Toast notifications untuk success/error actions
- Loading states untuk semua async operations
- 404 page untuk routes yang tidak ditemukan

### 14. Testing Requirements

- Manual testing untuk semua features
- Test login/logout flow
- Test CRUD operations untuk semua entities
- Test image upload functionality
- Test search & filter functionality
- Test pagination
- Test form validation
- Test protected routes
- Test responsive design

### 15. Deployment

- Environment variables untuk Supabase credentials
- Build untuk production
- Deploy ke hosting platform (Vercel, Netlify, atau server)

### 16. Database Features & Triggers

#### 16.1 Auto-update Timestamps
- Trigger `update_updated_at_column()` untuk auto-update `diperbarui_pada` pada semua tabel
- Applied to: berita, artikel, layanan, halaman, agenda_kota, perangkat_daerah, transparansi_anggaran, wisata, video, pengumuman, pengguna, sosial_media, pengaturan_situs, hak_akses

#### 16.2 Auto-set Published Date
- Trigger `set_published_at()` untuk auto-set `dipublikasikan_pada` saat status berubah ke 'published'
- Applied to: berita, artikel, pengumuman

#### 16.3 Indexes Strategy
- **Single Column**: slug (unique), status, dibuat_pada, foreign keys
- **Composite**: (status, dibuat_pada DESC) untuk latest published content
- **Full-text Search**: GIN indexes dengan pg_trgm extension untuk judul
- **Geospatial**: Indexes untuk koordinat wisata (jika menggunakan PostGIS)
- **Role & Permission**: Indexes pada `hak_akses.kategori`, `pengguna_hak_akses.pengguna_id`, `pengguna_hak_akses.hak_akses_id`

#### 16.4 Helper Functions untuk Role & Permission System
- **`get_user_role()`**: Mengembalikan peran user yang sedang login (superadmin, admin_skpd, atau penulis)
- **`get_user_permissions()`**: Mengembalikan array kode_halaman yang boleh diakses user
- **`can_access_page(page_code TEXT)`**: Mengecek apakah user bisa akses halaman tertentu (return boolean)
- **`is_superadmin()`**: Mengecek apakah user adalah superadmin (return boolean)
- **`is_admin_skpd()`**: Mengecek apakah user adalah admin_skpd (return boolean)

**Catatan**: Semua helper functions menggunakan `SECURITY DEFINER` untuk akses ke data pengguna melalui RLS policies.

### 17. Future Enhancements (Optional)

- Email notifications untuk admin
- Activity logs/audit trail yang lebih detail
- Export data (CSV, PDF) untuk semua entitas
- Advanced analytics dan reporting
- Multi-language support
- Comment system untuk berita dan artikel
- Newsletter subscription
- Push notifications untuk pengumuman penting
- Integration dengan Google Maps untuk wisata
- Advanced search dengan filters multiple
- Bulk operations untuk admin
- Version control untuk konten (draft history)
- Scheduled publishing untuk berita dan artikel

