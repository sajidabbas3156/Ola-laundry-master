// Android Build Configuration for All 4 Apps
// OLA Laundry Master - Multi-App Build System

const fs = require('fs');
const path = require('path');

// App configurations for all 4 applications
const apps = [
  {
    id: 'customer',
    name: 'OLA Customer',
    appId: 'com.olalaundry.customer',
    route: '/customer-app',
    description: 'Customer mobile app for placing and tracking laundry orders',
    theme: '#3B82F6', // Blue theme
    icon: 'customer-icon.png'
  },
  {
    id: 'driver', 
    name: 'OLA Driver',
    appId: 'com.olalaundry.driver',
    route: '/delivery-app',
    description: 'Delivery driver app for route management and GPS tracking',
    theme: '#10B981', // Green theme
    icon: 'driver-icon.png'
  },
  {
    id: 'pos',
    name: 'OLA POS',
    appId: 'com.olalaundry.pos', 
    route: '/vendor-pos',
    description: 'Point of sale system for staff and in-store operations',
    theme: '#F59E0B', // Orange theme
    icon: 'pos-icon.png'
  },
  {
    id: 'admin',
    name: 'OLA Admin',
    appId: 'com.olalaundry.admin',
    route: '/tenant/demo/dashboard',
    description: 'Admin dashboard for complete business management',
    theme: '#8B5CF6', // Purple theme
    icon: 'admin-icon.png'
  }
];

// Generate Capacitor config for each app
function generateCapacitorConfig(app) {
  return `import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '${app.appId}',
  appName: '${app.name}',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    url: '${app.route}',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "${app.theme}",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    App: {
      appId: '${app.appId}',
      appName: '${app.name}',
      appVersionName: '1.0.0',
      appVersionCode: 1
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '${app.theme}'
    }
  },
};

export default config;`;
}

// Generate build script
function generateBuildScript() {
  return `#!/bin/bash
# Build all 4 Android APKs for OLA Laundry Master

echo "🚀 Building all OLA Laundry Master Android apps..."

# Build web application first
echo "📦 Building web application..."
npm run build

# Create build directory
mkdir -p builds/android

${apps.map(app => `
echo "🔨 Building ${app.name} APK..."

# Copy app-specific Capacitor config
cp capacitor.config.${app.id}.ts capacitor.config.ts

# Sync Capacitor for this app
npx cap sync android

# Build APK
cd android
./gradlew assembleRelease

# Copy APK to builds directory
cp app/build/outputs/apk/release/app-release.apk ../builds/android/${app.id}-release.apk

# Return to root
cd ..

echo "✅ ${app.name} APK built successfully!"
`).join('')}

echo "🎉 All 4 Android APKs built successfully!"
echo "📱 APK files available in builds/android/ directory:"
${apps.map(app => `echo "   - ${app.id}-release.apk (${app.name})"`).join('\n')}
`;
}

// Export configuration
module.exports = {
  apps,
  generateCapacitorConfig,
  generateBuildScript
};

console.log('Android build configuration ready for 4 apps:', apps.map(app => app.name).join(', '));