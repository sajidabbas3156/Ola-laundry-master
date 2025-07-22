
import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileAppShellProps {
  children: ReactNode;
  hasBottomNav?: boolean;
  className?: string;
}

export function MobileAppShell({ children, hasBottomNav = false, className }: MobileAppShellProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className={cn(
      "min-h-screen bg-gray-50",
      hasBottomNav && "pb-16",
      className
    )}>
      {/* Mobile Status Bar Spacer */}
      <div className="h-safe-top bg-blue-600" />
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
      
      {/* Bottom Safe Area */}
      <div className="h-safe-bottom" />
    </div>
  );
}
