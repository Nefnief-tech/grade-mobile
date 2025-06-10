#!/bin/bash

# Cloud Build Script for Grade Tracker
# Avoids local Java/Gradle setup issues

echo "🔧 Grade Tracker Cloud Build Script"
echo "Avoiding local Java/Gradle issues by using EAS cloud builds..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli@latest
fi

# Check if logged in
echo "🔐 Checking authentication..."
if ! eas whoami &> /dev/null; then
    echo "Please log in to EAS:"
    eas login
fi

# Show build options
echo ""
echo "🚀 Choose build type:"
echo "1. Preview (APK for testing)"
echo "2. Production (App Bundle for store)"
echo "3. Both"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "📱 Building preview APK on EAS servers..."
        eas build --profile preview --platform android --no-local --non-interactive
        ;;
    2)
        echo "🏪 Building production app bundle on EAS servers..."
        eas build --profile production --platform android --no-local --non-interactive
        ;;
    3)
        echo "📱 Building preview APK on EAS servers..."
        eas build --profile preview --platform android --no-local --non-interactive
        echo "🏪 Building production app bundle on EAS servers..."
        eas build --profile production --platform android --no-local --non-interactive
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Build completed!"
echo "📥 Download your build from: https://expo.dev/accounts/$(eas whoami)/projects/grade-tracker-mobile/builds"
echo ""
echo "🎉 Your German Grade Tracker with GDPR encryption is ready!"