# Role & Permission Management System

## Overview

Sistem Role & Permission Management bertingkat yang aman dan scalable untuk CMS Pemerintah Kota. Sistem ini mendukung 3 level peran dengan hak akses dinamis berbasis database.

## Peran & Hierarki

```
Superadmin
    └── Admin SKPD
            └── Penulis
```

### 1. Superadmin
- **Akses Penuh**: Dashboard dan Manajemen Pengguna
- **Akses Read-Only**: Semua halaman konten (Berita, Artikel, dll)
- **Hak Istimewa**:
  - Membuat akun Admin SKPD
  - Mengatur hak akses untuk Admin SKPD
  - Mengelola semua pengguna
  - Edit semua field profile user

### 2. Admin SKPD
- **Dapat Diakses**:
  - Layanan
  - Perangkat Daerah
  - Transparansi Anggaran
  - Halaman Statis
  - Pengaturan Situs
- **Hak Istimewa**:
  - Membuat akun Penulis
  - Mengatur hak akses untuk Penulis
  - Edit profil sendiri (hanya `nama_lengkap`)
- **Memiliki**: Nama SKPD (organisasi)

### 3. Penulis
- **Dapat Diakses**:
  - Berita
  - Artikel
  - Agenda Kota
  - Wisata
  - Video
  - Pengumuman
  - Sosial Media
- **Hak Istimewa**:
  - Edit profil sendiri (hanya `nama_lengkap`)
  - Akses sesuai permission yang diberikan Admin SKPD

## Database Schema

### Tabel: `pengguna`

**Kolom Baru:**
- `nama_skpd` (TEXT) - Nama SKPD untuk Admin SKPD
- `dibuat_oleh` (UUID) - Foreign key ke `pengguna.id` untuk tracking hierarki

**Perubahan:**
- `peran` constraint diubah dari `('admin', 'super_admin')` menjadi `('superadmin', 'admin_skpd', 'penulis')`

### Tabel: `hak_akses`

Master table untuk hak akses halaman.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary key |
| kode_halaman | TEXT | Kode unik halaman (berita, artikel, dll) |
| nama_halaman | TEXT | Nama tampilan halaman |
| deskripsi | TEXT | Deskripsi halaman |
| kategori | TEXT | 'superadmin_only', 'admin_skpd_options', 'penulis_options' |
| dibuat_pada | TIMESTAMP | Waktu dibuat |
| diperbarui_pada | TIMESTAMP | Waktu diperbarui |

**Data Seed:**

**Kategori: superadmin_only**
- dashboard
- manajemen_pengguna

**Kategori: admin_skpd_options**
- layanan
- perangkat_daerah
- transparansi
- halaman
- pengaturan

**Kategori: penulis_options**
- berita
- artikel
- agenda_kota
- wisata
- video
- pengumuman
- sosial_media

### Tabel: `pengguna_hak_akses`

Junction table untuk relasi many-to-many antara pengguna dan hak akses.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary key |
| pengguna_id | UUID | Foreign key ke pengguna(id) |
| hak_akses_id | UUID | Foreign key ke hak_akses(id) |
| dibuat_pada | TIMESTAMP | Waktu dibuat |

**Constraint:**
- UNIQUE(pengguna_id, hak_akses_id)
- ON DELETE CASCADE untuk kedua foreign key

## Row Level Security (RLS) Policies

### Tabel: `pengguna`

**SELECT:** Semua authenticated user bisa melihat daftar pengguna

**INSERT:**
- Superadmin bisa create admin_skpd
- Admin SKPD bisa create penulis (dengan `dibuat_oleh = auth.uid()`)

**UPDATE:**
- Superadmin bisa update semua kolom semua user
- Admin SKPD & Penulis hanya bisa update `nama_lengkap` milik sendiri

**DELETE:**
- Hanya superadmin yang bisa delete user lain
- Tidak bisa delete diri sendiri

### Tabel: `hak_akses`

**SELECT:** Semua authenticated user bisa lihat

**INSERT/UPDATE/DELETE:** Disabled (data seed only)

### Tabel: `pengguna_hak_akses`

**SELECT:**
- User bisa lihat hak akses sendiri
- User bisa lihat hak akses user yang dibuatnya
- Superadmin bisa lihat semua

**INSERT/DELETE:**
- Superadmin bisa mengelola hak akses admin_skpd
- Admin SKPD bisa mengelola hak akses penulis yang dibuatnya

