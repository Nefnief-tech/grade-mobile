#!/bin/bash

# Quick Environment Setup for Linux
echo "🐧 Setting up Java and Android environment variables for Linux..."

# Function to detect shell
detect_shell() {
    if [[ -n "$ZSH_VERSION" ]]; then
        echo "zsh"
    elif [[ -n "$BASH_VERSION" ]]; then
        echo "bash"
    else
        echo "bash"  # Default to bash
    fi
}

SHELL_TYPE=$(detect_shell)
if [[ "$SHELL_TYPE" == "zsh" ]]; then
    RC_FILE="$HOME/.zshrc"
else
    RC_FILE="$HOME/.bashrc"
fi

echo "📝 Detected shell: $SHELL_TYPE"
echo "📄 Configuration file: $RC_FILE"

# Step 1: Set JAVA_HOME
echo "☕ Setting up JAVA_HOME..."

# Find Java installation
JAVA_PATH=$(which java 2>/dev/null)
if [[ -z "$JAVA_PATH" ]]; then
    echo "❌ Java not found. Please install OpenJDK first:"
    echo "   sudo apt update && sudo apt install openjdk-17-jdk"
    exit 1
fi

# Get the actual Java home directory
JAVA_REAL_PATH=$(readlink -f "$JAVA_PATH")
JAVA_HOME_PATH=$(dirname $(dirname "$JAVA_REAL_PATH"))

echo "🔍 Found Java at: $JAVA_REAL_PATH"
echo "🏠 Setting JAVA_HOME to: $JAVA_HOME_PATH"

# Step 2: Set ANDROID_HOME
echo "🤖 Setting up ANDROID_HOME..."
ANDROID_HOME_PATH="$HOME/Android/Sdk"

# Create Android SDK directory if it doesn't exist
mkdir -p "$ANDROID_HOME_PATH"
echo "📁 Android SDK directory: $ANDROID_HOME_PATH"

# Step 3: Check if variables are already in RC file
echo "📝 Updating shell configuration..."

# Remove old entries (if any)
if [[ -f "$RC_FILE" ]]; then
    grep -v "JAVA_HOME" "$RC_FILE" > "${RC_FILE}.tmp" && mv "${RC_FILE}.tmp" "$RC_FILE"
    grep -v "ANDROID_HOME" "$RC_FILE" > "${RC_FILE}.tmp" && mv "${RC_FILE}.tmp" "$RC_FILE"
    grep -v "Android/Sdk" "$RC_FILE" > "${RC_FILE}.tmp" && mv "${RC_FILE}.tmp" "$RC_FILE"
fi

# Add new environment variables
echo "" >> "$RC_FILE"
echo "# Android Development Environment" >> "$RC_FILE"
echo "export JAVA_HOME=\"$JAVA_HOME_PATH\"" >> "$RC_FILE"
echo "export ANDROID_HOME=\"$ANDROID_HOME_PATH\"" >> "$RC_FILE"
echo "export ANDROID_SDK_ROOT=\"\$ANDROID_HOME\"" >> "$RC_FILE"
echo "export PATH=\"\$ANDROID_HOME/emulator:\$PATH\"" >> "$RC_FILE"
echo "export PATH=\"\$ANDROID_HOME/tools:\$PATH\"" >> "$RC_FILE"
echo "export PATH=\"\$ANDROID_HOME/tools/bin:\$PATH\"" >> "$RC_FILE"
echo "export PATH=\"\$ANDROID_HOME/platform-tools:\$PATH\"" >> "$RC_FILE"

# Step 4: Export for current session
export JAVA_HOME="$JAVA_HOME_PATH"
export ANDROID_HOME="$ANDROID_HOME_PATH"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/emulator:$PATH"
export PATH="$ANDROID_HOME/tools:$PATH"
export PATH="$ANDROID_HOME/tools/bin:$PATH"
export PATH="$ANDROID_HOME/platform-tools:$PATH"

echo "✅ Environment variables set!"
echo ""
echo "📋 Current settings:"
echo "   JAVA_HOME: $JAVA_HOME"
echo "   ANDROID_HOME: $ANDROID_HOME"
echo ""
echo "🔄 To apply changes in new terminals, run:"
echo "   source $RC_FILE"
echo ""
echo "📱 Next steps:"
echo "1. Download and install Android Studio: https://developer.android.com/studio"
echo "2. Open Android Studio and complete the setup wizard"
echo "3. Install required SDK components (API 34, Build Tools, etc.)"
echo "4. Accept Android licenses: \$ANDROID_HOME/tools/bin/sdkmanager --licenses"
echo "5. Run the local build script again: ./local-build.sh"
echo ""
echo "🎉 Setup complete! Restart your terminal or run 'source $RC_FILE'"