
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function InstallPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 md:max-w-md md:left-auto shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Install App</CardTitle>
            <Badge variant="secondary" className="text-xs">PWA</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Install OLA Laundry for faster access and offline capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button onClick={installApp} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Install Now
        </Button>
      </CardContent>
    </Card>
  );
}
