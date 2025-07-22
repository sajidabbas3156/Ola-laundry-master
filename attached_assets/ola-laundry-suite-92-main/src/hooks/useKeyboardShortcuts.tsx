
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { currentTenant } = useTenant();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'd',
      ctrlKey: true,
      action: () => currentTenant && navigate(`/tenant/${currentTenant.slug}/dashboard`),
      description: 'Go to Dashboard'
    },
    {
      key: 'o',
      ctrlKey: true,
      action: () => currentTenant && navigate(`/tenant/${currentTenant.slug}/orders`),
      description: 'Go to Orders'
    },
    {
      key: 'c',
      ctrlKey: true,
      action: () => currentTenant && navigate(`/tenant/${currentTenant.slug}/customers`),
      description: 'Go to Customers'
    },
    {
      key: 'p',
      ctrlKey: true,
      action: () => currentTenant && navigate(`/tenant/${currentTenant.slug}/pos`),
      description: 'Go to POS'
    },
    {
      key: 'r',
      ctrlKey: true,
      action: () => currentTenant && navigate(`/tenant/${currentTenant.slug}/reports`),
      description: 'Go to Reports'
    },
    {
      key: 'm',
      ctrlKey: true,
      action: () => currentTenant && navigate(`/tenant/${currentTenant.slug}/marketing`),
      description: 'Go to Marketing'
    },
    {
      key: '?',
      shiftKey: true,
      action: () => showShortcutsHelp(),
      description: 'Show keyboard shortcuts'
    }
  ];

  const showShortcutsHelp = useCallback(() => {
    const shortcutsList = shortcuts
      .map(s => `${s.ctrlKey ? 'Ctrl+' : ''}${s.shiftKey ? 'Shift+' : ''}${s.key.toUpperCase()}: ${s.description}`)
      .join('\n');
    
    toast('Keyboard Shortcuts', {
      description: shortcutsList,
      duration: 5000
    });
  }, [shortcuts]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => 
        s.key === event.key.toLowerCase() &&
        !!s.ctrlKey === event.ctrlKey &&
        !!s.metaKey === event.metaKey &&
        !!s.shiftKey === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return { shortcuts };
}