## Helper Functions

### `get_user_role()`
Return peran user yang sedang login.

```sql
SELECT get_user_role();
```

### `get_user_permissions()`
Return array kode_halaman yang boleh diakses user.

```sql
SELECT get_user_permissions();
```

### `can_access_page(page_code TEXT)`
Check apakah user bisa akses halaman tertentu.

```sql
SELECT can_access_page('berita');
```

### `is_superadmin()`
Check apakah user adalah superadmin.

```sql
SELECT is_superadmin();
```

### `is_admin_skpd()`
Check apakah user adalah admin_skpd.

```sql
SELECT is_admin_skpd();
```

## Implementasi Frontend

### Services

#### `hakAksesService.js`
- `getAll()` - Get semua hak akses
- `getByCategory(category)` - Get hak akses berdasarkan kategori
- `getAvailableForRole(role)` - Get hak akses yang available untuk role

#### `penggunaService.js` (Updated)
- `getPermissions(userId)` - Get list hak akses user
- `getPermissionCodes(userId)` - Get array of permission codes
- `assignPermissions(userId, permissionIds)` - Assign hak akses ke user
- `removePermissions(userId, permissionIds)` - Hapus hak akses user
- `getCreatedUsers(creatorId)` - Get list user yang dibuat oleh creator

### State Management

#### `useAuthStore.js` (Updated)
**New State:**
- `permissions: []` - Array of permission codes

**New Methods:**
- `hasPermission(pageCode)` - Check akses ke halaman
- `canCreateRole(targetRole)` - Check bisa create role tertentu
- `refreshPermissions()` - Refresh permissions

### Components

#### `PermissionGuard.jsx`
Component untuk guard permission. Redirect atau show fallback jika tidak punya akses.

```jsx
<PermissionGuard permission={PAGE_CODES.BERITA}>
  <BeritaList />
</PermissionGuard>
```

#### `AdminRoutes.jsx` (Updated)
Semua routes dibungkus dengan `PermissionRoute` untuk protection.

#### `Sidebar.jsx` (Updated)
Menu dinamis berdasarkan permissions. Hanya tampilkan menu yang user punya akses.

#### `Navbar.jsx` (Updated)
Tampilkan badge peran dengan icon dan warna berbeda.

### Pages

#### `CreateUserModal.jsx` (Updated)
- Form pilih peran (sesuai hierarki)
- Input nama_skpd (conditional untuk admin_skpd)
- Multi-select hak akses
- Auto set `dibuat_oleh`

#### `AdminList.jsx` (Updated)
- Tampilkan badge peran baru
- Kolom SKPD
- Info "Dibuat oleh"
- Filter by peran

#### `EditAdmin.jsx` (Updated)
- **Superadmin**: Edit semua field + manage permissions
- **Admin SKPD & Penulis**: Hanya edit `nama_lengkap` sendiri
- Field lain: read-only/disabled

## Constants & Utilities

### `constants.js`

```javascript
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN_SKPD: 'admin_skpd',
  PENULIS: 'penulis',
}

export const PERMISSION_CATEGORIES = {
  SUPERADMIN_ONLY: 'superadmin_only',
  ADMIN_SKPD_OPTIONS: 'admin_skpd_options',
  PENULIS_OPTIONS: 'penulis_options',
}

export const PAGE_CODES = {
  DASHBOARD: 'dashboard',
  MANAJEMEN_PENGGUNA: 'manajemen_pengguna',
  BERITA: 'berita',
  // ... dan seterusnya
}

export const ROLE_LABELS = {
  [ROLES.SUPERADMIN]: 'Superadmin',
  [ROLES.ADMIN_SKPD]: 'Admin SKPD',
  [ROLES.PENULIS]: 'Penulis',
}
```

### `permissionHelper.js`

Helper functions:
- `checkPageAccess()` - Check akses halaman
- `isSuperadmin()` - Check role superadmin
- `isAdminSKPD()` - Check role admin SKPD
- `isPenulis()` - Check role penulis
- `canManageUsers()` - Check bisa manage users
- `canEditOwnProfile()` - Check edit profil sendiri
- `getAvailablePermissionsForRole()` - Get permissions yang bisa di-assign
- `getCreatableRoles()` - Get roles yang bisa dibuat
- `canCreateRole()` - Check bisa create role tertentu
- `getRoleLabel()` - Get label untuk role
- `canEditField()` - Check field bisa diedit
- `getDefaultPermissionsForRole()` - Get default permissions
- `hasSuperadminReadAccess()` - Check superadmin read access

