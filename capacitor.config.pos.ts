import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.olalaundry.pos',
  appName: 'OLA POS',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    url: '/vendor-pos',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#F59E0B",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    App: {
      appId: 'com.olalaundry.pos',
      appName: 'OLA POS',
      appVersionName: '1.0.0',
      appVersionCode: 1
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#F59E0B'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark'
    }
  },
};

export default config;