
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LayoutCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'full';
  orientation?: 'vertical' | 'horizontal';
}

export function LayoutCard({ 
  title, 
  children, 
  className, 
  variant = 'default',
  orientation = 'vertical' 
}: LayoutCardProps) {
  const cardClasses = cn(
    'w-full transition-all duration-200',
    {
      'h-full': variant === 'full',
      'p-2': variant === 'compact',
      'flex-row': orientation === 'horizontal',
      'flex-col': orientation === 'vertical'
    },
    className
  );

  if (variant === 'compact') {
    return (
      <Card className={cardClasses}>
        <CardContent className="p-3">
          {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
          {children}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cardClasses}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(orientation === 'horizontal' && 'flex items-center gap-4')}>
        {children}
      </CardContent>
    </Card>
  );
}
