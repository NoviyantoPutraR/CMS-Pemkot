/**
 * Simple in-memory cache service dengan TTL (Time To Live)
 */
class CacheService {
  constructor() {
    this.cache = new Map()
  }

  /**
   * Set cache dengan TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttlSeconds - Time to live in seconds (default: 60)
   */
  set(key, value, ttlSeconds = 60) {
    const expiresAt = Date.now() + ttlSeconds * 1000
    this.cache.set(key, {
      value,
      expiresAt,
    })
  }

  /**
   * Get cache value
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if expired/not found
   */
  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  /**
   * Check if key exists and is valid
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return false
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * Delete cache entry
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear()
  }

  /**
   * Clear expired entries
   */
  clearExpired() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache size
   * @returns {number}
   */
  size() {
    return this.cache.size
  }
}

// Export singleton instance
export const cacheService = new CacheService()

// Clean expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheService.clearExpired()
  }, 5 * 60 * 1000) // 5 minutes
}

