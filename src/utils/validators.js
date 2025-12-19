import { z } from 'zod'

// Schema validasi untuk Berita
export const beritaSchema = z.object({
  judul: z
    .string()
    .min(10, 'Judul harus minimal 10 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  konten: z
    .string()
    .min(50, 'Konten harus minimal 50 karakter'),
  thumbnail_url: z
    .string()
    .url('URL thumbnail tidak valid')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['draft', 'published'], {
      errorMap: () => ({ message: 'Status harus draft atau published' }),
    }),
  meta_description: z
    .string()
    .max(160, 'Meta description maksimal 160 karakter')
    .optional()
    .or(z.literal('')),
})

// Schema validasi untuk Artikel (sama dengan Berita)
export const artikelSchema = z.object({
  judul: z
    .string()
    .min(10, 'Judul harus minimal 10 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  konten: z
    .string()
    .min(50, 'Konten harus minimal 50 karakter'),
  thumbnail_url: z
    .string()
    .url('URL thumbnail tidak valid')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['draft', 'published'], {
      errorMap: () => ({ message: 'Status harus draft atau published' }),
    }),
  meta_description: z
    .string()
    .max(160, 'Meta description maksimal 160 karakter')
    .optional()
    .or(z.literal('')),
})

// Schema validasi untuk Kategori
export const kategoriSchema = z.object({
  nama: z
    .string()
    .min(3, 'Nama kategori harus minimal 3 karakter')
    .max(50, 'Nama kategori maksimal 50 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
})

// Schema validasi untuk Layanan
export const layananSchema = z.object({
  judul: z
    .string()
    .min(10, 'Judul harus minimal 10 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  konten: z
    .string()
    .min(50, 'Konten harus minimal 50 karakter'),
  icon_url: z
    .string()
    .url('URL icon tidak valid')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['draft', 'published', 'archived'], {
      errorMap: () => ({ message: 'Status harus draft, published, atau archived' }),
    })
    .optional(),
})

// Helper function untuk validasi konten ReactQuill
// Strip HTML tags dan cek panjang text content yang sebenarnya
export function validateQuillContent(htmlContent, minLength = 50) {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return { isValid: false, message: 'Konten harus diisi' }
  }

  // Strip HTML tags dan decode entities
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent
  const textContent = tempDiv.textContent || tempDiv.innerText || ''
  const trimmedText = textContent.trim()

  // Hapus whitespace berlebihan
  const cleanText = trimmedText.replace(/\s+/g, ' ').trim()

  if (cleanText.length < minLength) {
    return {
      isValid: false,
      message: `Konten harus minimal ${minLength} karakter. Saat ini hanya ${cleanText.length} karakter.`,
    }
  }

  return { isValid: true, message: null }
}

// Schema validasi untuk Halaman
export const halamanSchema = z.object({
  judul: z
    .string()
    .min(5, 'Judul harus minimal 5 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .max(200, 'Slug maksimal 200 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  konten: z
    .string()
    .min(50, 'Konten harus minimal 50 karakter')
    .refine(
      (val) => {
        const validation = validateQuillContent(val, 50)
        return validation.isValid
      },
      {
        message: 'Konten harus minimal 50 karakter (tidak termasuk formatting HTML)',
      }
    ),
  meta_description: z
    .string()
    .max(160, 'Meta description maksimal 160 karakter')
    .optional()
    .or(z.literal('')),
  meta_keywords: z
    .string()
    .max(255, 'Meta keywords maksimal 255 karakter')
    .optional()
    .or(z.literal('')),
})

// Schema validasi untuk Admin Pengguna
export const adminSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Password harus minimal 8 karakter')
    .regex(/[A-Za-z]/, 'Password harus mengandung huruf')
    .regex(/[0-9]/, 'Password harus mengandung angka')
    .optional(),
  nama_lengkap: z
    .string()
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .optional()
    .or(z.literal('')),
  peran: z
    .string()
    .default('admin'),
})

// Schema validasi untuk Login
export const loginSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password harus diisi'),
})

