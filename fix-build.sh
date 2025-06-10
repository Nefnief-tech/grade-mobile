#!/bin/bash

# Build Fix Script for Grade Tracker
echo "🔧 Fixing build issues for Grade Tracker..."

# Step 1: Backup and replace app.json
echo "📱 Updating app.json configuration..."
if [ -f "app.json" ]; then
    mv app.json app.json.backup
    echo "✅ Backed up original app.json"
fi

if [ -f "app-minimal.json" ]; then
    mv app-minimal.json app.json
    echo "✅ Applied minimal app.json configuration"
else
    echo "❌ app-minimal.json not found"
fi

# Step 2: Fix dependencies
echo "📦 Fixing dependency versions..."
npx expo install --fix

# Step 3: Clean cache
echo "🧹 Cleaning caches..."
npx expo start --clear --offline

# Step 4: Try building
echo "🚀 Attempting build..."
eas build --profile preview --platform android

echo "✅ Build fix script completed!"
echo ""
echo "If build still fails:"
echo "1. Check that your Expo account is properly set up"
echo "2. Run 'eas project:init' if needed"
echo "3. Ensure you have the latest EAS CLI: npm install -g eas-cli@latest"