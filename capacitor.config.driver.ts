import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.olalaundry.driver',
  appName: 'OLA Driver',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    url: '/delivery-app',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#10B981",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    App: {
      appId: 'com.olalaundry.driver',
      appName: 'OLA Driver',
      appVersionName: '1.0.0',
      appVersionCode: 1
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#10B981'
    },
    Geolocation: {
      permissions: {
        location: 'always'
      }
    }
  },
};

export default config;