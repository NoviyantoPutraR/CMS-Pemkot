import { supabase } from './supabase'

export const storageService = {
  // Upload file ke bucket
  async uploadFile(bucket, file, path) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
    
    if (error) throw error
    return data
  },

  // Get public URL
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  // Delete file
  async deleteFile(bucket, path) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
  },

  // Upload thumbnail berita
  async uploadBeritaThumbnail(file, beritaId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${beritaId}-${Date.now()}.${fileExt}`
    const filePath = `thumbnails/${fileName}`
    
    const { data, error } = await this.uploadFile('berita', file, filePath)
    if (error) throw error
    
    const publicUrl = this.getPublicUrl('berita', filePath)
    return { path: filePath, url: publicUrl }
  },

  // Upload thumbnail artikel
  async uploadArtikelThumbnail(file, artikelId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${artikelId}-${Date.now()}.${fileExt}`
    const filePath = `thumbnails/${fileName}`
    
    const { data, error } = await this.uploadFile('artikel', file, filePath)
    if (error) throw error
    
    const publicUrl = this.getPublicUrl('artikel', filePath)
    return { path: filePath, url: publicUrl }
  },

  // Upload icon layanan
  async uploadLayananIcon(file, layananId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${layananId}-${Date.now()}.${fileExt}`
    const filePath = `icons/${fileName}`
    
    const { data, error } = await this.uploadFile('layanan', file, filePath)
    if (error) throw error
    
    const publicUrl = this.getPublicUrl('layanan', filePath)
    return { path: filePath, url: publicUrl }
  },

  // Upload foto perangkat daerah
  async uploadPerangkatDaerahFoto(file, perangkatId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${perangkatId}-${Date.now()}.${fileExt}`
    const filePath = `foto/${fileName}`
    
    const { data, error } = await this.uploadFile('perangkat_daerah', file, filePath)
    if (error) throw error
    
    const publicUrl = this.getPublicUrl('perangkat_daerah', filePath)
    return { path: filePath, url: publicUrl }
  },

  /**
   * Upload file Excel transparansi
   * 
   * Catatan: Pastikan bucket 'transparansi' di Supabase sudah dikonfigurasi dengan
   * mime types berikut di bucket settings:
   * - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (untuk .xlsx)
   * - application/vnd.ms-excel (untuk .xls)
   * - application/pdf (untuk .pdf)
   */
  async uploadTransparansiExcel(file, tahun) {
    const fileExt = file.name.split('.').pop()
    const fileName = `anggaran-${tahun}-${Date.now()}.${fileExt}`
    const filePath = `excel/${fileName}`
    
    const { data, error } = await this.uploadFile('transparansi', file, filePath)
    if (error) {
      // Berikan pesan error yang lebih informatif untuk mime type error
      if (error.message?.includes('mime type') || error.message?.includes('not supported')) {
        throw new Error(
          `Mime type tidak didukung. Pastikan bucket 'transparansi' di Supabase sudah dikonfigurasi dengan mime types berikut: ` +
          `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf. ` +
          `Error detail: ${error.message}`
        )
      }
      throw error
    }
    
    const publicUrl = this.getPublicUrl('transparansi', filePath)
    return { path: filePath, url: publicUrl }
  },

  /**
   * Upload file PDF transparansi
   * 
   * Catatan: Pastikan bucket 'transparansi' di Supabase sudah dikonfigurasi dengan
   * mime types berikut di bucket settings:
   * - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (untuk .xlsx)
   * - application/vnd.ms-excel (untuk .xls)
   * - application/pdf (untuk .pdf)
   */
  async uploadTransparansiPdf(file, tahun) {
    const fileExt = file.name.split('.').pop()
    const fileName = `anggaran-${tahun}-${Date.now()}.${fileExt}`
    const filePath = `pdf/${fileName}`
    
    const { data, error } = await this.uploadFile('transparansi', file, filePath)
    if (error) {
      // Berikan pesan error yang lebih informatif untuk mime type error
      if (error.message?.includes('mime type') || error.message?.includes('not supported')) {
        throw new Error(
          `Mime type tidak didukung. Pastikan bucket 'transparansi' di Supabase sudah dikonfigurasi dengan mime types berikut: ` +
          `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf. ` +
          `Error detail: ${error.message}`
        )
      }
      throw error
    }
    
    const publicUrl = this.getPublicUrl('transparansi', filePath)
    return { path: filePath, url: publicUrl }
  },

  // Validate Excel file
  validateExcelFile(file) {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ]
    const validExtensions = ['xlsx', 'xls']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    const fileExt = file.name.split('.').pop().toLowerCase()
    
    if (!validExtensions.includes(fileExt) && !validTypes.includes(file.type)) {
      throw new Error('Format file tidak didukung. Gunakan file Excel (.xlsx atau .xls).')
    }
    
    if (file.size > maxSize) {
      throw new Error('Ukuran file terlalu besar. Maksimal 10MB.')
    }
    
    return true
  },

  // Validate PDF file
  validatePdfFile(file) {
    const validTypes = ['application/pdf']
    const validExtensions = ['pdf']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    const fileExt = file.name.split('.').pop().toLowerCase()
    
    if (!validExtensions.includes(fileExt) && !validTypes.includes(file.type)) {
      throw new Error('Format file tidak didukung. Gunakan file PDF (.pdf).')
    }
    
    if (file.size > maxSize) {
      throw new Error('Ukuran file terlalu besar. Maksimal 10MB.')
    }
    
    return true
  },

  // Upload gambar wisata
  async uploadWisataGambar(file, wisataId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${wisataId}-${Date.now()}.${fileExt}`
    const filePath = `gambar/${fileName}`
    
    const { data, error } = await this.uploadFile('wisata', file, filePath)
    if (error) throw error
    
    const publicUrl = this.getPublicUrl('wisata', filePath)
    return { path: filePath, url: publicUrl }
  },

  // Upload thumbnail video
  async uploadVideoThumbnail(file, videoId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${videoId}-${Date.now()}.${fileExt}`
    const filePath = `thumbnails/${fileName}`
    
    const { data, error } = await this.uploadFile('video', file, filePath)
    if (error) throw error
    
    const publicUrl = this.getPublicUrl('video', filePath)
    return { path: filePath, url: publicUrl }
  },

  // Upload file lampiran pengumuman
  async uploadPengumumanLampiran(file, pengumumanId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${pengumumanId}-${Date.now()}.${fileExt}`
    const filePath = `lampiran/${fileName}`
    
    const { data, error } = await this.uploadFile('pengumuman', file, filePath)
    if (error) throw error
    
    const publicUrl = this.getPublicUrl('pengumuman', filePath)
    return { path: filePath, url: publicUrl }
  },

  // Upload ikon sosial media
  async uploadSosialMediaIcon(file, platform) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${platform}-${Date.now()}.${fileExt}`
    const filePath = `icons/${fileName}`
    
    const { data, error } = await this.uploadFile('assets', file, filePath)
    if (error) throw error
    
    const publicUrl = this.getPublicUrl('assets', filePath)
    return { path: filePath, url: publicUrl }
  },

  // Validate document file (PDF, DOC, DOCX)
  validateDocumentFile(file) {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const validExtensions = ['pdf', 'doc', 'docx']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    const fileExt = file.name.split('.').pop().toLowerCase()
    
    if (!validExtensions.includes(fileExt) && !validTypes.includes(file.type)) {
      throw new Error('Format file tidak didukung. Gunakan file PDF, DOC, atau DOCX.')
    }
    
    if (file.size > maxSize) {
      throw new Error('Ukuran file terlalu besar. Maksimal 10MB.')
    }
    
    return true
  },

  // Validate image file
  validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 2 * 1024 * 1024 // 2MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.')
    }
    
    if (file.size > maxSize) {
      throw new Error('Ukuran file terlalu besar. Maksimal 2MB.')
    }
    
    return true
  },

  // Validate large image file (untuk wisata, max 5MB)
  validateLargeImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.')
    }
    
    if (file.size > maxSize) {
      throw new Error('Ukuran file terlalu besar. Maksimal 5MB.')
    }
    
    return true
  },
}

