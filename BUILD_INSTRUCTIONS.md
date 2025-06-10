# Modern Expo Build Instructions - FIXED

The old `expo build` command is deprecated. Use EAS Build instead for modern Expo apps.

## Setup EAS Build

1. **Install/Update EAS CLI globally:**
```bash
npm install -g eas-cli@latest
```

2. **Login to Expo:**
```bash
eas login
```

3. **Configure your project:**
```bash
eas build:configure
```

## Fixed EAS Configuration

The `eas.json` has been corrected with proper `buildType` values:
- **Preview**: `apk` (for testing)
- **Production**: `app-bundle` (for Play Store)

## Build Commands

### Development Build
```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Preview Build (APK for testing)
```bash
eas build --profile preview --platform android
```

### Production Build (App Bundle for Play Store)
```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

## Local Development

For local development, use these commands instead:

### Start Development Server
```bash
npm start
# or
npx expo start
```

### Run on Specific Platform
```bash
npx expo run:android
npx expo run:ios
```

### Web Development
```bash
npx expo start --web
```

## Troubleshooting

### If you get version errors:
```bash
npm install -g eas-cli@latest
```

### If build fails:
```bash
eas build:configure --force
```

### Clear cache:
```bash
npx expo start --clear
```

## Important Notes

- **Don't use** `expo build` (deprecated)
- **Use** `eas build` for production builds
- **Use** `npx expo start` for development
- Make sure your `app.json` and `eas.json` are properly configured
- **buildType** values: `apk` or `app-bundle` (not `aab`)

## GDPR Compliance Notes

Your app includes GDPR-compliant encryption. Make sure to:
1. Install crypto dependencies: `npm install crypto-js expo-secure-store`
2. Update your Appwrite database schema as documented
3. Test encryption functionality before production builds