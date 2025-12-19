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

export const perangkatDaerahService = {
  async getCount() {
    const queryFn = async () => {
      const { count, error } = await supabase
        .from('perangkat_daerah')
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.error('Error in getCount:', error)
        throw error
      }
      return count || 0
    }

    try {
      return await withTimeout(queryFn(), 5000)
    } catch (error) {
      console.warn('Failed to get perangkat daerah count:', error)
      return 0
    }
  },

  async getActiveCount() {
    const queryFn = async () => {
      const { count, error } = await supabase
        .from('perangkat_daerah')
        .select('*', { count: 'exact', head: true })
        .eq('aktif', true)
      
      if (error) {
        console.error('Error in getActiveCount:', error)
        throw error
      }
      return count || 0
    }

    try {
      return await withTimeout(queryFn(), 5000)
    } catch (error) {
      console.warn('Failed to get active perangkat daerah count:', error)
      return 0
    }
  },

  async getAll({ page = 1, limit = 10, search = '', aktifOnly = false }) {
    const queryFn = async () => {
      let query = supabase
        .from('perangkat_daerah')
        .select('*', { count: 'planned' })
        .order('urutan', { ascending: true })
        .order('nama_perangkat', { ascending: true })

      if (aktifOnly) {
        query = query.eq('aktif', true)
      }

      if (search) {
        query = query.or(`nama_perangkat.ilike.%${search}%,jabatan_kepala.ilike.%${search}%`)
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
        .from('perangkat_daerah')
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
        .from('perangkat_daerah')
        .select('*')
        .eq('slug', slug)
        .eq('aktif', true)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async create(perangkatData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('perangkat_daerah')
        .insert(perangkatData)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async update(id, perangkatData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('perangkat_daerah')
        .update(perangkatData)
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
        .from('perangkat_daerah')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async toggleAktif(id, currentAktif) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('perangkat_daerah')
        .update({ aktif: !currentAktif })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },
}

