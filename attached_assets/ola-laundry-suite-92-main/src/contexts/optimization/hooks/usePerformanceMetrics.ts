import { useState, useEffect, useRef, useCallback } from 'react';
import { PerformanceMetrics } from '../types';

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    memoryUsage: 0
  });
  
  const renderTimes = useRef<number[]>([]);

  // Memory usage calculation
  const getMemoryUsage = useCallback((): number => {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in window.performance) {
      const memory = (window.performance as any).memory;
      return memory.usedJSHeapSize || 0;
    }
    return 0;
  }, []);

  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      renderTimes.current.push(renderTime);
      
      // Keep only last 100 render times
      if (renderTimes.current.length > 100) {
        renderTimes.current = renderTimes.current.slice(-100);
      }
      
      const averageRenderTime = renderTimes.current.reduce((sum, time) => sum + time, 0) / renderTimes.current.length;
      
      setMetrics(prev => ({
        renderCount: prev.renderCount + 1,
        lastRenderTime: renderTime,
        averageRenderTime,
        memoryUsage: getMemoryUsage()
      }));
    };
  }, [getMemoryUsage]);

  // Force garbage collection (if available)
  const forceGarbageCollection = useCallback(() => {
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
    }
    
    // Reset render times
    renderTimes.current = [];
  }, []);

  return {
    metrics,
    getMemoryUsage,
    forceGarbageCollection
  };
}