// Schema validasi untuk Agenda Kota
export const agendaSchema = z.object({
  judul: z
    .string()
    .min(10, 'Judul harus minimal 10 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  deskripsi: z
    .string()
    .max(1000, 'Deskripsi maksimal 1000 karakter')
    .optional()
    .or(z.literal('')),
  tanggal_mulai: z
    .string()
    .min(1, 'Tanggal mulai harus diisi')
    .refine((val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Tanggal mulai tidak valid'),
  tanggal_selesai: z
    .string()
    .optional()
    .or(z.literal('')),
  lokasi: z
    .string()
    .max(200, 'Lokasi maksimal 200 karakter')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['draft', 'published', 'selesai', 'dibatalkan'], {
      errorMap: () => ({ message: 'Status harus draft, published, selesai, atau dibatalkan' }),
    }),
}).superRefine((data, ctx) => {
  // Validasi tanggal selesai harus >= tanggal mulai
  if (data.tanggal_selesai && data.tanggal_selesai !== '') {
    const tanggalMulai = new Date(data.tanggal_mulai)
    const tanggalSelesai = new Date(data.tanggal_selesai)
    
    if (isNaN(tanggalSelesai.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tanggal selesai tidak valid',
        path: ['tanggal_selesai'],
      })
    } else if (tanggalSelesai < tanggalMulai) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tanggal selesai harus lebih besar atau sama dengan tanggal mulai',
        path: ['tanggal_selesai'],
      })
    }
  }
})

// Schema validasi untuk Perangkat Daerah
export const perangkatDaerahSchema = z.object({
  nama_perangkat: z
    .string()
    .min(5, 'Nama perangkat harus minimal 5 karakter')
    .max(100, 'Nama perangkat maksimal 100 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  jabatan_kepala: z
    .string()
    .max(100, 'Jabatan kepala maksimal 100 karakter')
    .optional()
    .or(z.literal('')),
  nama_kepala: z
    .string()
    .max(100, 'Nama kepala maksimal 100 karakter')
    .optional()
    .or(z.literal('')),
  kontak: z
    .string()
    .max(200, 'Kontak maksimal 200 karakter')
    .optional()
    .or(z.literal('')),
  alamat: z
    .string()
    .max(500, 'Alamat maksimal 500 karakter')
    .optional()
    .or(z.literal('')),
  deskripsi: z
    .string()
    .max(1000, 'Deskripsi maksimal 1000 karakter')
    .optional()
    .or(z.literal('')),
  urutan: z
    .number()
    .int('Urutan harus bilangan bulat')
    .optional()
    .nullable()
    .or(z.nan().transform(() => null)),
  aktif: z.boolean(),
  foto_url: z
    .string()
    .url('URL foto tidak valid')
    .optional()
    .or(z.literal('')),
})

// Schema validasi untuk Transparansi Anggaran
export const transparansiAnggaranSchema = z.object({
  tahun: z
    .number()
    .int('Tahun harus bilangan bulat')
    .min(2021, 'Tahun minimal 2021')
    .max(2026, 'Tahun maksimal 2026'),
  deskripsi: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['draft', 'published'], {
      errorMap: () => ({ message: 'Status harus draft atau published' }),
    }),
  file_excel_url: z
    .string()
    .url('URL file Excel tidak valid')
    .optional()
    .or(z.literal('')),
  file_pdf_url: z
    .string()
    .url('URL file PDF tidak valid')
    .optional()
    .or(z.literal('')),
})

