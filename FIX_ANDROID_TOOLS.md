# Fix for Missing Android SDK Tools

## The Problem
The Android SDK structure has changed. The old `tools` directory is no longer included by default with Android Studio. The `sdkmanager` is now located in `cmdline-tools`.

## Solution: Install Android Command Line Tools

### Option 1: Download Command Line Tools Manually

```bash
# 1. Create cmdline-tools directory
mkdir -p $ANDROID_HOME/cmdline-tools

# 2. Download latest command line tools
cd /tmp
wget https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip

# 3. Extract to correct location
unzip commandlinetools-linux-*_latest.zip
mv cmdline-tools $ANDROID_HOME/cmdline-tools/latest

# 4. Update PATH to use new location
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH

# 5. Now sdkmanager should work
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --version
```

### Option 2: Install via Android Studio

1. Open Android Studio
2. Go to **Tools** → **SDK Manager**
3. In **SDK Tools** tab, check **Android SDK Command-line Tools (latest)**
4. Click **Apply** and **OK**

### Option 3: Quick Setup Script

```bash
# Quick fix script
#!/bin/bash

echo "🔧 Fixing Android SDK tools..."

# Check if ANDROID_HOME is set
if [[ -z "$ANDROID_HOME" ]]; then
    echo "❌ ANDROID_HOME not set"
    exit 1
fi

# Create cmdline-tools directory
mkdir -p "$ANDROID_HOME/cmdline-tools"

# Download and install command line tools
cd /tmp
echo "📥 Downloading Android command line tools..."
wget -q https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip

if [[ $? -eq 0 ]]; then
    echo "📦 Extracting command line tools..."
    unzip -q commandlinetools-linux-*_latest.zip
    
    # Move to correct location
    if [[ -d "cmdline-tools" ]]; then
        mv cmdline-tools "$ANDROID_HOME/cmdline-tools/latest"
        echo "✅ Command line tools installed"
        
        # Update PATH
        export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
        
        # Test sdkmanager
        if [[ -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]]; then
            echo "✅ sdkmanager found at: $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager"
            
            # Accept licenses
            echo "📜 Accepting Android licenses..."
            yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
            
            # Install required packages
            echo "📦 Installing required SDK packages..."
            $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
            
            echo "🎉 Android SDK setup complete!"
        else
            echo "❌ sdkmanager still not found"
        fi
    else
        echo "❌ Failed to extract command line tools"
    fi
else
    echo "❌ Failed to download command line tools"
    echo "Please download manually from: https://developer.android.com/studio#command-tools"
fi

# Clean up
rm -f /tmp/commandlinetools-linux-*_latest.zip
```

## Updated Environment Variables

Add the new command line tools path to your environment:

```bash
# Add to ~/.bashrc or ~/.zshrc
echo 'export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH' >> ~/.bashrc

# Reload
source ~/.bashrc
```

## Test the Fix

```bash
# Test if sdkmanager works
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --version

# List installed packages
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --list_installed

# Accept licenses
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
```

## Alternative: Use Android Studio SDK Manager

If command line doesn't work, use Android Studio's GUI:

1. **Install Android Studio** if not already installed
2. **Open Android Studio**
3. **Go to Settings** → **Appearance & Behavior** → **System Settings** → **Android SDK**
4. **Install required components:**
   - Android 14 (API 34)
   - Android SDK Build-Tools 34
   - Android SDK Command-line Tools
   - Android SDK Platform-Tools
   - NDK (Side by side) - latest version

This is often the most reliable method for getting everything set up correctly.