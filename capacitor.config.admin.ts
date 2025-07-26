import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.olalaundry.admin',
  appName: 'OLA Admin',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    url: '/tenant/demo/dashboard',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#8B5CF6",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    App: {
      appId: 'com.olalaundry.admin',
      appName: 'OLA Admin',
      appVersionName: '1.0.0',
      appVersionCode: 1
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#8B5CF6'
    }
  },
};

export default config;