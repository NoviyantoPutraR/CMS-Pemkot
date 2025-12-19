import { supabase } from './supabase'

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

export const videoService = {
  async getCount() {
    const queryFn = async () => {
      const { count, error } = await supabase
        .from('video')
        .select('id', { count: 'planned', head: true })
      
      if (error) throw error
      return count || 0
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get video count:', error)
      return 0
    }
  },

  // Get stats video (total, published, draft) - untuk dashboard
  async getStats() {
    const queryFn = async () => {
      const [totalResult, publishedResult, draftResult] = await Promise.all([
        supabase.from('video').select('id', { count: 'planned', head: true }),
        supabase.from('video').select('id', { count: 'planned', head: true }).eq('status', 'published'),
        supabase.from('video').select('id', { count: 'planned', head: true }).eq('status', 'draft'),
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
      console.warn('Failed to get video stats:', error)
      return { total: 0, published: 0, draft: 0 }
    }
  },

  async getAll({ page = 1, limit = 10, search = '', status = null, publishedOnly = false, sortBy = 'terbaru' }) {
    const queryFn = async () => {
      let query = supabase
        .from('video')
        .select(`
          id,
          judul,
          slug,
          deskripsi,
          url_video,
          thumbnail_url,
          durasi,
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
        .from('video')
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
        .from('video')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async create(videoData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('video')
        .insert(videoData)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async update(id, videoData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('video')
        .update(videoData)
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
        .from('video')
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
        .from('video')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get stats by author (for penulis dashboard)
  async getStatsByAuthor(authorId) {
    const queryFn = async () => {
      // Build base query - shows all data from all authors
      const buildQuery = (statusFilter = null) => {
        let query = supabase.from('video').select('id', { count: 'planned', head: true })
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
      console.warn('Failed to get video stats by author:', error)
      return { total: 0, published: 0, draft: 0 }
    }
  },

  // Get drafts by author
  async getDraftsByAuthor(authorId, limit = 6) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('video')
        .select('id, judul, dibuat_pada, status')
        .eq('status', 'draft')
        .order('dibuat_pada', { ascending: true })
        .limit(limit)

      if (error) throw error
      return (data || []).map(item => ({ ...item, jenis: 'video' }))
    }

    try {
      return await withTimeout(queryFn(), 3000)
    } catch (error) {
      console.warn('Failed to get drafts by author:', error)
      return []
    }
  },
}

