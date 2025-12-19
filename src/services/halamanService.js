import { supabase } from './supabase'
import { cacheService } from './cacheService'

// Helper untuk timeout query
async function withTimeout(promise, timeoutMs = 10000) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
  })
  return Promise.race([promise, timeout])
}

// Helper untuk retry query
async function withRetry(fn, maxRetries = 2) {
  let lastError
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }
  throw lastError
}

export const halamanService = {
  // Get count halaman saja (untuk dashboard stats)
  async getCount() {
    const cacheKey = 'halaman:count'
    
    // Check cache first
    const cached = cacheService.get(cacheKey)
    if (cached !== null && cached !== undefined) {
      return cached
    }

    const queryFn = async () => {
      const { count, error } = await supabase
        .from('halaman')
        .select('id', { count: 'planned', head: true })
      
      if (error) throw error
      const result = count || 0
      
      // Cache untuk 10 menit
      cacheService.set(cacheKey, result, 600)
      
      return result
    }

    // Timeout pendek (2 detik), tidak ada retry - jika gagal return 0
    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      // Jika gagal, return 0 untuk tidak block UI
      console.warn('Failed to get halaman count:', error)
      return 0
    }
  },

  // Get all halaman dengan caching
  async getAll() {
    const cacheKey = 'halaman:all'
    
    // Check cache first
    const cached = cacheService.get(cacheKey)
    if (cached) {
      return cached
    }

    const queryFn = async () => {
      // Optimasi: hanya ambil kolom yang diperlukan untuk list view
      const { data, error } = await supabase
        .from('halaman')
        .select('id, slug, judul, diperbarui_pada')
        .order('judul', { ascending: true })
      
      if (error) throw error
      const result = data || []
      
      // Cache untuk 10 menit
      cacheService.set(cacheKey, result, 600)
      
      return result
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get halaman by slug dengan caching
  async getBySlug(slug) {
    const cacheKey = `halaman:slug:${slug}`
    
    // Check cache first
    const cached = cacheService.get(cacheKey)
    if (cached) {
      return cached
    }

    const queryFn = async () => {
      const { data, error } = await supabase
        .from('halaman')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      
      // Cache untuk 10 menit
      cacheService.set(cacheKey, data, 600)
      
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get halaman by ID
  async getById(id) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('halaman')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Update halaman
  async update(id, halamanData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('halaman')
        .update(halamanData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      // Clear cache
      cacheService.delete('halaman:all')
      if (data?.slug) {
        cacheService.delete(`halaman:slug:${data.slug}`)
      }
      
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Update halaman by slug
  async updateBySlug(slug, halamanData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('halaman')
        .update(halamanData)
        .eq('slug', slug)
        .select()
        .single()
      
      if (error) throw error
      
      // Clear cache
      cacheService.delete('halaman:all')
      cacheService.delete(`halaman:slug:${slug}`)
      
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Create halaman
  async create(halamanData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('halaman')
        .insert(halamanData)
        .select()
        .single()
      
      if (error) throw error
      
      // Clear cache
      cacheService.delete('halaman:all')
      cacheService.delete('halaman:count')
      if (data?.slug) {
        cacheService.delete(`halaman:slug:${data.slug}`)
      }
      
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Delete halaman
  async delete(id) {
    const queryFn = async () => {
      // Get slug sebelum delete untuk clear cache
      const { data: halamanData } = await supabase
        .from('halaman')
        .select('slug')
        .eq('id', id)
        .single()

      const { error } = await supabase
        .from('halaman')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Clear cache
      cacheService.delete('halaman:all')
      cacheService.delete('halaman:count')
      if (halamanData?.slug) {
        cacheService.delete(`halaman:slug:${halamanData.slug}`)
      }
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get stats halaman (total, published, draft) - untuk dashboard
  async getStats() {
    const queryFn = async () => {
      // Halaman tidak punya status, jadi kita hitung total saja
      // Untuk dashboard SKPD, kita anggap semua halaman adalah "published"
      const { count, error } = await supabase
        .from('halaman')
        .select('id', { count: 'planned', head: true })
      
      if (error) throw error
      
      return {
        total: count || 0,
        published: count || 0,
        draft: 0,
      }
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get halaman stats:', error)
      return { total: 0, published: 0, draft: 0 }
    }
  },

  // Get drafts halaman (untuk dashboard SKPD)
  // Note: Halaman tidak punya status draft, jadi return empty array
  async getDrafts(limit = 5) {
    // Halaman tidak punya status, jadi tidak ada draft
    return []
  },

  // Get published content count by day (for chart)
  // Note: Halaman tidak punya status, jadi kita hitung berdasarkan dibuat_pada
  async getPublishedByDay(days = 30) {
    const queryFn = async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      const startDateISO = startDate.toISOString()

      const { data, error } = await supabase
        .from('halaman')
        .select('dibuat_pada')
        .gte('dibuat_pada', startDateISO)
        .order('dibuat_pada', { ascending: true })

      if (error) throw error

      // Group by date
      const grouped = {}
      data.forEach(item => {
        if (item.dibuat_pada) {
          const dateKey = new Date(item.dibuat_pada).toISOString().split('T')[0]
          grouped[dateKey] = (grouped[dateKey] || 0) + 1
        }
      })

      // Convert to array format
      return Object.entries(grouped).map(([date, count]) => ({
        date,
        count,
      }))
    }

    try {
      return await withTimeout(queryFn(), 5000)
    } catch (error) {
      console.warn('Failed to get halaman by day:', error)
      return []
    }
  },
}

