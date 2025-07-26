# ⚡ Quick Build Commands - Local Android Development

## 🚀 Fast Setup Commands

Copy and paste these commands in order to set up and build all Android APKs quickly.

---

## 📋 Prerequisites Check

```bash
# Check if tools are installed
java -version           # Should show Java 17+
node --version          # Should show Node.js 18+
npm --version           # Should show npm
git --version           # Should show Git
adb version            # Should show Android Debug Bridge

# If any tool is missing, install from previous guide
```

---

## 📦 Project Setup (One-Time)

### Download Project:
```bash
# Clone or download your Replit project locally
# Replace with your actual project URL/path
git clone YOUR_PROJECT_URL
cd ola-laundry-master

# Or if downloaded as ZIP:
# unzip ola-laundry-master.zip
# cd ola-laundry-master
```

### Install Dependencies:
```bash
# Install Node.js dependencies
npm install

# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Add Android platform
npx cap add android

# Verify setup
npx cap doctor
```

---

## 🏗️ Build All Apps (Main Commands)

### Option 1: Automated Build (Recommended)
```bash
# Build web app first
npm run build

# Run automated script to build all 4 APKs
chmod +x build-all-android-apps.sh
./build-all-android-apps.sh

# APKs will be in builds/android/ folder
ls -la builds/android/
```

### Option 2: Individual App Builds
```bash
# Build web application
npm run build

# Create builds directory
mkdir -p builds/android

# Build Customer App (Blue theme)
cp capacitor.config.customer.ts capacitor.config.ts
npx cap sync android
cd android && ./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../builds/android/customer-app.apk
cd ..

# Build Driver App (Green theme)  
cp capacitor.config.driver.ts capacitor.config.ts
npx cap sync android
cd android && ./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../builds/android/driver-app.apk
cd ..

# Build POS System (Orange theme)
cp capacitor.config.pos.ts capacitor.config.ts
npx cap sync android
cd android && ./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../builds/android/pos-app.apk
cd ..

# Build Admin Dashboard (Purple theme)
cp capacitor.config.admin.ts capacitor.config.ts
npx cap sync android
cd android && ./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../builds/android/admin-app.apk
cd ..

echo "All 4 APKs built successfully!"
ls -la builds/android/
```

---

## 📱 Quick Install Commands

### Install on Connected Device:
```bash
# Check device connection
adb devices

# Install all 4 apps
adb install builds/android/customer-app.apk
adb install builds/android/driver-app.apk  
adb install builds/android/pos-app.apk
adb install builds/android/admin-app.apk

echo "All apps installed successfully!"
```

### Uninstall (if needed):
```bash
# Uninstall apps
adb uninstall com.olalaundry.customer
adb uninstall com.olalaundry.driver
adb uninstall com.olalaundry.pos  
adb uninstall com.olalaundry.admin
```

---

## 🔧 Quick Troubleshooting

### Clean Build:
```bash
# Clean everything and rebuild
cd android
./gradlew clean
cd ..
rm -rf builds/android/*
npm run build
./build-all-android-apps.sh
```

### Fix Gradle Issues:
```bash
# Accept SDK licenses
yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses

# Update Gradle wrapper
cd android
./gradlew wrapper --gradle-version=8.4
cd ..
```

### Environment Variables (Linux/macOS):
```bash
# Quick environment setup
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Environment Variables (Windows):
```powershell
# Quick environment setup (PowerShell)
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\OpenJDK\jdk-17"
$env:PATH += ";$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools"
```

---

## 📊 Verify Success

### Check Built APKs:
```bash
# List APK files with sizes
ls -lh builds/android/

# Expected output:
# customer-app.apk  (8-12MB) - OLA Customer
# driver-app.apk    (8-12MB) - OLA Driver  
# pos-app.apk       (8-12MB) - OLA POS
# admin-app.apk     (8-12MB) - OLA Admin
```

### Test APK Details:
```bash
# Check app package info
aapt dump badging builds/android/customer-app.apk | grep -E "(package|application-label)"

# Should show:
# package: name='com.olalaundry.customer'
# application-label:'OLA Customer'
```

---

## 🎯 Complete Build Script

Here's a single script that does everything:

```bash
#!/bin/bash
# complete-build.sh - Build all OLA Laundry Master Android apps

echo "🚀 Starting complete build process..."

# Check prerequisites
command -v java >/dev/null 2>&1 || { echo "Java not found. Install Java 17+"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js not found. Install Node.js 18+"; exit 1; }
command -v adb >/dev/null 2>&1 || { echo "Android SDK not found. Install Android Studio"; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build web application  
echo "🏗️ Building web application..."
npm run build

# Add Android platform if not exists
if [ ! -d "android" ]; then
    echo "🔧 Adding Android platform..."
    npx cap add android
fi

# Build all APKs
echo "📱 Building all Android APKs..."
chmod +x build-all-android-apps.sh
./build-all-android-apps.sh

# Verify builds
echo "✅ Build complete! APK files:"
ls -lh builds/android/

echo "🎉 All 4 OLA Laundry Master Android apps built successfully!"
echo "📱 Install with: adb install builds/android/[app-name].apk"
```

Save as `complete-build.sh`, make executable with `chmod +x complete-build.sh`, then run with `./complete-build.sh`.

---

## ⏱️ Expected Timeline

- **Initial Setup**: 30-45 minutes (one-time)
- **Web Build**: 2-3 minutes
- **Each APK Build**: 3-5 minutes  
- **Total Build Time**: 15-20 minutes for all 4 apps
- **Installation**: 1-2 minutes per app

Your complete Android development environment is ready! 🚀