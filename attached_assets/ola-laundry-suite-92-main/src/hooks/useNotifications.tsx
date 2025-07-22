
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  persistent?: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('ola_notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter((n: NotificationData) => !n.read).length);
    }
  }, []);

  const saveNotifications = useCallback((newNotifications: NotificationData[]) => {
    localStorage.setItem('ola_notifications', JSON.stringify(newNotifications));
    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  }, []);

  const addNotification = useCallback((notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    saveNotifications(updatedNotifications);
    
    // Show toast notification
    const toastFn = toast[notification.type] || toast;
    toastFn(notification.title, {
      description: notification.message,
    });
  }, [notifications, saveNotifications]);

  const markAsRead = useCallback((id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  const deleteNotification = useCallback((id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  const clearAll = useCallback(() => {
    saveNotifications([]);
  }, [saveNotifications]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };
}
