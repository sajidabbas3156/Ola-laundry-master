import { useState, useEffect } from 'react';
import { LaundrySpinner, LoadingState } from '@/components/ui/laundry-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LaundryLoadingScreenProps {
  message?: string;
  duration?: number;
  onComplete?: () => void;
  showProgress?: boolean;
  variant?: 'washing' | 'drying' | 'folding' | 'delivery' | 'bubbles' | 'clothes';
}

const loadingMessages = {
  washing: [
    "Starting wash cycle...",
    "Adding detergent...",
    "Washing your items...",
    "Rinsing thoroughly...",
    "Almost done!"
  ],
  drying: [
    "Preparing dryer...",
    "Adding fabric softener...",
    "Drying your clothes...",
    "Fluffing items...",
    "Finishing up!"
  ],
  folding: [
    "Collecting clean items...",
    "Sorting by type...",
    "Folding carefully...",
    "Organizing items...",
    "All done!"
  ],
  delivery: [
    "Preparing for pickup...",
    "Loading delivery truck...",
    "Planning optimal route...",
    "On the way...",
    "Delivery complete!"
  ],
  bubbles: [
    "Creating soap solution...",
    "Generating bubbles...",
    "Deep cleaning...",
    "Removing stains...",
    "Sparkling clean!"
  ],
  clothes: [
    "Inspecting garments...",
    "Sorting by fabric type...",
    "Processing items...",
    "Quality checking...",
    "Ready for pickup!"
  ]
};

export default function LaundryLoadingScreen({
  message,
  duration = 3000,
  onComplete,
  showProgress = true,
  variant = 'washing'
}: LaundryLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const messages = message ? [message] : loadingMessages[variant];
  const currentMessage = messages[currentMessageIndex];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 500);
          return 100;
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        const nextIndex = prev + 1;
        return nextIndex >= messages.length ? 0 : nextIndex;
      });
    }, duration / messages.length);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [duration, messages.length, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 border-2 border-primary/20 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">OLA</span>
              </div>
            </div>

            {/* Main Spinner */}
            <div className="flex justify-center">
              <LaundrySpinner 
                variant={variant} 
                size="xl" 
                color="accent"
                speed="normal"
              />
            </div>

            {/* Loading Message */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {currentMessage}
              </h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we process your request
              </p>
            </div>

            {/* Progress Bar */}
            {showProgress && (
              <div className="space-y-2">
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>
            )}

            {/* Decorative Elements */}
            <div className="flex justify-center space-x-4 opacity-30">
              <LaundrySpinner variant="bubbles" size="sm" speed="slow" />
              <LaundrySpinner variant="clothes" size="sm" speed="slow" />
              <LaundrySpinner variant="bubbles" size="sm" speed="slow" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Full page loading overlay
export function LaundryPageLoader({ 
  variant = 'washing',
  message = "Loading your laundry management system..." 
}: {
  variant?: 'washing' | 'drying' | 'folding' | 'delivery' | 'bubbles' | 'clothes';
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        {/* Brand Header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">OLA</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">LAUNDRY MASTER</h1>
          <p className="text-gray-600">Premium Laundry Management System</p>
        </div>

        {/* Main Loading Area */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 max-w-md">
          <LoadingState 
            message={message} 
            variant={variant} 
            size="xl"
            className="p-0"
          />
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="bg-white/50 rounded-lg p-4 text-center">
            <LaundrySpinner variant="washing" size="md" className="mb-2" />
            <p className="text-sm text-gray-600">Washing</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4 text-center">
            <LaundrySpinner variant="drying" size="md" className="mb-2" />
            <p className="text-sm text-gray-600">Drying</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4 text-center">
            <LaundrySpinner variant="folding" size="md" className="mb-2" />
            <p className="text-sm text-gray-600">Folding</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4 text-center">
            <LaundrySpinner variant="delivery" size="md" className="mb-2" />
            <p className="text-sm text-gray-600">Delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline loading component for smaller spaces
export function InlineLoader({ 
  variant = 'washing', 
  size = 'sm',
  text = "Loading...",
  className = ''
}: {
  variant?: 'washing' | 'drying' | 'folding' | 'delivery' | 'bubbles' | 'clothes';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LaundrySpinner variant={variant} size={size} />
      <span className="text-sm text-muted-foreground animate-pulse">{text}</span>
    </div>
  );
}