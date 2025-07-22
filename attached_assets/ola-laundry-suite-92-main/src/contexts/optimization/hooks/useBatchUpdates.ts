
import { useCallback, useRef, useEffect } from 'react';

export function useBatchUpdates() {
  const batchQueue = useRef<(() => void)[]>([]);
  const batchTimeout = useRef<NodeJS.Timeout>();

  // Batch updates for performance
  const batchUpdates = useCallback((updates: (() => void)[]): void => {
    batchQueue.current.push(...updates);
    
    if (batchTimeout.current) {
      clearTimeout(batchTimeout.current);
    }
    
    batchTimeout.current = setTimeout(() => {
      const currentQueue = [...batchQueue.current];
      batchQueue.current = [];
      
      // Execute all updates in a single batch
      currentQueue.forEach(update => {
        try {
          update();
        } catch (error) {
          console.error('Batch update error:', error);
        }
      });
    }, 16); // ~60fps batching
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (batchTimeout.current) {
        clearTimeout(batchTimeout.current);
      }
    };
  }, []);

  return { batchUpdates };
}
