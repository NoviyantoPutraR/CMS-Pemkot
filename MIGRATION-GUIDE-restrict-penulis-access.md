# Panduan Implementasi: Restriksi Hak Akses Penulis

## Ringkasan

Migration ini membatasi hak akses penulis agar hanya dapat mengakses halaman **berita** dan **artikel**. Semua halaman lain (agenda_kota, wisata, video, pengumuman, sosial_media) dipindahkan ke kategori `admin_skpd_options`.

## File Migration

- **migration-restrict-penulis-access.sql** - Migration untuk database yang sudah berjalan

## Perubahan yang Dilakukan

### 1. Update Kategori Hak Akses
Mengubah kategori dari `penulis_options` ke `admin_skpd_options` untuk:
- `agenda_kota`
- `wisata`
- `video`
- `pengumuman`
- `sosial_media`

### 2. Hapus Relasi Penulis
Menghapus semua permission yang sudah diberikan ke penulis untuk 5 halaman di atas.

## Langkah Implementasi

### ⚠️ PENTING: Backup Database Terlebih Dahulu

Sebelum menjalankan migration, pastikan untuk:
1. Backup database Supabase
2. Catat jumlah penulis yang ada
3. Catat permission yang dimiliki setiap penulis (opsional, untuk referensi)

### Langkah 1: Jalankan Migration

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Copy seluruh isi file `migration-restrict-penulis-access.sql`
3. Paste ke SQL Editor
4. Klik **Run** untuk menjalankan migration
5. Pastikan tidak ada error

### Langkah 2: Verifikasi Migration

Jalankan query berikut untuk memverifikasi:

```sql
-- 1. Cek kategori hak_akses setelah update
SELECT kode_halaman, nama_halaman, kategori 
FROM hak_akses 
ORDER BY kategori, kode_halaman;
```

**Hasil yang diharapkan:**
- `penulis_options`: hanya `berita` dan `artikel`
- `admin_skpd_options`: `layanan`, `perangkat_daerah`, `transparansi`, `halaman`, `pengaturan`, `agenda_kota`, `wisata`, `video`, `pengumuman`, `sosial_media`

```sql
-- 2. Cek penulis yang masih punya akses ke 5 halaman tersebut (harus 0 rows)
SELECT p.email, p.peran, ha.kode_halaman, ha.nama_halaman
FROM pengguna_hak_akses pha
JOIN pengguna p ON pha.pengguna_id = p.id
JOIN hak_akses ha ON pha.hak_akses_id = ha.id
WHERE p.peran = 'penulis'
  AND ha.kode_halaman IN ('agenda_kota', 'wisata', 'video', 'pengumuman', 'sosial_media');
```

**Hasil yang diharapkan:** 0 rows (tidak ada penulis yang masih punya akses)

```sql
-- 3. Cek semua permission yang dimiliki penulis (harusnya hanya berita dan artikel)
SELECT p.email, p.peran, ha.kode_halaman, ha.nama_halaman, ha.kategori
FROM pengguna_hak_akses pha
JOIN pengguna p ON pha.pengguna_id = p.id
JOIN hak_akses ha ON pha.hak_akses_id = ha.id
WHERE p.peran = 'penulis'
ORDER BY p.email, ha.kode_halaman;
```

**Hasil yang diharapkan:** Hanya menampilkan `berita` dan `artikel` untuk setiap penulis

### Langkah 3: Testing Aplikasi

#### Test sebagai Penulis:
1. Login sebagai user dengan role `penulis`
2. **Verifikasi Sidebar:**
   - ✅ Harus menampilkan: Dashboard, Berita, Artikel, Profil Saya
   - ❌ Tidak boleh menampilkan: Agenda Kota, Wisata, Video, Pengumuman, Sosial Media
3. **Verifikasi Route Protection:**
   - Coba akses langsung ke URL:
     - `/admin/agenda` → Harus redirect ke `/admin`
     - `/admin/wisata` → Harus redirect ke `/admin`
     - `/admin/video` → Harus redirect ke `/admin`
     - `/admin/pengumuman` → Harus redirect ke `/admin`
     - `/admin/sosial-media` → Harus redirect ke `/admin`
   - `/admin/berita` → Harus bisa diakses
   - `/admin/artikel` → Harus bisa diakses

