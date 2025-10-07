interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const DEFAULT_TTL = 300000; // 5 minutos

export class CacheService {
  private static cache = new Map<string, CacheEntry<any>>();

  static set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  static has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static size(): number {
    return this.cache.size;
  }

  static getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}
