interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Configuración centralizada
const CONFIG = {
  DEFAULT_TTL: 300000, // 5 minutos
} as const;

export class CacheService {
  private static cache = new Map<string, CacheEntry<any>>();

  // Almacenar datos con TTL
  static set<T>(key: string, data: T, ttl: number = CONFIG.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Recuperar datos si no han expirado
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

  // Verificar si clave existe y no ha expirado
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

  // Eliminar entrada específica
  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Limpiar toda la caché
  static clear(): void {
    this.cache.clear();
  }

  // Obtener tamaño de caché
  static size(): number {
    return this.cache.size;
  }

  // Obtener estadísticas
  static getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
