import { supabase } from './supabase'
import { cacheService } from './cacheService'

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

export const pengaturanSitusService = {
  async getAll() {
    const cacheKey = 'pengaturan_situs:all'
    
    const cached = cacheService.get(cacheKey)
    if (cached) {
      return cached
    }

    const queryFn = async () => {
      const { data, error } = await supabase
        .from('pengaturan_situs')
        .select('*')
        .order('grup', { ascending: true })
        .order('urutan', { ascending: true })
      
      if (error) throw error
      const result = data || []
      
      cacheService.set(cacheKey, result, 300)
      
      return result
    }

    const result = await withRetry(() => withTimeout(queryFn(), 10000))
    return result
  },

  async getByGrup(grup) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('pengaturan_situs')
        .select('*')
        .eq('grup', grup)
        .order('urutan', { ascending: true })
      
      if (error) throw error
      return data || []
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async getByKunci(kunci) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('pengaturan_situs')
        .select('*')
        .eq('kunci', kunci)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async getById(id) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('pengaturan_situs')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async update(id, pengaturanData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('pengaturan_situs')
        .update(pengaturanData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      // Invalidate all related caches
      cacheService.delete('pengaturan_situs:all')
      cacheService.delete('pengaturan_situs:footer')
      cacheService.delete('pengaturan_situs:hero')
      
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  // Helper function untuk mendapatkan data grup footer
  async getFooterData() {
    const cacheKey = 'pengaturan_situs:footer'
    
    const cached = cacheService.get(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const data = await this.getByGrup('footer')
      
      // Convert array ke object dengan key-value mapping
      const result = {
        nama_situs: data.find(item => item.kunci === 'nama_situs')?.nilai || '',
        deskripsi_situs: data.find(item => item.kunci === 'deskripsi_situs')?.nilai || '',
        alamat: data.find(item => item.kunci === 'alamat')?.nilai || '',
        email: data.find(item => item.kunci === 'email')?.nilai || '',
        telepon: data.find(item => item.kunci === 'telepon')?.nilai || '',
      }
      
      cacheService.set(cacheKey, result, 300)
      return result
    } catch (error) {
      console.error('Error getting footer data:', error)
      // Return empty object jika error
      return {
        nama_situs: '',
        deskripsi_situs: '',
        alamat: '',
        email: '',
        telepon: '',
      }
    }
  },

  // Helper function untuk mendapatkan data grup hero
  async getHeroData() {
    const cacheKey = 'pengaturan_situs:hero'
    
    const cached = cacheService.get(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const data = await this.getByGrup('hero')
      
      // Convert array ke object dengan key-value mapping
      const result = {
        nama_situs: data.find(item => item.kunci === 'nama_situs')?.nilai || '',
        deskripsi_situs: data.find(item => item.kunci === 'deskripsi_situs')?.nilai || '',
      }
      
      cacheService.set(cacheKey, result, 300)
      return result
    } catch (error) {
      console.error('Error getting hero data:', error)
      // Return empty object jika error
      return {
        nama_situs: '',
        deskripsi_situs: '',
      }
    }
  },
}

