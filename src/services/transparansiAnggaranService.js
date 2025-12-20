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

export const transparansiAnggaranService = {
  async getCount() {
    const queryFn = async () => {
      const { count, error } = await supabase
        .from('transparansi_anggaran')
        .select('id', { count: 'exact', head: true })
      
      if (error) throw error
      return count || 0
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get transparansi count:', error)
      return 0
    }
  },

  async getAll({ publishedOnly = false } = {}) {
    const queryFn = async () => {
      let query = supabase
        .from('transparansi_anggaran')
        .select('*')
        .order('tahun', { ascending: false })

      if (publishedOnly) {
        query = query.eq('status', 'published')
      }

      const { data, error } = await query
      if (error) throw error

      return data || []
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async getByTahun(tahun) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('transparansi_anggaran')
        .select('*')
        .eq('tahun', tahun)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async getById(id) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('transparansi_anggaran')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async create(anggaranData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('transparansi_anggaran')
        .insert(anggaranData)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async update(id, anggaranData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('transparansi_anggaran')
        .update(anggaranData)
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
        .from('transparansi_anggaran')
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
        .from('transparansi_anggaran')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Get active year anggaran (tahun terbaru yang published)
  async getActiveYear() {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('transparansi_anggaran')
        .select('tahun, status')
        .eq('status', 'published')
        .order('tahun', { ascending: false })
        .limit(1)
        .single()
      
      if (error) {
        // Jika tidak ada data, return null
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }
      
      return data
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get active year:', error)
      return null
    }
  },

  // Get recent activity (updated_at terbaru)
  async getRecentActivity(limit = 5) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('transparansi_anggaran')
        .select('id, tahun, status, diperbarui_pada')
        .order('diperbarui_pada', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return (data || []).map(item => ({ 
        ...item, 
        jenis: 'transparansi',
        judul: `Anggaran ${item.tahun}`
      }))
    }

    try {
      return await withTimeout(queryFn(), 3000)
    } catch (error) {
      console.warn('Failed to get recent activity:', error)
      return []
    }
  },
}

