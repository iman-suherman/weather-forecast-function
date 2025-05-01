interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class Cache {
  private cache: Map<string, CacheItem<any>>;
  private readonly duration: number;

  constructor(duration: number = 15 * 60 * 1000) { // 15 minutes default
    this.cache = new Map();
    this.duration = duration;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get<T>(key: string, includeExpired: boolean = false): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > this.duration;
    if (isExpired && !includeExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const weatherCache = new Cache(); 