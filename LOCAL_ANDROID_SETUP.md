# 🛠️ Local Android Development Setup Guide

## Complete Environment Setup for Building APKs

This guide will help you set up your local machine to build all 4 Android APKs for OLA Laundry Master.

---

## 📋 Prerequisites Overview

You'll need to install:
1. **Android Studio** (includes Android SDK)
2. **Java JDK 17+** 
3. **Node.js 18+** (for the web application)
4. **Git** (to clone the project)

**Estimated Setup Time**: 30-45 minutes
**Estimated Build Time**: 15-20 minutes per app

---

## 🖥️ Step 1: Install Android Studio

### Windows Installation:
```powershell
# Download Android Studio from: https://developer.android.com/studio
# Run the installer with default settings
# During installation, make sure to install:
# - Android SDK
# - Android SDK Platform-Tools  
# - Android Virtual Device (optional)
```

### macOS Installation:
```bash
# Option 1: Direct download
# Download from: https://developer.android.com/studio

# Option 2: Using Homebrew
brew install --cask android-studio

# Launch Android Studio and complete setup wizard
```

### Ubuntu/Linux Installation:
```bash
# Install via Snap
sudo snap install android-studio --classic

# Or download manually
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.1.1.28/android-studio-2023.1.1.28-linux.tar.gz
tar -xzf android-studio-*.tar.gz
sudo mv android-studio /opt/
sudo ln -sf /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio
```

### Android Studio Setup:
1. **Launch Android Studio**
2. **Complete Setup Wizard**:
   - Choose "Standard" installation
   - Accept all license agreements
   - Install Android SDK (API level 30+ recommended)
   - Install Android SDK Build-Tools
   - Install Android Emulator (optional)

---

## ☕ Step 2: Install Java JDK 17+

### Windows Installation:
```powershell
# Option 1: Download from Oracle/OpenJDK
# https://adoptium.net/download/

# Option 2: Using Chocolatey
choco install openjdk17

# Option 3: Using Windows Package Manager
winget install Microsoft.OpenJDK.17
```

### macOS Installation:
```bash
# Using Homebrew (recommended)
brew install openjdk@17

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc

# Or download from: https://adoptium.net/download/
```

### Ubuntu/Linux Installation:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# CentOS/RHEL/Fedora
sudo dnf install java-17-openjdk-devel

# Verify installation
java -version
javac -version
```

---

## 📱 Step 3: Set Environment Variables

### Windows Setup:
```powershell
# Open System Properties → Advanced → Environment Variables
# Add these system variables:

# Android SDK location (adjust path if different)
ANDROID_HOME = C:\Users\%USERNAME%\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT = C:\Users\%USERNAME%\AppData\Local\Android\Sdk

# Java installation path
JAVA_HOME = C:\Program Files\OpenJDK\jdk-17

# Update PATH to include:
# %ANDROID_HOME%\tools
# %ANDROID_HOME%\platform-tools
# %ANDROID_HOME%\build-tools\34.0.0
# %JAVA_HOME%\bin
```

#### Windows PowerShell Commands:
```powershell
# Set environment variables via PowerShell
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\OpenJDK\jdk-17", "User")

