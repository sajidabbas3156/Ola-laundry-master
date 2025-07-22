
import { ReactNode, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  threshold?: number;
}

export function PullToRefresh({ 
  children, 
  onRefresh, 
  disabled = false, 
  threshold = 80 
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled || window.scrollY > 0) return;
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (disabled || !startY || window.scrollY > 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    
    if (distance > 10) {
      setIsPulling(true);
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || !isPulling) return;
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
    setStartY(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, startY, pullDistance, threshold]);

  const refreshOpacity = Math.min(pullDistance / threshold, 1);
  const refreshScale = Math.min(0.8 + (pullDistance / threshold) * 0.2, 1);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Pull indicator */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 bg-blue-50 z-10",
          isPulling || isRefreshing ? 'translate-y-0' : '-translate-y-full'
        )}
        style={{ 
          height: `${Math.max(pullDistance, isRefreshing ? 60 : 0)}px`,
        }}
      >
        <div 
          className="flex items-center gap-2 text-blue-600"
          style={{ 
            opacity: refreshOpacity,
            transform: `scale(${refreshScale})`
          }}
        >
          <RefreshCw 
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isRefreshing ? 'animate-spin' : '',
              pullDistance >= threshold ? 'rotate-180' : ''
            )} 
          />
          <span className="text-sm font-medium">
            {isRefreshing 
              ? 'Refreshing...' 
              : pullDistance >= threshold 
                ? 'Release to refresh' 
                : 'Pull to refresh'
            }
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div 
        className="transition-transform duration-200"
        style={{ 
          transform: `translateY(${isPulling ? pullDistance : isRefreshing ? 60 : 0}px)` 
        }}
      >
        {children}
      </div>
    </div>
  );
}
