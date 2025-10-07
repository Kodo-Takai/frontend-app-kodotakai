interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// TTL por defecto: 5 minutos
const DEFAULT_TTL = 300000;

export class CacheService {
  private static cache = new Map<string, CacheEntry<any>>();

  /**
   * Almacena datos en caché con TTL personalizable
   */
  static set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Recupera datos de caché si no han expirado
   */
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

  /**
   * Verifica si una clave existe y no ha expirado
   */
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

  /**
   * Elimina una entrada específica de la caché
   */
  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Limpia toda la caché
   */
  static clear(): void {
    this.cache.clear();
  }

  /**
   * Retorna el número de entradas en caché
   */
  static size(): number {
    return this.cache.size;
  }

  /**
   * Obtiene estadísticas de la caché
   */
  static getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}
