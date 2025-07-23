import { cn } from "@/lib/utils";

interface LaundrySpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'washing' | 'drying' | 'folding' | 'delivery' | 'bubbles' | 'clothes';
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const speedClasses = {
  slow: 'animate-spin-slow',
  normal: 'animate-spin',
  fast: 'animate-spin-fast'
};

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-blue-600',
  white: 'text-white'
};

export function LaundrySpinner({ 
  size = 'md', 
  variant = 'washing', 
  className = '',
  speed = 'normal',
  color = 'primary'
}: LaundrySpinnerProps) {
  const baseClasses = cn(
    sizeClasses[size],
    colorClasses[color],
    'inline-block',
    className
  );

  switch (variant) {
    case 'washing':
      return (
        <div className={cn(baseClasses, 'relative')}>
          <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', speedClasses[speed])}>
            {/* Washing machine drum */}
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              className="opacity-20"
            />
            <circle 
              cx="12" 
              cy="12" 
              r="6" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="none"
            />
            {/* Water/clothes swirling */}
            <path 
              d="M8 12c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z" 
              fill="currentColor" 
              className="opacity-30"
            />
            <circle cx="10" cy="10" r="1" fill="currentColor" className="opacity-60" />
            <circle cx="14" cy="14" r="1" fill="currentColor" className="opacity-60" />
          </svg>
        </div>
      );

    case 'drying':
      return (
        <div className={cn(baseClasses, 'relative')}>
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            {/* Dryer drum */}
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              className="opacity-20"
            />
            {/* Hot air waves */}
            <g className={cn('origin-center', speedClasses[speed])}>
              <path 
                d="M6 8c2 0 2 2 4 2s2-2 4-2 2 2 4 2" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                fill="none"
                className="opacity-70"
              />
              <path 
                d="M6 12c2 0 2 2 4 2s2-2 4-2 2 2 4 2" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                fill="none"
                className="opacity-50"
              />
              <path 
                d="M6 16c2 0 2 2 4 2s2-2 4-2 2 2 4 2" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                fill="none"
                className="opacity-30"
              />
            </g>
          </svg>
        </div>
      );

    case 'folding':
      return (
        <div className={cn(baseClasses, 'relative')}>
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            {/* Folding clothes animation */}
            <g className={cn('origin-center animate-pulse')}>
              <rect 
                x="4" 
                y="6" 
                width="16" 
                height="3" 
                rx="1" 
                fill="currentColor" 
                className="opacity-70"
              />
              <rect 
                x="6" 
                y="10" 
                width="12" 
                height="3" 
                rx="1" 
                fill="currentColor" 
                className="opacity-50"
              />
              <rect 
                x="8" 
                y="14" 
                width="8" 
                height="3" 
                rx="1" 
                fill="currentColor" 
                className="opacity-30"
              />
            </g>
            {/* Folding hands */}
            <g className={cn('origin-center animate-bounce')}>
              <circle cx="6" cy="12" r="2" fill="currentColor" className="opacity-40" />
              <circle cx="18" cy="12" r="2" fill="currentColor" className="opacity-40" />
            </g>
          </svg>
        </div>
      );

    case 'delivery':
      return (
        <div className={cn(baseClasses, 'relative')}>
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            {/* Delivery truck */}
            <g className={cn('animate-bounce')}>
              <rect 
                x="2" 
                y="12" 
                width="12" 
                height="6" 
                rx="1" 
                fill="currentColor" 
                className="opacity-70"
              />
              <rect 
                x="14" 
                y="14" 
                width="4" 
                height="4" 
                rx="1" 
                fill="currentColor" 
                className="opacity-50"
              />
              {/* Wheels */}
              <circle cx="6" cy="19" r="2" fill="currentColor" />
              <circle cx="16" cy="19" r="2" fill="currentColor" />
            </g>
            {/* Motion lines */}
            <g className={cn('animate-ping')}>
              <line x1="20" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2" />
              <line x1="20" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="2" />
              <line x1="20" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="2" />
            </g>
          </svg>
        </div>
      );

    case 'bubbles':
      return (
        <div className={cn(baseClasses, 'relative')}>
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            {/* Animated bubbles */}
            <g className="animate-pulse">
              <circle cx="6" cy="18" r="2" fill="currentColor" className="opacity-30">
                <animate attributeName="cy" values="18;6;18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="12" cy="20" r="1.5" fill="currentColor" className="opacity-40">
                <animate attributeName="cy" values="20;4;20" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="18" cy="19" r="1" fill="currentColor" className="opacity-50">
                <animate attributeName="cy" values="19;5;19" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="9" cy="22" r="1" fill="currentColor" className="opacity-60">
                <animate attributeName="cy" values="22;2;22" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="15" cy="21" r="0.5" fill="currentColor" className="opacity-70">
                <animate attributeName="cy" values="21;3;21" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>
      );

    case 'clothes':
      return (
        <div className={cn(baseClasses, 'relative')}>
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            {/* Clothes on hanger */}
            <g className={cn('origin-center animate-swing')}>
              {/* Hanger */}
              <path 
                d="M6 8h12M12 8V6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              {/* Shirt */}
              <path 
                d="M8 10v8h8v-8M8 10l-1-2h2l1 2M16 10l1-2h-2l-1 2" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                fill="currentColor"
                className="opacity-60"
              />
              {/* Sleeves */}
              <path 
                d="M7 10l-2 2v4l2-1M17 10l2 2v4l-2-1" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                fill="currentColor"
                className="opacity-40"
              />
            </g>
          </svg>
        </div>
      );

    default:
      return (
        <div className={cn(baseClasses, speedClasses[speed])}>
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeDasharray="31.416" 
              strokeDashoffset="31.416"
              fill="none"
              className="opacity-25"
            />
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeDasharray="31.416" 
              strokeDashoffset="23.562"
              fill="none"
            />
          </svg>
        </div>
      );
  }
}

// Preset spinner components for common use cases
export function WashingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  return <LaundrySpinner variant="washing" size={size} className={className} />;
}

export function DryingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  return <LaundrySpinner variant="drying" size={size} className={className} />;
}

export function DeliverySpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  return <LaundrySpinner variant="delivery" size={size} className={className} />;
}

export function BubblesSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  return <LaundrySpinner variant="bubbles" size={size} className={className} />;
}

// Loading states component
interface LoadingStateProps {
  message?: string;
  variant?: 'washing' | 'drying' | 'folding' | 'delivery' | 'bubbles' | 'clothes';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadingState({ 
  message = "Loading...", 
  variant = 'washing', 
  size = 'lg',
  className = ''
}: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 space-y-4', className)}>
      <LaundrySpinner variant={variant} size={size} />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}