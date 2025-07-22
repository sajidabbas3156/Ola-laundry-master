
import React from "react";
import { Loader, AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <Loader className={cn("animate-spin", sizeClasses[size], className)} />
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}

interface FormLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  overlay?: boolean;
}

export function FormLoading({ isLoading, children, overlay = true }: FormLoadingProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && overlay && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export function LoadingButton({ 
  loading = false, 
  loadingText = "Loading...", 
  children, 
  disabled,
  className,
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading && <LoadingSpinner size="sm" />}
      {loading ? loadingText : children}
    </button>
  );
}

interface ErrorStateProps {
  message: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({ message, retry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}>
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
      {retry && (
        <button 
          onClick={retry}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

interface SuccessStateProps {
  message: string;
  action?: () => void;
  actionLabel?: string;
}

export function SuccessState({ message, action, actionLabel = "Continue" }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <CheckCircle className="h-12 w-12 text-green-500" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
      {action && (
        <button 
          onClick={action}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  action, 
  actionLabel = "Get Started",
  icon 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      {icon && <div className="text-gray-400">{icon}</div>}
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm max-w-md">{description}</p>
      </div>
      {action && (
        <button 
          onClick={action}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Enhanced Loading State Component
interface EnhancedLoadingStateProps {
  isLoading: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  onRetry?: () => void;
  emptyComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  children: React.ReactNode;
}

export function EnhancedLoadingState({
  isLoading,
  error,
  isEmpty = false,
  onRetry,
  emptyComponent,
  loadingComponent,
  children
}: EnhancedLoadingStateProps) {
  if (isLoading) {
    return loadingComponent || <PageLoading />;
  }

  if (error) {
    return <ErrorState message={error.message} retry={onRetry} />;
  }

  if (isEmpty) {
    return emptyComponent || (
      <EmptyState 
        title="No data available" 
        description="There's nothing to show here yet." 
      />
    );
  }

  return <>{children}</>;
}

// Network Status Indicator
export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm">You're offline. Some features may not work.</span>
      </div>
    </div>
  );
}
