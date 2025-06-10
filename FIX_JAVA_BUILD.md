# Fix Java/Gradle Build Issues

## The Problem
The build is failing because:
- JAVA_HOME is not set in the build environment
- Gradle cannot find Java installation
- Build environment may be using wrong Java version

## Solution: Use EAS Cloud Build (Recommended)

Instead of local builds, use EAS cloud builds which have Java pre-configured:

```bash
# Build on EAS servers (with Java pre-installed)
eas build --profile preview --platform android --non-interactive

# For production
eas build --profile production --platform android --non-interactive
```

## Alternative: Configure Local Build Environment

If you want to build locally, you need to set up Java:

### Windows:
```batch
# Install Java 17 (recommended for React Native)
# Download from: https://adoptium.net/temurin/releases/

# Set JAVA_HOME environment variable
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

# Verify installation
java -version
javac -version
```

### macOS:
```bash
# Install Java with Homebrew
brew install --cask temurin17

# Set JAVA_HOME in ~/.zshrc or ~/.bash_profile
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH=$JAVA_HOME/bin:$PATH

# Verify installation
java -version
```

### Linux:
```bash
# Install Java 17
sudo apt update
sudo apt install openjdk-17-jdk

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Add to ~/.bashrc for persistence
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
```

## Quick Fix: Use EAS Cloud Build

The fastest solution is to use EAS cloud builds:

```bash
# Update EAS CLI
npm install -g eas-cli@latest

# Build on EAS servers (they have Java configured)
eas build --profile preview --platform android

# This avoids all local Java/Gradle setup issues
```

## Build Configuration Updates

I've updated your `eas.json` to use:
- **Latest build images** with Java pre-installed
- **Specific NDK version** for Android compatibility
- **Proper resource allocation** for reliable builds

## Recommended Workflow

1. **Development**: Use `npx expo start` for development
2. **Testing**: Use `eas build --profile preview` for APK testing
3. **Production**: Use `eas build --profile production` for store releases

This avoids all local environment issues and ensures consistent builds!