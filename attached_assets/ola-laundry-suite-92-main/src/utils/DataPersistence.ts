
interface PersistenceOptions {
  fallbackValue?: any;
  useCache?: boolean;
  cacheTimeout?: number;
}

export class DataPersistence {
  private static cache = new Map<string, { data: any; timestamp: number; expiry: number }>();

  static getItem<T>(key: string, options: PersistenceOptions = {}): T | null {
    try {
      // Check cache first if enabled
      if (options.useCache) {
        const cached = this.cache.get(key);
        if (cached && Date.now() < cached.expiry) {
          return cached.data;
        }
      }

      // Try localStorage
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Update cache if enabled
        if (options.useCache && options.cacheTimeout) {
          this.cache.set(key, {
            data: parsed,
            timestamp: Date.now(),
            expiry: Date.now() + options.cacheTimeout
          });
        }
        
        return parsed;
      }

      return options.fallbackValue || null;
    } catch (error) {
      console.error('Failed to get item from storage:', error);
      return options.fallbackValue || null;
    }
  }

  static setItem<T>(key: string, data: T, options: PersistenceOptions = {}): boolean {
    try {
      // Save to localStorage
      localStorage.setItem(key, JSON.stringify(data));
      
      // Update cache if enabled
      if (options.useCache && options.cacheTimeout) {
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          expiry: Date.now() + options.cacheTimeout
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save item to storage:', error);
      return false;
    }
  }

  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      this.cache.delete(key);
      return true;
    } catch (error) {
      console.error('Failed to remove item from storage:', error);
      return false;
    }
  }

  static clear(): boolean {
    try {
      localStorage.clear();
      this.cache.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }
}
