// CacheService.js - Caching layer for performance

import NodeCache from 'node-cache'

class CacheService {
  constructor(ttlSeconds = 3600) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds })
  }

  get(key) {
    return this.cache.get(key)
  }

  set(key, value) {
    return this.cache.set(key, value)
  }

  del(key) {
    return this.cache.del(key)
  }

  flush() {
    return this.cache.flushAll()
  }
}

export default CacheService
