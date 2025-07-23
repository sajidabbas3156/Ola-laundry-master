import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Smartphone, 
  X, 
  Apple, 
  Chrome, 
  Share,
  Plus,
  Home
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallButtonProps {
  variant?: 'button' | 'banner' | 'floating';
  size?: 'sm' | 'lg' | 'default';
  className?: string;
  showInstructions?: boolean;
}

export default function PWAInstallButton({ 
  variant = 'button',
  size = 'default',
  className = '',
  showInstructions = true
}: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    isStandalone: false
  });

  useEffect(() => {
    // Detect device and browser
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window as any).navigator.standalone === true;

    setDeviceInfo({ isIOS, isAndroid, isSafari, isChrome, isStandalone });
    setIsInstalled(isStandalone);

    // Don't show anything if already installed
    if (isStandalone) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      
      // Show banner after user has spent some time on the app
      setTimeout(() => {
        if (variant === 'banner' && !sessionStorage.getItem('pwa-install-dismissed')) {
          setShowBanner(true);
        }
      }, 15000); // Show after 15 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowBanner(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [variant]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowBanner(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't render if already installed
  if (isInstalled) {
    return null;
  }

  // iOS Safari Instructions Component
  const IOSInstructions = () => (
    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-2 text-blue-600 font-medium">
        <Apple className="h-4 w-4" />
        Install on iPhone/iPad
      </div>
      <div className="space-y-2 text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">1</div>
          <span>Tap the <Share className="h-3 w-3 inline mx-1" /> Share button below</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">2</div>
          <span>Select <Home className="h-3 w-3 inline mx-1" /> "Add to Home Screen"</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">3</div>
          <span>Tap "Add" to install</span>
        </div>
      </div>
    </div>
  );

  // Android Chrome Instructions Component
  const AndroidInstructions = () => (
    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-2 text-green-600 font-medium">
        <Chrome className="h-4 w-4" />
        Install on Android
      </div>
      <div className="space-y-2 text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold">1</div>
          <span>Tap the menu (⋮) in your browser</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold">2</div>
          <span>Select <Plus className="h-3 w-3 inline mx-1" /> "Add to Home screen"</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold">3</div>
          <span>Tap "Add" to install</span>
        </div>
      </div>
    </div>
  );

  // Button variant
  if (variant === 'button') {
    if (isInstallable && deferredPrompt) {
      return (
        <Button
          onClick={handleInstallClick}
          size={size}
          className={`${className}`}
          variant="default"
        >
          <Download className="h-4 w-4 mr-2" />
          Install App
        </Button>
      );
    }

    // Show manual instructions for iOS or unsupported browsers
    if ((deviceInfo.isIOS && deviceInfo.isSafari) || 
        (deviceInfo.isAndroid && !isInstallable)) {
      return (
        <div className="space-y-2">
          <Button
            size={size}
            className={`${className}`}
            variant="outline"
            disabled
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Install Available
          </Button>
          {showInstructions && (
            <Card className="p-3">
              <CardContent className="p-0">
                {deviceInfo.isIOS ? <IOSInstructions /> : <AndroidInstructions />}
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    return null;
  }

  // Banner variant
  if (variant === 'banner' && showBanner) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="flex items-center justify-between p-3 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5" />
            <div>
              <div className="font-medium text-sm">Install OLA Laundry</div>
              <div className="text-xs opacity-90">Get the full app experience</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isInstallable && deferredPrompt ? (
              <Button
                onClick={handleInstallClick}
                size="sm"
                variant="secondary"
              >
                Install
              </Button>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Available
              </Badge>
            )}
            <Button
              onClick={handleDismissBanner}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Floating variant
  if (variant === 'floating') {
    if (!isInstallable && !deviceInfo.isIOS) {
      return null;
    }

    return (
      <div className="fixed bottom-20 right-4 z-40">
        <div className="bg-primary text-primary-foreground rounded-full shadow-lg p-3 cursor-pointer hover:scale-105 transition-transform"
             onClick={isInstallable && deferredPrompt ? handleInstallClick : undefined}>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <span className="text-sm font-medium">Install</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Export hook for programmatic usage
export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window as any).navigator.standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      return outcome === 'accepted';
    } catch (error) {
      console.error('Installation error:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    install
  };
}