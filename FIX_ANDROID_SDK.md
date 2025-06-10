# Android SDK Build Fix

## The Problem
The build is failing because:
- `SDK location not found` - Android SDK not properly configured
- `ANDROID_HOME environment variable` missing
- `local.properties` file missing Android SDK path

## Solution: Use Stable Android Build Image

I've updated your `eas.json` to use a specific, stable Android build image that has the SDK pre-configured:

```json
{
  "android": {
    "image": "ubuntu-22.04-android-34-ndk-r26b",
    "resourceClass": "large"
  }
}
```

This ensures:
- ✅ **Android SDK 34** pre-installed
- ✅ **NDK r26b** pre-configured  
- ✅ **Java 17** properly set up
- ✅ **ANDROID_HOME** environment variable set
- ✅ **Large resource class** for better performance

## Quick Fix Commands

Try building again with the updated configuration:

```bash
# Build with stable Android image
eas build --profile preview --platform android --non-interactive

# Or use the cloud build script
./cloud-build.sh
```

## Alternative: Remote Build Only

If you continue having issues, force remote builds only:

```bash
# Always build on EAS servers (never local)
eas build --platform android --profile preview --no-local
```

## Troubleshooting

If build still fails:

1. **Clear build cache:**
```bash
eas build --profile preview --platform android --clear-cache
```

2. **Use different build image:**
Add to your `eas.json`:
```json
{
  "android": {
    "image": "ubuntu-22.04-android-33-ndk-r25b"
  }
}
```

3. **Check build logs:**
Look for these in the logs:
- ✅ `ANDROID_HOME` is set
- ✅ `SDK location` found
- ✅ Gradle can find Android SDK

## Your Updated Configuration

The new `eas.json` specifies:
- **Specific Android image** with SDK 34
- **Large resource class** for better performance
- **Stable NDK version** (r26b)
- **Ubuntu 22.04** base with all tools pre-installed

This should resolve all Android SDK and environment issues!