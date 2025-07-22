
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ButtonCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

export function ButtonCard({
  title,
  description,
  icon,
  onClick,
  className,
  variant = 'default',
  disabled = false,
  loading = false
}: ButtonCardProps) {
  return (
    <Card className={cn(
      'cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )}>
      <CardContent className="p-0">
        <Button
          variant={variant}
          onClick={onClick}
          disabled={disabled || loading}
          className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 min-h-[80px] border-0"
        >
          {icon && (
            <div className="text-2xl">
              {icon}
            </div>
          )}
          <div className="text-center">
            <div className="font-medium text-sm">{title}</div>
            {description && (
              <div className="text-xs text-muted-foreground mt-1">
                {description}
              </div>
            )}
          </div>
          {loading && (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
