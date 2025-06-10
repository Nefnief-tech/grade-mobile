# Local Build Setup for German Grade Tracker

## Requirements for Local Android Builds

To build locally, you need to set up the complete Android development environment:

### 1. Install Java Development Kit (JDK)

**Windows:**
```powershell
# Download and install JDK 17 from Microsoft
# https://docs.microsoft.com/en-us/java/openjdk/download#openjdk-17
# Or use Chocolatey
choco install microsoft-openjdk17

# Set environment variables
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Microsoft\jdk-17.0.x", "Machine")
```

**macOS:**
```bash
# Install via Homebrew
brew install --cask temurin17

# Add to ~/.zshrc or ~/.bash_profile
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH=$JAVA_HOME/bin:$PATH
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# Set JAVA_HOME in ~/.bashrc
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 2. Install Android Studio and SDK

**Download Android Studio:**
- Visit: https://developer.android.com/studio
- Install the complete package

**Configure Android SDK:**
```bash
# Set Android environment variables
# Windows (in System Environment Variables):
ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=%ANDROID_HOME%

# macOS/Linux (add to ~/.zshrc or ~/.bashrc):
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$ANDROID_HOME/emulator:$PATH
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/tools/bin:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

### 3. Install Required SDK Components

Open Android Studio and install:
- **Android SDK Platform 34** (API level 34)
- **Android SDK Build-Tools 34.0.0**
- **Android SDK Command-line Tools**
- **Android SDK Platform-Tools**
- **Android Emulator**
- **NDK (Side by side) 25.1.8937393**

### 4. Accept Android Licenses

```bash
# Accept all Android SDK licenses
$ANDROID_HOME/tools/bin/sdkmanager --licenses
# Type 'y' for each license
```

### 5. Verify Installation

```bash
# Check Java
java -version
javac -version

# Check Android tools
adb version
emulator -version

# Check environment variables
echo $JAVA_HOME
echo $ANDROID_HOME
echo $ANDROID_SDK_ROOT
```

## Local Build Commands

Once everything is set up:

### Development Build
```bash
# Start Metro bundler
npx expo start

# Build and run on connected device/emulator
npx expo run:android
```

### Production APK Build
```bash
# Generate APK locally
npx expo build:android --type apk --no-publish

# Or use EAS for local builds
eas build --profile preview --platform android --local
```

### Production App Bundle
```bash
# Generate AAB for Play Store
npx expo build:android --type app-bundle --no-publish

# Or use EAS
eas build --profile production --platform android --local
```

## Troubleshooting Local Builds

### Common Issues:

**1. JAVA_HOME not set:**
```bash
# Windows CMD
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.x
# Windows PowerShell
$env:JAVA_HOME="C:\Program Files\Microsoft\jdk-17.0.x"
```

**2. Android SDK not found:**
```bash
# Create local.properties in android folder
echo "sdk.dir=/path/to/Android/Sdk" > android/local.properties
```

**3. Gradle daemon issues:**
```bash
cd android
./gradlew --stop
./gradlew clean
cd ..
npx expo run:android
```

**4. NDK issues:**
```bash
# Install specific NDK version
$ANDROID_HOME/tools/bin/sdkmanager "ndk;25.1.8937393"
```

## Quick Setup Script

Want me to create an automated setup script for your platform?