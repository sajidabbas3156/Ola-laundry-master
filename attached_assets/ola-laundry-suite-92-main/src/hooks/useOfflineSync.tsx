
import { useState, useEffect } from 'react';
import { useNotifications } from './useNotifications';

interface OfflineAction {
  id: string;
  type: 'CREATE_ORDER' | 'UPDATE_ORDER' | 'CREATE_CUSTOMER' | 'UPDATE_CUSTOMER';
  data: any;
  timestamp: Date;
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Load pending actions from localStorage
    const saved = localStorage.getItem('ola_offline_actions');
    if (saved) {
      setPendingActions(JSON.parse(saved));
    }

    const handleOnline = () => {
      setIsOnline(true);
      addNotification({
        type: 'success',
        title: 'Back Online',
        message: 'Internet connection restored. Syncing data...'
      });
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      addNotification({
        type: 'warning',
        title: 'Offline Mode',
        message: 'Working offline. Changes will sync when connection is restored.'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification]);

  const addOfflineAction = (action: Omit<OfflineAction, 'id' | 'timestamp'>) => {
    const newAction: OfflineAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    const updated = [...pendingActions, newAction];
    setPendingActions(updated);
    localStorage.setItem('ola_offline_actions', JSON.stringify(updated));
  };

  const syncPendingActions = async () => {
    if (pendingActions.length === 0) return;

    try {
      // Simulate API sync - replace with actual API calls
      console.log('Syncing pending actions:', pendingActions);
      
      // Clear pending actions after successful sync
      setPendingActions([]);
      localStorage.removeItem('ola_offline_actions');
      
      addNotification({
        type: 'success',
        title: 'Sync Complete',
        message: `${pendingActions.length} changes synced successfully`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Sync Failed',
        message: 'Failed to sync offline changes. Will retry when online.'
      });
    }
  };

  return {
    isOnline,
    pendingActions: pendingActions.length,
    addOfflineAction,
    syncPendingActions
  };
}
