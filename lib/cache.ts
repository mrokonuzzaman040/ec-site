import NodeCache from 'node-cache'
import { CacheEntry, CacheConfig } from './types'

// Cache configuration
const CACHE_CONFIG: CacheConfig = {
  ttl_seconds: parseInt(process.env.CACHE_TTL_SECONDS || '3600'), // 1 hour default
  max_keys: 1000,
  check_period: 600, // Check for expired keys every 10 minutes
}

// Create cache instance
const cache = new NodeCache({
  stdTTL: CACHE_CONFIG.ttl_seconds,
  maxKeys: CACHE_CONFIG.max_keys,
  checkperiod: CACHE_CONFIG.check_period,
  useClones: false, // Better performance, but be careful with object mutations
})

export class CacheService {
  private static instance: CacheService
  private cache: NodeCache

  private constructor() {
    this.cache = cache
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | undefined {
    try {
      const value = this.cache.get<T>(key)
      if (value !== undefined) {
        console.log(`Cache HIT for key: ${key}`)
        return value
      }
      console.log(`Cache MISS for key: ${key}`)
      return undefined
    } catch (error) {
      console.error(`Cache GET error for key ${key}:`, error)
      return undefined
    }
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    try {
      const success = this.cache.set(key, value, ttl || CACHE_CONFIG.ttl_seconds)
      if (success) {
        console.log(`Cache SET for key: ${key}`)
      }
      return success
    } catch (error) {
      console.error(`Cache SET error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Delete value from cache
   */
  del(key: string): number {
    try {
      const deleted = this.cache.del(key)
      if (deleted > 0) {
        console.log(`Cache DELETE for key: ${key}`)
      }
      return deleted
    } catch (error) {
      console.error(`Cache DELETE error for key ${key}:`, error)
      return 0
    }
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    try {
      return this.cache.has(key)
    } catch (error) {
      console.error(`Cache HAS error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats()
  }

  /**
   * Clear all cache
   */
  flush(): void {
    try {
      this.cache.flushAll()
      console.log('Cache flushed')
    } catch (error) {
      console.error('Cache FLUSH error:', error)
    }
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    try {
      return this.cache.keys()
    } catch (error) {
      console.error('Cache KEYS error:', error)
      return []
    }
  }

  /**
   * Get cache entry with metadata
   */
  getCacheEntry(key: string): CacheEntry | null {
    try {
      const value = this.cache.get(key)
      if (value === undefined) {
        return null
      }

      const ttl = this.cache.getTtl(key)
      return {
        key,
        value,
        ttl: ttl || 0,
        created_at: new Date().toISOString(),
        accessed_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error(`Cache GET_ENTRY error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Get or set pattern - useful for caching API responses
   */
  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(key)
    if (cached !== undefined) {
      return cached
    }

    // If not in cache, fetch and cache the result
    try {
      const result = await fetchFunction()
      this.set(key, result, ttl)
      return result
    } catch (error) {
      console.error(`Cache GET_OR_SET error for key ${key}:`, error)
      throw error
    }
  }

  /**
   * Generate cache key for API responses
   */
  static generateApiKey(endpoint: string, params?: Record<string, any>): string {
    const baseKey = `api:${endpoint}`
    if (!params || Object.keys(params).length === 0) {
      return baseKey
    }

    // Sort params for consistent key generation
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')

    return `${baseKey}:${sortedParams}`
  }

  /**
   * Generate cache key for scraped data
   */
  static generateDataKey(dataType: string, filters?: Record<string, any>): string {
    const baseKey = `data:${dataType}`
    if (!filters || Object.keys(filters).length === 0) {
      return baseKey
    }

    const sortedFilters = Object.keys(filters)
      .sort()
      .map(key => `${key}=${filters[key]}`)
      .join('&')

    return `${baseKey}:${sortedFilters}`
  }

  /**
   * Invalidate cache by pattern
   */
  invalidatePattern(pattern: string): number {
    try {
      const keys = this.keys()
      const matchingKeys = keys.filter(key => key.includes(pattern))
      
      let deleted = 0
      matchingKeys.forEach(key => {
        deleted += this.del(key)
      })

      console.log(`Cache invalidated ${deleted} keys matching pattern: ${pattern}`)
      return deleted
    } catch (error) {
      console.error(`Cache INVALIDATE_PATTERN error for pattern ${pattern}:`, error)
      return 0
    }
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance()

// Cache key constants
export const CACHE_KEYS = {
  NEWS: 'data:news',
  NOTICES: 'data:notices',
  OFFICERS: 'data:officers',
  ELECTIONS: 'data:elections',
  SCRAPING_LOGS: 'data:scraping_logs',
  SCRAPING_STATUS: 'status:scraping',
  DASHBOARD_STATS: 'stats:dashboard',
} as const

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 1800,  // 30 minutes
  LONG: 3600,    // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const