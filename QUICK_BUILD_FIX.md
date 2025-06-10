# Quick Fix for Build Issues

## 1. Replace app.json with minimal configuration

Replace your current `app.json` with this minimal version:

```bash
# Backup current app.json
mv app.json app.json.backup

# Use minimal configuration
mv app-minimal.json app.json
```

## 2. Fix dependencies

Update dependencies to compatible versions:

```bash
# Fix Expo SDK version issues
npx expo install --fix

# Or manually update specific packages
npm install expo@~51.0.28
npm install @react-native-async-storage/async-storage@1.23.1
npm install react-native-safe-area-context@4.10.5
npm install react-native-svg@15.2.0
```

## 3. Exclude problematic packages from validation

Add this to your package.json:

```json
{
  "expo": {
    "doctor": {
      "reactNativeDirectoryCheck": {
        "exclude": [
          "react-native-chart-kit",
          "appwrite",
          "react-native-vector-icons"
        ],
        "listUnknownPackages": false
      }
    }
  }
}
```

## 4. Create missing assets (optional)

If you want icons and splash screens later:

```bash
# Create assets directory
mkdir -p assets

# Generate default assets (requires npx expo-cli)
npx expo generate:assets
```

## 5. Build with minimal configuration

```bash
# Try building again
eas build --profile preview --platform android
```

## Quick Command Sequence

```bash
# Replace app.json
mv app.json app.json.backup && mv app-minimal.json app.json

# Fix dependencies  
npx expo install --fix

# Build
eas build --profile preview --platform android
```

This should resolve:
- ✅ Missing splash.png error
- ✅ Missing icon assets error  
- ✅ SDK version compatibility issues
- ✅ Dependency validation warnings