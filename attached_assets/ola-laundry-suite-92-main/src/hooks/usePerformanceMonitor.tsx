
import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  renderTime: number;
  memoryUsage: number;
  apiResponseTimes: Record<string, number>;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    apiResponseTimes: {}
  });

  const trackApiCall = useCallback((endpoint: string, startTime: number) => {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    setMetrics(prev => ({
      ...prev,
      apiResponseTimes: {
        ...prev.apiResponseTimes,
        [endpoint]: responseTime
      }
    }));
  }, []);

  const measureRenderTime = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`${componentName} render time: ${endTime - startTime}ms`);
    };
  }, []);

  useEffect(() => {
    // Measure page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    
    // Measure memory usage if available
    const memUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    setMetrics(prev => ({
      ...prev,
      pageLoadTime: loadTime,
      memoryUsage: memUsage
    }));
  }, []);

  return { metrics, trackApiCall, measureRenderTime };
}
