// Status berita
export const BERITA_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
}

// Status agenda kota
export const AGENDA_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SELESAI: 'selesai',
  DIBATALKAN: 'dibatalkan',
}

// Peran pengguna
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN_SKPD: 'admin_skpd',
  PENULIS: 'penulis',
}

// Kategori permission
export const PERMISSION_CATEGORIES = {
  SUPERADMIN_ONLY: 'superadmin_only',
  ADMIN_SKPD_OPTIONS: 'admin_skpd_options',
  PENULIS_OPTIONS: 'penulis_options',
}

// Kode halaman untuk permission
export const PAGE_CODES = {
  DASHBOARD: 'dashboard',
  MANAJEMEN_PENGGUNA: 'manajemen_pengguna',
  BERITA: 'berita',
  ARTIKEL: 'artikel',
  AGENDA_KOTA: 'agenda_kota',
  LAYANAN: 'layanan',
  PERANGKAT_DAERAH: 'perangkat_daerah',
  TRANSPARANSI: 'transparansi',
  HALAMAN: 'halaman',
  WISATA: 'wisata',
  VIDEO: 'video',
  PENGUMUMAN: 'pengumuman',
  SOSIAL_MEDIA: 'sosial_media',
  PENGATURAN: 'pengaturan',
}

// Label untuk peran
export const ROLE_LABELS = {
  [ROLES.SUPERADMIN]: 'Superadmin',
  [ROLES.ADMIN_SKPD]: 'Admin SKPD',
  [ROLES.PENULIS]: 'Penulis',
}

// Pagination default
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 20, 50, 100],
}

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}

// Halaman statis
export const STATIC_PAGES = {
  TENTANG: 'tentang',
  SOSIAL_MEDIA: 'sosial-media',
  VISI_MISI: 'visi-misi',
  STRUKTUR_ORGANISASI: 'struktur-organisasi',
}

// Routes
export const ROUTES = {
  // Public
  HOME: '/',
  BERITA: '/berita',
  BERITA_DETAIL: '/berita/:slug',
  LAYANAN: '/layanan',
  LAYANAN_DETAIL: '/layanan/:id',
  TENTANG: '/tentang',
  SOSIAL_MEDIA: '/sosial-media',
  
  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_BERITA: '/admin/berita',
  ADMIN_BERITA_TAMBAH: '/admin/berita/tambah',
  ADMIN_BERITA_EDIT: '/admin/berita/edit/:id',
  ADMIN_KATEGORI: '/admin/kategori',
  ADMIN_KATEGORI_TAMBAH: '/admin/kategori/tambah',
  ADMIN_KATEGORI_EDIT: '/admin/kategori/edit/:id',
  ADMIN_LAYANAN: '/admin/layanan',
  ADMIN_LAYANAN_TAMBAH: '/admin/layanan/tambah',
  ADMIN_LAYANAN_EDIT: '/admin/layanan/edit/:id',
  ADMIN_HALAMAN: '/admin/halaman',
  ADMIN_HALAMAN_EDIT: '/admin/halaman/edit/:id',
  ADMIN_PENGGUNA: '/admin/pengguna',
  ADMIN_PENGGUNA_TAMBAH: '/admin/pengguna/tambah',
  ADMIN_PENGGUNA_EDIT: '/admin/pengguna/edit/:id',
}

