
import React from 'react';
import { useOptimizedContext } from './OptimizedContext';

// Higher-order component for optimized rendering
export function withOptimizedRendering<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options: { cacheKey?: (props: T) => string; ttl?: number } = {}
) {
  return function OptimizedComponent(props: T) {
    const { cache, optimizeRenders } = useOptimizedContext();
    const cacheKey = options.cacheKey ? options.cacheKey(props) : JSON.stringify(props);
    
    if (optimizeRenders) {
      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }
    }
    
    const result = <Component {...props} />;
    
    if (optimizeRenders) {
      cache.set(cacheKey, result, options.ttl);
    }
    
    return result;
  };
}
