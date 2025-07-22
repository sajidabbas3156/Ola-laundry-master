
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'auto' | 'fixed';
  minItemWidth?: string;
}

export function ResponsiveGrid({ 
  children, 
  className, 
  variant = 'auto',
  minItemWidth = '280px' 
}: ResponsiveGridProps) {
  const gridClasses = variant === 'auto' 
    ? `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`
    : `grid auto-fit-grid`;

  return (
    <div 
      className={cn(
        'grid gap-3 sm:gap-4 w-full',
        gridClasses,
        className
      )}
      style={variant === 'fixed' ? {
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
      } : undefined}
    >
      {children}
    </div>
  );
}
