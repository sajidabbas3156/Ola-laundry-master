
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  memoryUsage: number;
}

export interface OptimizedContextType {
  // Performance metrics
  metrics: PerformanceMetrics;
  
  // Cache management
  cache: any; // Will be typed properly in ContextCache
  clearCache: () => void;
  
  // Batch operations
  batchUpdates: (updates: (() => void)[]) => void;
  
  // Memory management
  forceGarbageCollection: () => void;
  getMemoryUsage: () => number;
  
  // Context optimization
  optimizeRenders: boolean;
  setOptimizeRenders: (optimize: boolean) => void;
}
