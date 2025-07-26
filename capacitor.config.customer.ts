import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.olalaundry.customer',
  appName: 'OLA Customer',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    url: '/customer-app',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#3B82F6",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    App: {
      appId: 'com.olalaundry.customer',
      appName: 'OLA Customer',
      appVersionName: '1.0.0',
      appVersionCode: 1
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#3B82F6'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  },
};

export default config;