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

export const sosialMediaService = {
  async getAll() {
    const cacheKey = 'sosial_media:all'
    
    const cached = cacheService.get(cacheKey)
    if (cached) {
      return cached
    }

    const queryFn = async () => {
      const { data, error } = await supabase
        .from('sosial_media')
        .select('*')
        .order('urutan', { ascending: true })
      
      if (error) throw error
      const result = data || []
      
      cacheService.set(cacheKey, result, 300)
      
      return result
    }

    const result = await withRetry(() => withTimeout(queryFn(), 10000))
    return result
  },

  async getById(id) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('sosial_media')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async getByPlatform(platform) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('sosial_media')
        .select('*')
        .eq('platform', platform)
        .single()
      
      if (error) throw error
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },

  async update(id, sosialMediaData) {
    const queryFn = async () => {
      const { data, error } = await supabase
        .from('sosial_media')
        .update(sosialMediaData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      cacheService.delete('sosial_media:all')
      
      return data
    }

    return withRetry(() => withTimeout(queryFn(), 10000))
  },
}

