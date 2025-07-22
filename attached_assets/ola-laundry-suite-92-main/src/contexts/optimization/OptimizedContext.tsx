
import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { useTenant } from "../TenantContext";
import { OptimizedContextType } from './types';
import { ContextCache } from './ContextCache';
import { usePerformanceMetrics } from './hooks/usePerformanceMetrics';
import { useBatchUpdates } from './hooks/useBatchUpdates';

const OptimizedContext = createContext<OptimizedContextType | undefined>(undefined);

export function OptimizedContextProvider({ children }: { children: ReactNode }) {
  const { currentTenant } = useTenant();
  const [optimizeRenders, setOptimizeRenders] = useState(true);
  
  const cache = useMemo(() => new ContextCache(), []);
  const { metrics, getMemoryUsage, forceGarbageCollection } = usePerformanceMetrics();
  const { batchUpdates } = useBatchUpdates();

  // Clear cache when tenant changes
  useEffect(() => {
    if (currentTenant?.id) {
      cache.clear();
    }
  }, [currentTenant?.id, cache]);

  // Clear cache
  const clearCache = () => {
    cache.clear();
  };

  const contextValue = useMemo(() => ({
    metrics,
    cache,
    clearCache,
    batchUpdates,
    forceGarbageCollection,
    getMemoryUsage,
    optimizeRenders,
    setOptimizeRenders
  }), [
    metrics,
    cache,
    batchUpdates,
    forceGarbageCollection,
    getMemoryUsage,
    optimizeRenders,
    setOptimizeRenders
  ]);

  return (
    <OptimizedContext.Provider value={contextValue}>
      {children}
    </OptimizedContext.Provider>
  );
}

export function useOptimizedContext() {
  const context = useContext(OptimizedContext);
  if (context === undefined) {
    throw new Error("useOptimizedContext must be used within an OptimizedContextProvider");
  }
  return context;
}
