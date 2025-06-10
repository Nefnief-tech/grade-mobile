# Quick Setup Guide for Linux Environment

## Your Current Status:
- ✅ Java 21 is installed (compatible with Android development)
- ❌ JAVA_HOME not set
- ❌ ANDROID_HOME not set

## Step 1: Set JAVA_HOME

Find your Java installation path and set JAVA_HOME:

```bash
# Find Java installation path
which java
# Output might be: /usr/bin/java

# Find the actual JAVA_HOME path
readlink -f $(which java)
# Output might be: /usr/lib/jvm/java-21-openjdk-amd64/bin/java

# Extract JAVA_HOME (remove /bin/java from the end)
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

# Verify it's set correctly
echo $JAVA_HOME
```

## Step 2: Install Android Studio and SDK

```bash
# Option 1: Download Android Studio manually
# Go to: https://developer.android.com/studio
# Download and extract to ~/android-studio

# Option 2: Install via Snap (if available)
sudo snap install android-studio --classic

# Option 3: Install via Flatpak
flatpak install flathub com.google.AndroidStudio
```

## Step 3: Set ANDROID_HOME

After installing Android Studio:

```bash
# Android SDK is typically installed here:
export ANDROID_HOME=$HOME/Android/Sdk
# or sometimes here:
# export ANDROID_HOME=$HOME/.android/sdk

# Add Android tools to PATH
export PATH=$ANDROID_HOME/emulator:$PATH
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/tools/bin:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

## Step 4: Make Changes Permanent

Add to your shell configuration file:

```bash
# For bash users (edit ~/.bashrc)
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/emulator:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/tools:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/tools/bin:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/platform-tools:$PATH' >> ~/.bashrc

# For zsh users (edit ~/.zshrc)
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.zshrc
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.zshrc
echo 'export PATH=$ANDROID_HOME/emulator:$PATH' >> ~/.zshrc
echo 'export PATH=$ANDROID_HOME/tools:$PATH' >> ~/.zshrc
echo 'export PATH=$ANDROID_HOME/tools/bin:$PATH' >> ~/.zshrc
echo 'export PATH=$ANDROID_HOME/platform-tools:$PATH' >> ~/.zshrc

# Reload your shell configuration
source ~/.bashrc  # or source ~/.zshrc
```

## Step 5: Install Android SDK Components

Open Android Studio and install:
- Android SDK Platform 34
- Android SDK Build-Tools 34.0.0
- Android SDK Command-line Tools
- Android SDK Platform-Tools
- Android Emulator
- NDK (Side by side) 25.1.8937393

Or via command line:
```bash
# Accept licenses first
$ANDROID_HOME/tools/bin/sdkmanager --licenses

# Install required components
$ANDROID_HOME/tools/bin/sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;25.1.8937393"
```

## Quick Setup Commands (Run These)

```bash
# 1. Find and set JAVA_HOME
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
echo "JAVA_HOME set to: $JAVA_HOME"

# 2. Set ANDROID_HOME (create directory if needed)
mkdir -p $HOME/Android/Sdk
export ANDROID_HOME=$HOME/Android/Sdk

# 3. Add to PATH
export PATH=$ANDROID_HOME/emulator:$PATH
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/tools/bin:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH

# 4. Make permanent (choose bash or zsh)
echo "export JAVA_HOME=$JAVA_HOME" >> ~/.bashrc
echo "export ANDROID_HOME=$ANDROID_HOME" >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/emulator:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/tools:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/tools/bin:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/platform-tools:$PATH' >> ~/.bashrc

# 5. Reload configuration
source ~/.bashrc

# 6. Verify setup
echo "JAVA_HOME: $JAVA_HOME"
echo "ANDROID_HOME: $ANDROID_HOME"
```

## After Setup

1. **Install Android Studio** from https://developer.android.com/studio
2. **Open Android Studio** and complete the setup wizard
3. **Install SDK components** as listed above
4. **Run the local build script again**: `./local-build.sh`

The script should then show ✅ for both JAVA_HOME and ANDROID_HOME!