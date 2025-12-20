import { supabase, supabaseAdmin } from './supabase'

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
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }
  throw lastError
}

export const beritaService = {
  // Get stats berita (total, published, draft) - optimized untuk dashboard
  async getStats() {
    // Untuk stats dashboard, tidak perlu retry - jika gagal return default values
    const queryFn = async () => {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfMonthISO = startOfMonth.toISOString()

      const [totalResult, publishedResult, draftResult, thisMonthResult] = await Promise.all([
        supabase.from('berita').select('id', { count: 'planned', head: true }),
        supabase.from('berita').select('id', { count: 'planned', head: true }).eq('status', 'published'),
        supabase.from('berita').select('id', { count: 'planned', head: true }).eq('status', 'draft'),
        supabase.from('berita').select('id', { count: 'planned', head: true })
          .eq('status', 'published')
          .gte('dibuat_pada', startOfMonthISO),
      ])

      return {
        total: totalResult.count || 0,
        published: publishedResult.count || 0,
        draft: draftResult.count || 0,
        thisMonth: thisMonthResult.count || 0,
      }
    }

    // Timeout pendek (2 detik), tidak ada retry - jika gagal return default
    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      // Jika gagal, return default values untuk tidak block UI
      console.warn('Failed to get berita stats:', error)
      return { total: 0, published: 0, draft: 0, thisMonth: 0 }
    }
  },

  // Get stats berita dengan admin client (bypass RLS) - untuk dashboard penulis
  async getStatsAdmin() {
    if (!supabaseAdmin) {
      console.warn('⚠️ supabaseAdmin not available, falling back to regular getStats()')
      console.warn('⚠️ Make sure VITE_SUPABASE_SERVICE_ROLE_KEY is set in .env file')
      return this.getStats()
    }

    console.log('✅ Using supabaseAdmin for berita stats (bypassing RLS)')

    const queryFn = async () => {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfMonthISO = startOfMonth.toISOString()

      const [totalResult, publishedResult, draftResult, thisMonthResult] = await Promise.all([
        supabaseAdmin.from('berita').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('berita').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabaseAdmin.from('berita').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabaseAdmin.from('berita').select('id', { count: 'exact', head: true })
          .eq('status', 'published')
          .gte('dibuat_pada', startOfMonthISO),
      ])

      // Log errors if any
      if (totalResult.error) {
        console.error('❌ Error getting total berita count:', totalResult.error)
      }
      if (publishedResult.error) {
        console.error('❌ Error getting published berita count:', publishedResult.error)
      }
      if (draftResult.error) {
        console.error('❌ Error getting draft berita count:', draftResult.error)
      }
      if (thisMonthResult.error) {
        console.error('❌ Error getting this month berita count:', thisMonthResult.error)
      }

      const stats = {
        total: totalResult.count || 0,
        published: publishedResult.count || 0,
        draft: draftResult.count || 0,
        thisMonth: thisMonthResult.count || 0,
      }

      console.log('📊 Berita stats from database:', stats)
      return stats
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.error('❌ Failed to get berita stats (admin):', error)
      console.error('❌ Error details:', error.message, error.stack)
      return { total: 0, published: 0, draft: 0, thisMonth: 0 }
    }
  },

  // Get all berita dengan filter dan pagination
  async getAll({ page = 1, limit = 10, search = '', status = null, publishedOnly = false, sortBy = 'terbaru' }) {
    const queryFn = async () => {
      // Optimasi: hanya ambil kolom yang diperlukan untuk list view
      let query = supabase
        .from('berita')
        .select(`
          id,
          judul,
          slug,
          thumbnail_url,
          status,
          meta_description,
          dibuat_pada,
          dilihat
        `, { count: 'planned' }) // Gunakan planned untuk estimasi cepat

      // Filter by status (untuk admin) atau hanya published (untuk public)
      if (publishedOnly) {
        query = query.eq('status', 'published')
      } else if (status) {
        query = query.eq('status', status)
      }

      // Search
      if (search) {
        query = query.ilike('judul', `%${search}%`)
      }

      // Sorting
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
      if (error) throw error

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

  // Get berita by slug
  async getBySlug(slug) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get berita by ID
  async getById(id) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get latest berita (untuk homepage)
  async getLatest(limit = 6) {
    const queryFn = async () => {
      // Optimasi: hanya ambil kolom yang diperlukan untuk card view
      const { data, error } = await supabase
        .from('berita')
        .select(`
          id,
          judul,
          slug,
          thumbnail_url,
          meta_description,
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

  // Get related berita
  async getRelated(beritaId, limit = 4) {
    const queryFn = async () => {
      // Optimasi: hanya ambil kolom yang diperlukan untuk card view
      const { data, error } = await supabase
        .from('berita')
        .select(`
          id,
          judul,
          slug,
          thumbnail_url,
          meta_description,
          dibuat_pada
        `)
        .eq('status', 'published')
        .neq('id', beritaId)
        .order('dibuat_pada', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data || []
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Create berita
  async create(beritaData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('berita')
        .insert(beritaData)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Update berita
  async update(id, beritaData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('berita')
        .update(beritaData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Delete berita
  async delete(id) {
    const queryFn = async () => {
      const { error } = await supabase
        .from('berita')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Toggle status (draft/published)
  async toggleStatus(id, currentStatus) {
    const queryFn = async () => {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      const { data, error } = await supabase
        .from('berita')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Increment views counter
  async incrementViews(id) {
    const queryFn = async () => {
      // Ambil nilai dilihat saat ini
      const { data: current, error: fetchError } = await supabase
        .from('berita')
        .select('dilihat')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      
      if (current) {
        // Increment dilihat
        const { data, error } = await supabase
          .from('berita')
          .update({ dilihat: (current.dilihat || 0) + 1 })
          .eq('id', id)
          .select()
        
        if (error) throw error
        return data
      }
      
      return null
    }

    // Fire and forget - tidak perlu retry atau blocking
    try {
      await withTimeout(queryFn(), 3000)
    } catch (error) {
      console.warn('Failed to increment views:', error)
      // Silent fail - tidak perlu notify user
    }
  },

  // Get oldest drafts (for dashboard)
  async getOldestDrafts(limit = 5) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('berita')
        .select('id, judul, dibuat_pada, status')
        .eq('status', 'draft')
        .order('dibuat_pada', { ascending: true })
        .limit(limit)
      
      if (error) throw error
      return (data || []).map(item => ({ ...item, jenis: 'berita' }))
    }

    try {
      return await withTimeout(queryFn(), 3000)
    } catch (error) {
      console.warn('Failed to get oldest drafts:', error)
      return []
    }
  },

  // Get top content by views
  async getTopByViews(limit = 3) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('berita')
        .select('id, judul, dilihat, slug')
        .eq('status', 'published')
        .order('dilihat', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return (data || []).map(item => ({ ...item, jenis: 'berita' }))
    }

    try {
      return await withTimeout(queryFn(), 3000)
    } catch (error) {
      console.warn('Failed to get top content:', error)
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
        .from('berita')
        .select('dipublikasikan_pada')
        .eq('status', 'published')
        .gte('dipublikasikan_pada', startDateISO)
        .order('dipublikasikan_pada', { ascending: true })
      
      if (error) throw error

      // Group by date
      const grouped = {}
      const now = new Date()
      
      // Initialize all dates with 0
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dateKey = date.toISOString().split('T')[0]
        grouped[dateKey] = 0
      }

      // Count by date
      ;(data || []).forEach(item => {
        if (item.dipublikasikan_pada) {
          const dateKey = item.dipublikasikan_pada.split('T')[0]
          if (grouped[dateKey] !== undefined) {
            grouped[dateKey] = (grouped[dateKey] || 0) + 1
          }
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

  // Get stats by author (for penulis dashboard)
  // RLS policy should automatically filter by current user
  async getStatsByAuthor(authorId) {
    const queryFn = async () => {
      // Build base query - shows all data from all authors
      const buildQuery = (statusFilter = null) => {
        let query = supabase.from('berita').select('id', { count: 'planned', head: true })
        if (statusFilter) {
          query = query.eq('status', statusFilter)
        }
        return query
      }

      const [totalResult, publishedResult, draftResult] = await Promise.all([
        buildQuery(),
        buildQuery('published'),
        buildQuery('draft'),
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
      console.warn('Failed to get berita stats by author:', error)
      return { total: 0, published: 0, draft: 0 }
    }
  },

  // Get drafts by author
  async getDraftsByAuthor(authorId, limit = 6) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('berita')
        .select('id, judul, dibuat_pada, status')
        .eq('status', 'draft')
        .order('dibuat_pada', { ascending: true })
        .limit(limit)

      if (error) throw error
      return (data || []).map(item => ({ ...item, jenis: 'berita' }))
    }

    try {
      return await withTimeout(queryFn(), 3000)
    } catch (error) {
      console.warn('Failed to get drafts by author:', error)
      return []
    }
  },

  // Get published by day by author (for chart)
  async getPublishedByDayByAuthor(authorId, days = 30) {
    const queryFn = async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      const startDateISO = startDate.toISOString()

      const { data, error } = await supabase
        .from('berita')
        .select('dipublikasikan_pada')
        .eq('status', 'published')
        .gte('dipublikasikan_pada', startDateISO)
        .order('dipublikasikan_pada', { ascending: true })

      if (error) throw error

      // Group by date
      const grouped = {}
      const now = new Date()
      
      // Initialize all dates with 0
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dateKey = date.toISOString().split('T')[0]
        grouped[dateKey] = 0
      }

      // Count by date
      ;(data || []).forEach(item => {
        if (item.dipublikasikan_pada) {
          const dateKey = item.dipublikasikan_pada.split('T')[0]
          if (grouped[dateKey] !== undefined) {
            grouped[dateKey] = (grouped[dateKey] || 0) + 1
          }
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
      console.warn('Failed to get published by day by author:', error)
      return []
    }
  },
}

