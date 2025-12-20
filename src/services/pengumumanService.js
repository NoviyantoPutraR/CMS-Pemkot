import { supabase, supabaseAdmin } from './supabase'

async function withTimeout(promise, timeoutMs = 10000) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
  })
  return Promise.race([promise, timeout])
}

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

export const pengumumanService = {
  async getCount() {
    const queryFn = async () => {
      const { count, error } = await supabase
        .from('pengumuman')
        .select('id', { count: 'planned', head: true })
      
      if (error) throw error
      return count || 0
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get pengumuman count:', error)
      return 0
    }
  },

  // Get stats pengumuman (total, published, draft) - untuk dashboard
  async getStats() {
    const queryFn = async () => {
      const [totalResult, publishedResult, draftResult] = await Promise.all([
        supabase.from('pengumuman').select('id', { count: 'planned', head: true }),
        supabase.from('pengumuman').select('id', { count: 'planned', head: true }).eq('status', 'published'),
        supabase.from('pengumuman').select('id', { count: 'planned', head: true }).eq('status', 'draft'),
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
      console.warn('Failed to get pengumuman stats:', error)
      return { total: 0, published: 0, draft: 0 }
    }
  },

  // Get stats pengumuman dengan admin client (bypass RLS) - untuk dashboard penulis
  async getStatsAdmin() {
    if (!supabaseAdmin) {
      console.warn('⚠️ supabaseAdmin not available, falling back to regular getStats()')
      console.warn('⚠️ Make sure VITE_SUPABASE_SERVICE_ROLE_KEY is set in .env file')
      return this.getStats()
    }

    console.log('✅ Using supabaseAdmin for pengumuman stats (bypassing RLS)')

    const queryFn = async () => {
      const [totalResult, publishedResult, draftResult] = await Promise.all([
        supabaseAdmin.from('pengumuman').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('pengumuman').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabaseAdmin.from('pengumuman').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      ])

      // Log errors if any
      if (totalResult.error) {
        console.error('❌ Error getting total pengumuman count:', totalResult.error)
      }
      if (publishedResult.error) {
        console.error('❌ Error getting published pengumuman count:', publishedResult.error)
      }
      if (draftResult.error) {
        console.error('❌ Error getting draft pengumuman count:', draftResult.error)
      }

      const stats = {
        total: totalResult.count || 0,
        published: publishedResult.count || 0,
        draft: draftResult.count || 0,
      }

      console.log('📊 Pengumuman stats from database:', stats)
      return stats
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.error('❌ Failed to get pengumuman stats (admin):', error)
      console.error('❌ Error details:', error.message, error.stack)
      return { total: 0, published: 0, draft: 0 }
    }
  },

  async getAll({ page = 1, limit = 10, search = '', status = null }) {
    const queryFn = async () => {
      let query = supabase
        .from('pengumuman')
        .select(`
          id,
          judul,
          slug,
          konten,
          file_lampiran_url,
          status,
          tanggal_berlaku_mulai,
          tanggal_berlaku_selesai,
          dibuat_pada
        `, { count: 'planned' })
        .order('dibuat_pada', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.ilike('judul', `%${search}%`)
      }

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

  async getById(id) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('pengumuman')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async getBySlug(slug) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('pengumuman')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async create(pengumumanData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('pengumuman')
        .insert(pengumumanData)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async update(id, pengumumanData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('pengumuman')
        .update(pengumumanData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async delete(id) {
    const queryFn = async () => {
      const { error } = await supabase
        .from('pengumuman')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async toggleStatus(id, currentStatus) {
    const queryFn = async () => {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      const { data, error } = await supabase
        .from('pengumuman')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get all published pengumuman untuk public access dengan filter
  async getAllPublic({ 
    page = 1, 
    limit = 12, 
    search = '', 
    statusFilter = '', // 'aktif', 'berakhir', atau ''
    periodFilter = '', // 'hari-ini', 'minggu-ini', 'bulan-ini', atau ''
    sortBy = 'terbaru' // 'terbaru', 'terlama', 'relevansi'
  }) {
    const queryFn = async () => {
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const now = new Date()
      
      let query = supabase
        .from('pengumuman')
        .select(`
          id,
          judul,
          slug,
          konten,
          file_lampiran_url,
          status,
          tanggal_berlaku_mulai,
          tanggal_berlaku_selesai,
          dibuat_pada,
          dipublikasikan_pada
        `, { count: 'planned' })
      
      // Filter hanya published
      query = query.eq('status', 'published')
      
      // Filter status aktif/berakhir berdasarkan tanggal_berlaku_selesai
      if (statusFilter === 'aktif') {
        // Aktif: tanggal_berlaku_selesai >= today OR tanggal_berlaku_selesai IS NULL
        query = query.or(`tanggal_berlaku_selesai.gte.${today},tanggal_berlaku_selesai.is.null`)
      } else if (statusFilter === 'berakhir') {
        // Berakhir: tanggal_berlaku_selesai < today
        query = query.lt('tanggal_berlaku_selesai', today)
      }
      
      // Filter periode waktu berdasarkan dipublikasikan_pada
      if (periodFilter === 'hari-ini') {
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
        query = query.gte('dipublikasikan_pada', todayStart)
      } else if (periodFilter === 'minggu-ini') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        query = query.gte('dipublikasikan_pada', weekAgo)
      } else if (periodFilter === 'bulan-ini') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
        query = query.gte('dipublikasikan_pada', monthAgo)
      }
      
      // Search
      if (search) {
        query = query.ilike('judul', `%${search}%`)
      }
      
      // Sort
      if (sortBy === 'terbaru') {
        query = query.order('dipublikasikan_pada', { ascending: false, nullsFirst: false })
      } else if (sortBy === 'terlama') {
        query = query.order('dipublikasikan_pada', { ascending: true, nullsFirst: false })
      } else if (sortBy === 'relevansi' && search) {
        // Untuk relevansi, tetap urutkan berdasarkan dipublikasikan_pada DESC
        // (Supabase tidak memiliki full-text search ranking yang mudah)
        query = query.order('dipublikasikan_pada', { ascending: false, nullsFirst: false })
      } else {
        // Default: terbaru
        query = query.order('dipublikasikan_pada', { ascending: false, nullsFirst: false })
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

  // Get stats untuk public (hanya published dan aktif)
  async getPublicStats() {
    const queryFn = async () => {
      const today = new Date().toISOString().split('T')[0]
      
      const [totalResult, aktifResult] = await Promise.all([
        supabase
          .from('pengumuman')
          .select('id', { count: 'planned', head: true })
          .eq('status', 'published'),
        supabase
          .from('pengumuman')
          .select('id', { count: 'planned', head: true })
          .eq('status', 'published')
          .or(`tanggal_berlaku_selesai.gte.${today},tanggal_berlaku_selesai.is.null`)
      ])
      
      return {
        total: totalResult.count || 0,
        aktif: aktifResult.count || 0,
      }
    }
    
    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get public pengumuman stats:', error)
      return { total: 0, aktif: 0 }
    }
  },

  // Get oldest drafts (for dashboard)
  async getOldestDrafts(limit = 5) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('pengumuman')
        .select('id, judul, dibuat_pada, status')
        .eq('status', 'draft')
        .order('dibuat_pada', { ascending: true })
        .limit(limit)
      
      if (error) throw error
      return (data || []).map(item => ({ ...item, jenis: 'pengumuman' }))
    }

    try {
      return await withTimeout(queryFn(), 3000)
    } catch (error) {
      console.warn('Failed to get oldest drafts:', error)
      return []
    }
  },

  // Get stats by author (for penulis dashboard)
  async getStatsByAuthor(authorId) {
    const queryFn = async () => {
      // Build base query - shows all data from all authors
      const buildQuery = (statusFilter = null) => {
        let query = supabase.from('pengumuman').select('id', { count: 'planned', head: true })
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
      console.warn('Failed to get pengumuman stats by author:', error)
      return { total: 0, published: 0, draft: 0 }
    }
  },

  // Get drafts by author
  async getDraftsByAuthor(authorId, limit = 6) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('pengumuman')
        .select('id, judul, dibuat_pada, status')
        .eq('status', 'draft')
        .order('dibuat_pada', { ascending: true })
        .limit(limit)

      if (error) throw error
      return (data || []).map(item => ({ ...item, jenis: 'pengumuman' }))
    }

    try {
      return await withTimeout(queryFn(), 3000)
    } catch (error) {
      console.warn('Failed to get drafts by author:', error)
      return []
    }
  },
}