#### Test sebagai Admin SKPD:
1. Login sebagai user dengan role `admin_skpd`
2. **Verifikasi Sidebar:**
   - Harus menampilkan semua menu termasuk: Agenda Kota, Wisata, Video, Pengumuman, Sosial Media
3. **Verifikasi Akses:**
   - Semua halaman harus bisa diakses
4. **Test Assign Permission:**
   - Buka halaman Manajemen Pengguna
   - Edit penulis yang ada
   - Cek daftar permission yang bisa di-assign
   - Harusnya hanya menampilkan: **Berita** dan **Artikel**
   - Tidak boleh menampilkan: Agenda Kota, Wisata, Video, Pengumuman, Sosial Media

#### Test sebagai Superadmin:
1. Login sebagai user dengan role `superadmin`
2. Verifikasi tidak ada perubahan (tetap hanya Dashboard dan Pengguna)

## Dampak Perubahan

### Untuk Penulis yang Sudah Ada:
- ❌ **Kehilangan akses ke:**
  - Agenda Kota
  - Wisata
  - Video
  - Pengumuman
  - Sosial Media
- ✅ **Tetap punya akses ke:**
  - Berita (jika sudah diberikan sebelumnya)
  - Artikel (jika sudah diberikan sebelumnya)

### Untuk Admin SKPD:
- ✅ **Bisa mengakses:**
  - Layanan
  - Perangkat Daerah
  - Transparansi
  - Halaman
  - Pengaturan
  - **Agenda Kota** (baru)
  - **Wisata** (baru)
  - **Video** (baru)
  - **Pengumuman** (baru)
  - **Sosial Media** (baru)
- ✅ **Bisa assign permission ke penulis hanya untuk:**
  - Berita
  - Artikel

### Untuk Superadmin:
- ✅ Tidak ada perubahan
- Tetap hanya akses: Dashboard dan Manajemen Pengguna

## Rollback (Jika Diperlukan)

Jika perlu rollback, jalankan query berikut:

```sql
-- 1. Kembalikan kategori ke penulis_options
UPDATE hak_akses 
SET 
  kategori = 'penulis_options',
  diperbarui_pada = NOW()
WHERE kode_halaman IN ('agenda_kota', 'wisata', 'video', 'pengumuman', 'sosial_media')
  AND kategori = 'admin_skpd_options';

-- 2. Catatan: Relasi pengguna_hak_akses yang sudah dihapus tidak bisa dikembalikan otomatis
--    Perlu assign ulang secara manual jika diperlukan
```

## Troubleshooting

### Issue: Penulis masih bisa akses halaman yang seharusnya tidak bisa
**Solusi:**
1. Pastikan migration sudah berjalan dengan sukses
2. Cek apakah user sudah logout dan login ulang (permission di-cache di frontend)
3. Verifikasi dengan query di Langkah 2

### Issue: Admin SKPD tidak bisa assign permission ke penulis
**Solusi:**
1. Pastikan kategori hak_akses sudah benar (admin_skpd_options)
2. Cek apakah admin_skpd sudah punya permission untuk halaman tersebut
3. Verifikasi dengan query di Langkah 2

### Issue: Sidebar masih menampilkan menu yang seharusnya tidak ada
**Solusi:**
1. Hard refresh browser (Ctrl+Shift+R atau Cmd+Shift+R)
2. Clear browser cache
3. Logout dan login ulang
4. Cek apakah permission sudah ter-refresh di `useAuthStore`

## Catatan Penting

1. **Tidak perlu mengubah kode aplikasi** - PermissionGuard, Sidebar, dan AdminRoutes sudah dinamis berdasarkan permission dari database
2. **Perubahan hanya di level database** - Kategori `hak_akses` dan relasi `pengguna_hak_akses`
3. **Data yang sudah dihapus tidak bisa dikembalikan otomatis** - Jika perlu rollback, assign ulang permission secara manual
4. **Cache permission** - User perlu logout dan login ulang untuk refresh permission di frontend

## Support

Jika ada masalah atau pertanyaan, silakan hubungi tim development.

