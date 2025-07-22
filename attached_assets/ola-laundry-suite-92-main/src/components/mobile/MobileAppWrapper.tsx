
import { ReactNode } from 'react';
import { MobileAppShell } from './MobileAppShell';
import { InstallPrompt } from '../pwa/InstallPrompt';
import { FloatingWhatsAppButton } from '../whatsapp/FloatingWhatsAppButton';

interface MobileAppWrapperProps {
  children: ReactNode;
  hasBottomNav?: boolean;
  className?: string;
}

export function MobileAppWrapper({ children, hasBottomNav = false, className }: MobileAppWrapperProps) {
  return (
    <MobileAppShell hasBottomNav={hasBottomNav} className={className}>
      {children}
      <InstallPrompt />
      <FloatingWhatsAppButton 
        phoneNumber="1234567890" 
        message="Hi! I need help with the OLA Laundry mobile app."
      />
    </MobileAppShell>
  );
}
