# CMS Website Pemerintah Kota

Website CMS untuk Pemerintah Kota dengan dua bagian utama: **Public Website** (tampilan publik) dan **Admin CMS Panel** untuk manajemen konten.

## Tech Stack

- **Frontend**: ReactJS + Vite + TailwindCSS
- **Backend**: Supabase (Database, Auth, Storage)
- **State Management**: Zustand
- **Routing**: React Router v6
- **UI Components**: Shadcn UI (untuk Admin Panel)
- **Rich Text Editor**: React Quill
- **Form Validation**: React Hook Form + Zod

## Fitur

### Public Website
- Homepage dengan berita dan layanan terbaru
- Halaman Berita dengan search dan filter
- Detail Berita dengan berita terkait
- Halaman Layanan
- Halaman Tentang dan Kontak

### Admin Panel
- Dashboard dengan statistik
- Manajemen Berita (CRUD dengan rich text editor)
- Manajemen Kategori Berita
- Manajemen Layanan Publik
- Manajemen Halaman Statis
- Manajemen Pengguna Admin

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat project di [Supabase](https://supabase.com)
2. Jalankan SQL script di `supabase-schema.sql` untuk membuat tabel
3. Jalankan SQL script di `supabase-storage-policies.sql` untuk setup storage
4. Buat storage buckets: `berita`, `layanan`, `assets`

### 3. Environment Variables

Buat file `.env` di root project:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## Struktur Project

```
src/
  components/       # Komponen reusable
  pages/           # Halaman aplikasi
  layouts/         # Layout components
  router/          # Routing configuration
  store/           # Zustand stores
  services/        # API services
  utils/           # Utility functions
  hooks/           # Custom hooks
```

## Dokumentasi

Lihat `PRD.md` untuk dokumentasi lengkap tentang spesifikasi dan requirements.

## License

MIT

