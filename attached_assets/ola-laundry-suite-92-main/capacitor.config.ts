
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.db2f38e00cb1414e9b2e525dd8944273',
  appName: 'ola-laundry-suite-05',
  webDir: 'dist',
  server: {
    url: 'https://db2f38e0-0cb1-414e-9b2e-525dd8944273.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3b82f6',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