## Migration Steps

### 1. Run Migration SQL

Jalankan file `migration-add-role-permission-system.sql` di Supabase SQL Editor:

```sql
-- File ini akan:
-- 1. Alter table pengguna (tambah kolom, update constraint)
-- 2. Create table hak_akses
-- 3. Create table pengguna_hak_akses
-- 4. Seed data hak_akses
-- 5. Create helper functions
-- 6. Setup RLS policies
```

### 2. Migrate Existing Users

Jika ada user existing yang perlu di-migrate:

```sql
-- Update peran lama ke peran baru
UPDATE pengguna SET peran = 'superadmin' WHERE peran = 'super_admin';
UPDATE pengguna SET peran = 'admin_skpd' WHERE peran = 'admin';

-- Assign default permissions ke existing admin_skpd
-- (sesuaikan dengan kebutuhan)
```

### 3. Create First Superadmin

Jika belum ada superadmin, create manual:

```sql
-- 1. Create user via Supabase Auth Dashboard atau Admin API
-- 2. Insert ke tabel pengguna
INSERT INTO pengguna (id, email, peran, nama_lengkap, aktif)
VALUES (
  'USER_UUID_FROM_AUTH',
  'superadmin@example.com',
  'superadmin',
  'Super Administrator',
  true
);
```

## Testing Scenarios

### 1. Superadmin Login
- ✅ Bisa akses dashboard
- ✅ Bisa akses manajemen pengguna
- ✅ Bisa create admin_skpd
- ✅ Bisa assign permissions ke admin_skpd
- ✅ Bisa lihat semua halaman (read-only)

### 2. Admin SKPD Login
- ✅ Hanya lihat menu sesuai permissions
- ✅ Bisa create penulis
- ✅ Bisa assign permissions ke penulis
- ✅ Bisa edit nama_lengkap sendiri
- ✅ Tidak bisa edit email/password/peran sendiri
- ❌ Tidak bisa akses halaman tanpa permission

### 3. Penulis Login
- ✅ Hanya lihat menu sesuai permissions
- ✅ Bisa edit nama_lengkap sendiri
- ✅ Bisa akses halaman sesuai permission
- ❌ Tidak bisa akses manajemen pengguna
- ❌ Tidak bisa create user lain
- ❌ Tidak bisa edit user lain

### 4. Permission Bypass Test
- ❌ Direct API call tanpa permission → Blocked by RLS
- ❌ URL manipulation → Redirect by PermissionGuard
- ❌ Edit user lain via API → Blocked by RLS

## Security Best Practices

1. **RLS is Mandatory**: Semua tabel memiliki RLS policies
2. **Helper Functions**: Gunakan SECURITY DEFINER dengan hati-hati
3. **Client-side Guards**: Double protection dengan frontend guards
4. **Audit Trail**: Tracking `dibuat_oleh` untuk accountability
5. **Field-level Access**: Batasi field yang bisa diedit per role
6. **Permission Validation**: Server-side validation via RLS

## Future Enhancements

1. **Activity Logs**: Track semua aktivitas user
2. **Permission Groups**: Group permissions untuk management lebih mudah
3. **Time-based Access**: Permissions dengan expiry date
4. **IP Whitelist**: Restrict access berdasarkan IP
5. **2FA**: Two-factor authentication untuk superadmin
6. **Bulk Operations**: Assign permissions ke multiple users sekaligus
7. **Permission Templates**: Pre-defined permission sets

## Troubleshooting

### User tidak bisa login setelah migration
- Check apakah peran sudah di-update ke format baru
- Verify RLS policies aktif
- Check auth.users masih linked ke pengguna table

### Permissions tidak muncul
- Verify `pengguna_hak_akses` table populated
- Check RLS policy `allow_read_own_permissions`
- Refresh browser atau call `refreshPermissions()`

### Menu tidak muncul setelah assign permission
- Call `refreshPermissions()` di `useAuthStore`
- Verify permission code match dengan `PAGE_CODES`
- Check `hasPermission()` logic di Sidebar

### Error saat create user
- Check `dibuat_oleh` di-set dengan benar
- Verify target role sesuai hierarki
- Check RLS policy `allow_insert_pengguna`

## Support

Untuk pertanyaan atau issue, refer to:
- PRD.md - Product requirements
- Database schema comments
- Inline code documentation

---

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Production Ready

