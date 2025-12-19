import { supabase } from './supabase'

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

export const layananService = {
  // Get count layanan saja (untuk dashboard stats)
  async getCount() {
    const queryFn = async () => {
      const { count, error } = await supabase
        .from('layanan')
        .select('id', { count: 'planned', head: true })
      
      if (error) throw error
      return count || 0
    }

    // Timeout pendek (2 detik), tidak ada retry - jika gagal return 0
    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      // Jika gagal, return 0 untuk tidak block UI
      console.warn('Failed to get layanan count:', error)
      return 0
    }
  },

  // Get stats layanan (total, published, draft) - untuk dashboard
  async getStats() {
    const queryFn = async () => {
      const [totalResult, publishedResult, draftResult] = await Promise.all([
        supabase.from('layanan').select('id', { count: 'planned', head: true }),
        supabase.from('layanan').select('id', { count: 'planned', head: true }).eq('status', 'published'),
        supabase.from('layanan').select('id', { count: 'planned', head: true }).eq('status', 'draft'),
      ])

      return {
        total: totalResult.count || 0,
        published: publishedResult.count || 0,
        draft: draftResult.count || 0,
      }
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get layanan stats:', error)
      return { total: 0, published: 0, draft: 0 }
    }
  },

  // Get stats untuk public page (total published)
  async getPublicStats() {
    const queryFn = async () => {
      const { count, error } = await supabase
        .from('layanan')
        .select('id', { count: 'planned', head: true })
        .eq('status', 'published')
      
      if (error) throw error

      return {
        total: count || 0,
      }
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get public layanan stats:', error)
      return { total: 0 }
    }
  },

  // Get all layanan dengan pagination
  async getAll({ page = 1, limit = 10, search = '', status = null, publishedOnly = false, sortBy = 'terbaru' }) {
    const queryFn = async () => {
      // Optimasi: hanya ambil kolom yang diperlukan untuk list view
      let query = supabase
        .from('layanan')
        .select(`
          id,
          judul,
          slug,
          icon_url,
          meta_description,
          konten,
          status,
          dilihat,
          dibuat_pada
        `, { count: 'planned' })

      // Filter by status
      if (publishedOnly) {
        query = query.eq('status', 'published')
      } else if (status) {
        query = query.eq('status', status)
      }

      // Search
      if (search) {
        query = query.ilike('judul', `%${search}%`)
      }

      // Sort
      if (sortBy === 'terpopuler') {
        query = query.order('dilihat', { ascending: false })
      } else {
        query = query.order('dibuat_pada', { ascending: false })
      }

      // Pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query
      
      if (error) {
        console.error('Layanan getAll error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      console.log('Layanan getAll result:', {
        dataCount: data?.length || 0,
        totalCount: count || 0,
        page,
        limit,
        publishedOnly,
        status,
        search
      })

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      }
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get layanan by ID
  async getById(id) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('layanan')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get latest layanan (untuk homepage)
  async getLatest(limit = 6) {
    const queryFn = async () => {
      // Optimasi: hanya ambil kolom yang diperlukan untuk card view
      const { data, error } = await supabase
        .from('layanan')
        .select(`
          id,
          judul,
          slug,
          icon_url,
          dibuat_pada
        `)
        .eq('status', 'published')
        .order('dibuat_pada', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data || []
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Create layanan
  async create(layananData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('layanan')
        .insert(layananData)
        .select('*')
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Update layanan
  async update(id, layananData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('layanan')
        .update(layananData)
        .eq('id', id)
        .select('*')
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Toggle status (draft/published)
  async toggleStatus(id, currentStatus) {
    const queryFn = async () => {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      const { data, error } = await supabase
        .from('layanan')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Delete layanan
  async delete(id) {
    const queryFn = async () => {
      const { error } = await supabase
        .from('layanan')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get drafts layanan (untuk dashboard SKPD)
  async getDrafts(limit = 5) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('layanan')
        .select('id, judul, dibuat_pada, status')
        .eq('status', 'draft')
        .order('dibuat_pada', { ascending: true })
        .limit(limit)
      
      if (error) throw error
      return (data || []).map(item => ({ ...item, jenis: 'layanan' }))
    }

    try {
      return await withTimeout(queryFn(), 3000)
    } catch (error) {
      console.warn('Failed to get layanan drafts:', error)
      return []
    }
  },

  // Get published content count by day (for chart)
  async getPublishedByDay(days = 30) {
    const queryFn = async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      const startDateISO = startDate.toISOString()

      const { data, error } = await supabase
        .from('layanan')
        .select('dipublikasikan_pada, dibuat_pada')
        .eq('status', 'published')
        .gte('dibuat_pada', startDateISO)
        .order('dibuat_pada', { ascending: true })

      if (error) throw error

      // Group by date
      const grouped = {}
      data.forEach(item => {
        const date = item.dipublikasikan_pada || item.dibuat_pada
        if (date) {
          const dateKey = new Date(date).toISOString().split('T')[0]
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
      console.warn('Failed to get published by day:', error)
      return []
    }
  },
}

