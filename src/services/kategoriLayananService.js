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

export const kategoriLayananService = {
  // Get all kategori layanan (untuk filter dropdown)
  async getAll() {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('kategori_layanan')
        .select('id, nama, slug, urutan')
        .order('urutan', { ascending: true, nullsFirst: false })
        .order('nama', { ascending: true })
      
      if (error) throw error
      return data || []
    }

    try {
      return await withTimeout(queryFn(), 5000)
    } catch (error) {
      console.warn('Failed to get kategori layanan:', error)
      return []
    }
  },

  // Get kategori by ID
  async getById(id) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('kategori_layanan')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },
}

