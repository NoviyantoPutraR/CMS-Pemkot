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

export const wisataService = {
  async getCount() {
    const queryFn = async () => {
      const { count, error } = await supabase
        .from('wisata')
        .select('id', { count: 'planned', head: true })
      
      if (error) throw error
      return count || 0
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get wisata count:', error)
      return 0
    }
  },

  // Get stats wisata (total, published, draft) - untuk dashboard
  async getStats() {
    const queryFn = async () => {
      const [totalResult, publishedResult, draftResult] = await Promise.all([
        supabase.from('wisata').select('id', { count: 'planned', head: true }),
        supabase.from('wisata').select('id', { count: 'planned', head: true }).eq('status', 'published'),
        supabase.from('wisata').select('id', { count: 'planned', head: true }).eq('status', 'draft'),
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
      console.warn('Failed to get wisata stats:', error)
      return { total: 0, published: 0, draft: 0 }
    }
  },

  // Get public stats (hanya published) - untuk halaman public
  async getPublicStats() {
    const queryFn = async () => {
      const { count, error } = await supabase
        .from('wisata')
        .select('id', { count: 'planned', head: true })
        .eq('status', 'published')
      
      if (error) throw error
      return { total: count || 0 }
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get public wisata stats:', error)
      return { total: 0 }
    }
  },

  async getAll({ page = 1, limit = 10, search = '', status = null, publishedOnly = false, sortBy = 'terbaru' }) {
    const queryFn = async () => {
      let query = supabase
        .from('wisata')
        .select(`
          id,
          nama,
          slug,
          deskripsi,
          gambar_url,
          alamat,
          status,
          dilihat,
          dibuat_pada
        `, { count: 'planned' })

      // Filter by status (untuk admin) atau hanya published (untuk public)
      if (publishedOnly) {
        query = query.eq('status', 'published')
      } else if (status) {
        query = query.eq('status', status)
      }

      // Search
      if (search) {
        query = query.ilike('nama', `%${search}%`)
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

  async getById(id) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('wisata')
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
        .from('wisata')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async create(wisataData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('wisata')
        .insert(wisataData)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async update(id, wisataData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('wisata')
        .update(wisataData)
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
        .from('wisata')
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
        .from('wisata')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get active count by author (for penulis dashboard)
  async getActiveCountByAuthor(authorId) {
    const queryFn = async () => {
      let query = supabase
        .from('wisata')
        .select('id', { count: 'planned', head: true })
        .eq('status', 'published')

      try {
        const { data: testData } = await supabase.from('wisata').select('author_id').limit(1)
        if (testData && testData.length > 0 && testData[0].hasOwnProperty('author_id')) {
          query = query.eq('author_id', authorId)
        }
      } catch (e) {
        // Column doesn't exist, rely on RLS
      }

      const { count, error } = await query
      if (error) throw error
      return count || 0
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get active wisata count by author:', error)
      return 0
    }
  },
}

