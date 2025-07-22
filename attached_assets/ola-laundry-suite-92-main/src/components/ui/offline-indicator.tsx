
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi, Clock } from 'lucide-react';

export function OfflineIndicator() {
  const { isOnline, pendingActions } = useOfflineSync();

  if (isOnline && pendingActions === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Badge variant={isOnline ? "secondary" : "destructive"} className="flex items-center gap-2">
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isOnline ? 'Online' : 'Offline'}
        {pendingActions > 0 && (
          <>
            <Clock className="h-3 w-3" />
            {pendingActions} pending
          </>
        )}
      </Badge>
    </div>
  );
}
