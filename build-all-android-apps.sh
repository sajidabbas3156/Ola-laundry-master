#!/bin/bash

# Build All 4 Android Apps - OLA Laundry Master
# This script builds native Android APKs for all applications

echo "🚀 Building all 4 OLA Laundry Master Android apps..."
echo "📱 Apps: Customer, Driver, POS, Admin"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME not set. Please set up Android SDK."
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java JDK 17+."
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build web application
echo "🏗️ Building web application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Web build failed. Please check for errors."
    exit 1
fi

echo "✅ Web build completed!"
echo ""

# Create builds directory
mkdir -p builds/android

# App configurations
declare -A apps
apps[customer]="Customer App,com.olalaundry.customer,#3B82F6"
apps[driver]="Driver App,com.olalaundry.driver,#10B981"  
apps[pos]="POS System,com.olalaundry.pos,#F59E0B"
apps[admin]="Admin Dashboard,com.olalaundry.admin,#8B5CF6"

# Build each app
for app_key in "${!apps[@]}"; do
    app_info="${apps[$app_key]}"
    IFS=',' read -r app_name app_id theme_color <<< "$app_info"
    
    echo "🔨 Building $app_name..."
    echo "   📋 App ID: $app_id"
    echo "   🎨 Theme: $theme_color"
    
    # Copy app-specific Capacitor config
    if [ ! -f "capacitor.config.$app_key.ts" ]; then
        echo "❌ Configuration file capacitor.config.$app_key.ts not found!"
        continue
    fi
    
    cp "capacitor.config.$app_key.ts" capacitor.config.ts
    
    # Initialize Android platform if needed
    if [ ! -d "android" ]; then
        echo "   🔧 Adding Android platform..."
        npx cap add android
    fi
    
    # Sync Capacitor
    echo "   🔄 Syncing Capacitor..."
    npx cap sync android
    
    if [ $? -ne 0 ]; then
        echo "   ❌ Capacitor sync failed for $app_name"
        continue
    fi
    
    # Build APK
    echo "   📱 Building APK..."
    cd android
    
    # Clean previous build
    ./gradlew clean
    
    # Build release APK
    ./gradlew assembleRelease
    
    if [ $? -eq 0 ]; then
        # Copy APK to builds directory
        apk_source="app/build/outputs/apk/release/app-release.apk"
        apk_target="../builds/android/$app_key-app.apk"
        
        if [ -f "$apk_source" ]; then
            cp "$apk_source" "$apk_target"
            echo "   ✅ $app_name APK built successfully!"
            echo "   📄 Location: builds/android/$app_key-app.apk"
        else
            echo "   ❌ APK file not found for $app_name"
        fi
    else
        echo "   ❌ Build failed for $app_name"
    fi
    
    # Return to root directory
    cd ..
    echo ""
done

# Build summary
echo "🎉 Build process completed!"
echo ""
echo "📱 Android APK Summary:"
echo "======================"

total_size=0
built_count=0

for app_key in "${!apps[@]}"; do
    app_info="${apps[$app_key]}"
    IFS=',' read -r app_name app_id theme_color <<< "$app_info"
    apk_file="builds/android/$app_key-app.apk"
    
    if [ -f "$apk_file" ]; then
        size=$(du -h "$apk_file" | cut -f1)
        echo "✅ $app_name: $apk_file ($size)"
        built_count=$((built_count + 1))
    else
        echo "❌ $app_name: Build failed"
    fi
done

echo ""
echo "📊 Build Statistics:"
echo "   🏗️ Apps built: $built_count/4"
echo "   📁 Output directory: builds/android/"
echo ""

if [ $built_count -eq 4 ]; then
    echo "🎉 All 4 Android apps built successfully!"
    echo ""
    echo "📱 Installation Commands:"
    echo "   adb install builds/android/customer-app.apk"
    echo "   adb install builds/android/driver-app.apk"
    echo "   adb install builds/android/pos-app.apk"
    echo "   adb install builds/android/admin-app.apk"
    echo ""
    echo "🚀 Your OLA Laundry Master mobile app suite is ready!"
else
    echo "⚠️  Some apps failed to build. Please check the errors above."
fi

# List all built APKs
if [ -d "builds/android" ] && [ "$(ls -A builds/android)" ]; then
    echo ""
    echo "📋 Built APK Files:"
    ls -la builds/android/
fi