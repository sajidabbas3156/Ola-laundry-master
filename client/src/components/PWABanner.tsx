import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWABanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window as any).navigator.standalone === true;
    setIsStandalone(standalone);

    if (standalone) return;

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Show banner after user has spent time on the app
      setTimeout(() => {
        if (!sessionStorage.getItem('pwa-banner-dismissed')) {
          setShowBanner(true);
        }
      }, 10000); // Show after 10 seconds
    };

    const handleAppInstalled = () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setShowBanner(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Installation error:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (isStandalone || !showBanner || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg animate-in slide-in-from-top duration-300">
      <div className="flex items-center justify-between p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">Install OLA Laundry Master</div>
            <div className="text-sm opacity-90">Get the full app experience with offline access</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleInstall}
            variant="secondary"
            size="sm"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}