// Schema validasi untuk Wisata
export const wisataSchema = z.object({
  nama: z
    .string()
    .min(5, 'Nama harus minimal 5 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  deskripsi: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional()
    .or(z.literal('')),
  konten: z
    .string()
    .min(50, 'Konten harus minimal 50 karakter'),
  gambar_url: z
    .string()
    .url('URL gambar tidak valid')
    .optional()
    .or(z.literal('')),
  alamat: z
    .string()
    .max(500, 'Alamat maksimal 500 karakter')
    .optional()
    .or(z.literal('')),
  koordinat_lat: z
    .number()
    .min(-90, 'Latitude harus antara -90 dan 90')
    .max(90, 'Latitude harus antara -90 dan 90')
    .optional()
    .nullable()
    .or(z.nan().transform(() => null)),
  koordinat_lng: z
    .number()
    .min(-180, 'Longitude harus antara -180 dan 180')
    .max(180, 'Longitude harus antara -180 dan 180')
    .optional()
    .nullable()
    .or(z.nan().transform(() => null)),
  status: z
    .enum(['draft', 'published', 'archived'], {
      errorMap: () => ({ message: 'Status harus draft, published, atau archived' }),
    }),
  meta_description: z
    .string()
    .max(160, 'Meta description maksimal 160 karakter')
    .optional()
    .or(z.literal('')),
})


// Schema validasi untuk Video
export const videoSchema = z.object({
  judul: z
    .string()
    .min(10, 'Judul harus minimal 10 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  deskripsi: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional()
    .or(z.literal('')),
  url_video: z
    .string()
    .url('URL video tidak valid')
    .refine((val) => {
      // Validasi URL YouTube atau Vimeo
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
      const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/
      return youtubeRegex.test(val) || vimeoRegex.test(val) || val.startsWith('http')
    }, 'URL video harus valid (YouTube, Vimeo, atau URL file video)'),
  thumbnail_url: z
    .string()
    .url('URL thumbnail tidak valid')
    .optional()
    .or(z.literal('')),
  durasi: z
    .number()
    .int('Durasi harus bilangan bulat')
    .min(0, 'Durasi minimal 0 detik')
    .optional()
    .nullable()
    .or(z.nan().transform(() => null)),
  status: z
    .enum(['draft', 'published', 'archived'], {
      errorMap: () => ({ message: 'Status harus draft, published, atau archived' }),
    }),
})

// Schema validasi untuk Pengumuman
export const pengumumanSchema = z.object({
  judul: z
    .string()
    .min(10, 'Judul harus minimal 10 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  konten: z
    .string()
    .min(50, 'Konten harus minimal 50 karakter'),
  file_lampiran_url: z
    .string()
    .url('URL file lampiran tidak valid')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['draft', 'published', 'archived'], {
      errorMap: () => ({ message: 'Status harus draft, published, atau archived' }),
    }),
  tanggal_berlaku_mulai: z
    .string()
    .optional()
    .or(z.literal('')),
  tanggal_berlaku_selesai: z
    .string()
    .optional()
    .or(z.literal('')),
}).superRefine((data, ctx) => {
  // Validasi tanggal berlaku selesai harus >= tanggal mulai
  if (data.tanggal_berlaku_mulai && data.tanggal_berlaku_mulai !== '' &&
      data.tanggal_berlaku_selesai && data.tanggal_berlaku_selesai !== '') {
    const tanggalMulai = new Date(data.tanggal_berlaku_mulai)
    const tanggalSelesai = new Date(data.tanggal_berlaku_selesai)
    
    if (isNaN(tanggalSelesai.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tanggal berlaku selesai tidak valid',
        path: ['tanggal_berlaku_selesai'],
      })
    } else if (tanggalSelesai < tanggalMulai) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tanggal berlaku selesai harus lebih besar atau sama dengan tanggal mulai',
        path: ['tanggal_berlaku_selesai'],
      })
    }
  }
})

// Schema validasi untuk Sosial Media
export const sosialMediaSchema = z.object({
  url: z
    .string()
    .url('URL tidak valid'),
  ikon_url: z
    .string()
    .url('URL ikon tidak valid')
    .optional()
    .or(z.literal('')),
  aktif: z.boolean(),
  urutan: z
    .number()
    .int('Urutan harus bilangan bulat')
    .optional()
    .nullable()
    .or(z.nan().transform(() => null)),
})

// Schema validasi untuk Pengaturan Situs
export const pengaturanSitusSchema = z.object({
  nilai: z
    .string()
    .max(1000, 'Nilai maksimal 1000 karakter'),
})

