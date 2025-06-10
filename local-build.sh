#!/bin/bash

# Local Build Script for German Grade Tracker
echo "🔧 Local Build Setup for German Grade Tracker"

# Check if we're on Windows (Git Bash/WSL)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo "🪟 Detected Windows environment"
    PLATFORM="windows"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Detected macOS environment"
    PLATFORM="macos"
else
    echo "🐧 Detected Linux environment"
    PLATFORM="linux"
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Java
if command_exists java; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
    echo "✅ Java found: $JAVA_VERSION"
    if [[ -n "$JAVA_HOME" ]]; then
        echo "✅ JAVA_HOME set: $JAVA_HOME"
    else
        echo "⚠️  JAVA_HOME not set"
    fi
else
    echo "❌ Java not found. Please install JDK 17."
    exit 1
fi

# Check Android SDK
if [[ -n "$ANDROID_HOME" ]]; then
    echo "✅ ANDROID_HOME set: $ANDROID_HOME"
    if [[ -f "$ANDROID_HOME/platform-tools/adb" ]]; then
        echo "✅ Android SDK found"
    else
        echo "❌ Android SDK not properly installed"
        exit 1
    fi
else
    echo "❌ ANDROID_HOME not set"
    exit 1
fi

# Check if Android licenses are accepted
echo "🔐 Checking Android licenses..."
if [[ -d "$ANDROID_HOME/licenses" ]]; then
    echo "✅ Android licenses accepted"
else
    echo "⚠️  Android licenses not accepted. Run: $ANDROID_HOME/tools/bin/sdkmanager --licenses"
fi

# Check Node.js and npm
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Install dependencies if needed
if [[ ! -d "node_modules" ]]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if crypto dependencies are installed
if npm list crypto-js expo-secure-store >/dev/null 2>&1; then
    echo "✅ GDPR crypto dependencies installed"
else
    echo "📦 Installing GDPR crypto dependencies..."
    npm install crypto-js expo-secure-store
fi

# Show build options
echo ""
echo "🚀 Choose local build option:"
echo "1. Development build (debug APK)"
echo "2. Preview build (release APK)"
echo "3. Production build (App Bundle)"
echo "4. Run on device/emulator"
echo "5. Start development server only"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo "🔨 Building development APK locally..."
        eas build --profile development --platform android --local
        ;;
    2)
        echo "📱 Building preview APK locally..."
        eas build --profile preview --platform android --local
        ;;
    3)
        echo "🏪 Building production App Bundle locally..."
        eas build --profile production --platform android --local
        ;;
    4)
        echo "📱 Running on device/emulator..."
        npx expo run:android
        ;;
    5)
        echo "🖥️  Starting development server..."
        npx expo start
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Local build process completed!"
echo "🎉 Your German Grade Tracker with GDPR encryption is ready!"