# Add to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$newPath = "$currentPath;$env:LOCALAPPDATA\Android\Sdk\tools;$env:LOCALAPPDATA\Android\Sdk\platform-tools"
[Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
```

### macOS/Linux Setup:
```bash
# Add to ~/.zshrc, ~/.bash_profile, or ~/.bashrc

# Android SDK path (adjust if different)
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=$HOME/Android/Sdk        # Linux

export ANDROID_SDK_ROOT=$ANDROID_HOME

# Java installation path
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk  # Linux
# export JAVA_HOME=/opt/homebrew/opt/openjdk@17 # macOS

# Add tools to PATH
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/34.0.0:$JAVA_HOME/bin

# Reload shell configuration
source ~/.zshrc  # or ~/.bashrc
```

---

## 🔍 Step 4: Verify Installation

### Verification Commands:
```bash
# Check Java installation
java -version
# Should show: openjdk version "17.x.x"

javac -version  
# Should show: javac 17.x.x

# Check Android SDK
adb version
# Should show: Android Debug Bridge version

# Check environment variables
echo $ANDROID_HOME    # macOS/Linux
echo %ANDROID_HOME%   # Windows

# Test Android SDK manager
sdkmanager --list | head -20
```

### Expected Output:
```
java -version output:
openjdk version "17.0.8" 2023-07-18
OpenJDK Runtime Environment (build 17.0.8+7-Ubuntu-1ubuntu122.04)
OpenJDK 64-Bit Server VM (build 17.0.8+7-Ubuntu-1ubuntu122.04, mixed mode, sharing)

adb version output:
Android Debug Bridge version 1.0.41
Version 34.0.4-10411341
```

---

## 📂 Step 5: Download Project Locally

### Option 1: Clone from Git (if available):
```bash
# Clone the repository
git clone YOUR_REPLIT_GIT_URL
cd ola-laundry-master
```

### Option 2: Download from Replit:
```bash
# In Replit, create a download link
# Download the ZIP file and extract

# Or use Replit's Git integration
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd ola-laundry-master
```

### Option 3: Manual File Copy:
Create a new folder and copy all files from your Replit project:
- All source code files
- Configuration files
- Build scripts
- Package.json and dependencies

---

## 📦 Step 6: Install Project Dependencies

```bash
# Navigate to project directory
cd ola-laundry-master

# Install Node.js dependencies
npm install

# Install Capacitor CLI globally (if not installed)
npm install -g @capacitor/cli

# Verify Capacitor installation
npx cap --version

# Check project setup
npx cap doctor
```

---

## 🏗️ Step 7: Build Web Application

```bash
# Build the optimized web application
npm run build

# Verify build output
ls -la dist/public/
# Should contain: index.html, assets folder, etc.
```

---

## 📱 Step 8: Initialize Android Platform

```bash
# Add Android platform (first time only)
npx cap add android

# Verify Android folder was created
ls -la android/
# Should contain: app/, gradle/, build.gradle, etc.
```

---

## 🔨 Step 9: Build All 4 Android APKs

### Automated Build (Recommended):
```bash
# Make build script executable (macOS/Linux)
chmod +x build-all-android-apps.sh

# Run automated build for all 4 apps
./build-all-android-apps.sh
```

### Manual Build Process:
```bash
# Build Customer App
cp capacitor.config.customer.ts capacitor.config.ts
npx cap sync android
cd android
./gradlew clean assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../builds/android/customer-app.apk
cd ..

# Build Driver App
cp capacitor.config.driver.ts capacitor.config.ts  
npx cap sync android
cd android
./gradlew clean assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../builds/android/driver-app.apk
cd ..

# Build POS System
cp capacitor.config.pos.ts capacitor.config.ts
npx cap sync android  
cd android
./gradlew clean assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../builds/android/pos-app.apk
cd ..

# Build Admin Dashboard
cp capacitor.config.admin.ts capacitor.config.ts
npx cap sync android
cd android  
./gradlew clean assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../builds/android/admin-app.apk
cd ..
```

---

## 🎯 Step 10: Verify APK Files

### Check Built APKs:
```bash
# List all built APKs
ls -la builds/android/

# Expected output:
# customer-app.apk     (~8-12MB)
# driver-app.apk       (~8-12MB)  
# pos-app.apk          (~8-12MB)
# admin-app.apk        (~8-12MB)

# Check APK details
aapt dump badging builds/android/customer-app.apk | grep package
# Should show: package: name='com.olalaundry.customer'
```

### Test APK Installation:
```bash
# Connect Android device via USB (enable Developer Options + USB Debugging)
# Or start Android emulator

# Install APKs on connected device
adb devices  # Verify device is connected

adb install builds/android/customer-app.apk
adb install builds/android/driver-app.apk
adb install builds/android/pos-app.apk  
adb install builds/android/admin-app.apk
```

---

## 🚨 Troubleshooting Common Issues

### Issue 1: Gradle Build Fails
```bash
# Solution 1: Clean and rebuild
cd android
./gradlew clean
./gradlew assembleRelease --stacktrace

# Solution 2: Fix permissions (macOS/Linux)
chmod +x gradlew

# Solution 3: Update Gradle wrapper
./gradlew wrapper --gradle-version=8.4
```

### Issue 2: SDK License Not Accepted
```bash
# Accept all licenses
yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses

# If cmdline-tools not found, install via Android Studio:
# Tools → SDK Manager → SDK Tools → Android SDK Command-line Tools
```

### Issue 3: Java Version Issues
```bash
# Check Java version
java -version

# If wrong version, update JAVA_HOME
export JAVA_HOME=/path/to/correct/jdk
```

### Issue 4: Android SDK Not Found
```bash
# Verify ANDROID_HOME
echo $ANDROID_HOME

# Find SDK location in Android Studio:
# File → Settings → Appearance → System Settings → Android SDK
# Copy the SDK path and update ANDROID_HOME
```

### Issue 5: Capacitor Sync Fails
```bash
# Clear Capacitor cache
npx cap clean android

# Force sync
npx cap sync android --force

# Check capacitor.config.ts is valid
npx cap doctor
```

---

## 📊 Build Success Verification

After successful build, you should have:

### ✅ File Structure:
```
ola-laundry-master/
├── builds/android/
│   ├── customer-app.apk      (OLA Customer)
│   ├── driver-app.apk        (OLA Driver)  
│   ├── pos-app.apk           (OLA POS)
│   └── admin-app.apk         (OLA Admin)
├── android/                  (Android project files)
├── dist/public/              (Built web app)
├── capacitor.config.*.ts     (App configurations)
└── build-all-android-apps.sh (Build script)
```

### ✅ APK Properties:
- **Size**: 8-12MB each
- **Min SDK**: Android 5.0 (API 21)
- **Target SDK**: Android 13 (API 33)
- **Permissions**: Camera, Location, Network, Storage
- **Features**: Offline support, Push notifications

### ✅ App Details:
1. **Customer App** (`com.olalaundry.customer`)
   - Blue theme (#3B82F6)
   - Order placement and tracking

2. **Driver App** (`com.olalaundry.driver`)  
   - Green theme (#10B981)
   - GPS tracking and route optimization

3. **POS System** (`com.olalaundry.pos`)
   - Orange theme (#F59E0B)
   - Point of sale operations

4. **Admin Dashboard** (`com.olalaundry.admin`)
   - Purple theme (#8B5CF6)
   - Complete business management

---

## 🚀 Next Steps

### Distribution Options:
1. **Direct Installation**: Share APK files directly
2. **Internal Testing**: Upload to Google Play Console for internal testing
3. **Enterprise Distribution**: Use MDM solutions for business deployment
4. **Play Store**: Submit for public distribution (requires Play Console account)

### Production Considerations:
- **Code Signing**: Use release keystore for production builds
- **App Optimization**: Enable ProGuard/R8 for smaller APK size
- **Testing**: Test on multiple devices and Android versions
- **Updates**: Set up automatic update mechanism

Your complete OLA Laundry Master Android app suite is ready for deployment!