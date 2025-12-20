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

export const agendaKotaService = {
  async getStats() {
    const queryFn = async () => {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

      const [totalResult, publishedResult, draftResult, thisMonthResult] = await Promise.all([
        supabase.from('agenda_kota').select('id', { count: 'planned', head: true }),
        supabase.from('agenda_kota').select('id', { count: 'planned', head: true }).eq('status', 'published'),
        supabase.from('agenda_kota').select('id', { count: 'planned', head: true }).eq('status', 'draft'),
        supabase
          .from('agenda_kota')
          .select('id', { count: 'planned', head: true })
          .eq('status', 'published')
          .gte('tanggal_mulai', startOfMonth.toISOString())
          .lte('tanggal_mulai', endOfMonth.toISOString()),
      ])

      return {
        total: totalResult.count || 0,
        published: publishedResult.count || 0,
        draft: draftResult.count || 0,
        thisMonth: thisMonthResult.count || 0,
      }
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get agenda stats:', error)
      return { total: 0, published: 0, draft: 0, thisMonth: 0 }
    }
  },

  // Get stats agenda dengan admin client (bypass RLS) - untuk dashboard penulis
  async getStatsAdmin() {
    if (!supabaseAdmin) {
      console.warn('⚠️ supabaseAdmin not available, falling back to regular getStats()')
      console.warn('⚠️ Make sure VITE_SUPABASE_SERVICE_ROLE_KEY is set in .env file')
      return this.getStats()
    }

    console.log('✅ Using supabaseAdmin for agenda stats (bypassing RLS)')

    const queryFn = async () => {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

      const [totalResult, publishedResult, draftResult, thisMonthResult] = await Promise.all([
        supabaseAdmin.from('agenda_kota').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('agenda_kota').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabaseAdmin.from('agenda_kota').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabaseAdmin
          .from('agenda_kota')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published')
          .gte('tanggal_mulai', startOfMonth.toISOString())
          .lte('tanggal_mulai', endOfMonth.toISOString()),
      ])

      // Log errors if any
      if (totalResult.error) {
        console.error('❌ Error getting total agenda count:', totalResult.error)
      }
      if (publishedResult.error) {
        console.error('❌ Error getting published agenda count:', publishedResult.error)
      }
      if (draftResult.error) {
        console.error('❌ Error getting draft agenda count:', draftResult.error)
      }
      if (thisMonthResult.error) {
        console.error('❌ Error getting this month agenda count:', thisMonthResult.error)
      }

      const stats = {
        total: totalResult.count || 0,
        published: publishedResult.count || 0,
        draft: draftResult.count || 0,
        thisMonth: thisMonthResult.count || 0,
      }

      console.log('📊 Agenda stats from database:', stats)
      return stats
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.error('❌ Failed to get agenda stats (admin):', error)
      console.error('❌ Error details:', error.message, error.stack)
      return { total: 0, published: 0, draft: 0, thisMonth: 0 }
    }
  },

  async getAll({ page = 1, limit = 10, search = '', status = null, publishedOnly = false, sortOrder = 'asc' }) {
    const queryFn = async () => {
      let query = supabase
        .from('agenda_kota')
        .select('*', { count: 'planned' })
        .order('tanggal_mulai', { ascending: sortOrder === 'asc' })

      if (publishedOnly) {
        query = query.eq('status', 'published')
      } else if (status) {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.or(`judul.ilike.%${search}%,deskripsi.ilike.%${search}%`)
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
        .from('agenda_kota')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async getUpcoming(limit = 5) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('agenda_kota')
        .select('*')
        .eq('status', 'published')
        .gte('tanggal_mulai', new Date().toISOString())
        .order('tanggal_mulai', { ascending: true })
        .limit(limit)
      
      if (error) throw error
      return data || []
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async create(agendaData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('agenda_kota')
        .insert(agendaData)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async update(id, agendaData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('agenda_kota')
        .update(agendaData)
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
        .from('agenda_kota')
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
        .from('agenda_kota')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get agenda today and tomorrow (for dashboard)
  async getTodayAndTomorrow(limit = 4) {
    const queryFn = async () => {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
      const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999)

      const { data, error } = await supabase
        .from('agenda_kota')
        .select('id, judul, tanggal_mulai, lokasi, status')
        .eq('status', 'published')
        .gte('tanggal_mulai', todayStart.toISOString())
        .lte('tanggal_mulai', tomorrowEnd.toISOString())
        .order('tanggal_mulai', { ascending: true })
        .limit(limit)
      
      if (error) throw error
      return data || []
    }

    try {
      return await withTimeout(queryFn(), 3000)
    } catch (error) {
      console.warn('Failed to get today and tomorrow agenda:', error)
      return []
    }
  },

  // Get active count by author (for penulis dashboard)
  async getActiveCountByAuthor(authorId) {
    const queryFn = async () => {
      // RLS will handle filtering by author
      const { count, error } = await supabase
        .from('agenda_kota')
        .select('id', { count: 'planned', head: true })
        .eq('status', 'published')

      if (error) throw error
      return count || 0
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get active agenda count by author:', error)
      return 0
    }
  },

  // Get stats by author (published and draft)
  async getStatsByAuthor(authorId) {
    const queryFn = async () => {
      // Build base query - shows all data from all authors
      const buildQuery = (statusFilter = null) => {
        let query = supabase.from('agenda_kota').select('id', { count: 'planned', head: true })
        if (statusFilter) {
          query = query.eq('status', statusFilter)
        }
        return query
      }

      const [publishedResult, draftResult] = await Promise.all([
        buildQuery('published'),
        buildQuery('draft'),
      ])

      return {
        published: publishedResult.count || 0,
        draft: draftResult.count || 0,
      }
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get agenda stats by author:', error)
      return { published: 0, draft: 0 }
    }
  },
}

