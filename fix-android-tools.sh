#!/bin/bash

# Fix Android SDK Tools Script
echo "🔧 Fixing missing Android SDK tools..."

# Check if ANDROID_HOME is set
if [[ -z "$ANDROID_HOME" ]]; then
    echo "❌ ANDROID_HOME not set. Please run setup-linux-env.sh first"
    exit 1
fi

echo "📁 ANDROID_HOME: $ANDROID_HOME"

# Create directory structure
echo "📁 Creating cmdline-tools directory..."
mkdir -p "$ANDROID_HOME/cmdline-tools"

# Check if tools already exist
if [[ -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]]; then
    echo "✅ Command line tools already installed"
    export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
else
    echo "📥 Downloading Android command line tools..."
    
    # Change to temp directory
    cd /tmp
    
    # Download latest command line tools for Linux
    TOOLS_URL="https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip"
    
    if command -v wget &> /dev/null; then
        wget -q --show-progress "$TOOLS_URL" -O commandlinetools-linux-latest.zip
    elif command -v curl &> /dev/null; then
        curl -# -L "$TOOLS_URL" -o commandlinetools-linux-latest.zip
    else
        echo "❌ Neither wget nor curl found. Please install one of them."
        exit 1
    fi
    
    if [[ $? -eq 0 && -f "commandlinetools-linux-latest.zip" ]]; then
        echo "📦 Extracting command line tools..."
        
        # Extract the zip file
        if command -v unzip &> /dev/null; then
            unzip -q commandlinetools-linux-latest.zip
        else
            echo "❌ unzip not found. Please install unzip: sudo apt install unzip"
            exit 1
        fi
        
        # Move to correct location
        if [[ -d "cmdline-tools" ]]; then
            mv cmdline-tools "$ANDROID_HOME/cmdline-tools/latest"
            echo "✅ Command line tools installed to: $ANDROID_HOME/cmdline-tools/latest"
        else
            echo "❌ Failed to extract command line tools properly"
            exit 1
        fi
        
        # Clean up
        rm -f commandlinetools-linux-latest.zip
    else
        echo "❌ Failed to download command line tools"
        echo "Please download manually from: https://developer.android.com/studio#command-tools"
        exit 1
    fi
fi

# Update PATH for current session
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

# Test if sdkmanager works
echo "🧪 Testing sdkmanager..."
if [[ -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]]; then
    echo "✅ sdkmanager found"
    
    # Make sure it's executable
    chmod +x "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager"
    
    # Test version
    "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --version
    
    if [[ $? -eq 0 ]]; then
        echo "✅ sdkmanager is working"
        
        # Accept licenses
        echo "📜 Accepting Android licenses..."
        yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --licenses 2>/dev/null
        
        # Install essential packages
        echo "📦 Installing essential Android SDK packages..."
        "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" \
            "platform-tools" \
            "platforms;android-34" \
            "build-tools;34.0.0" \
            "ndk;25.1.8937393"
        
        # Update PATH in shell configuration
        SHELL_RC="$HOME/.bashrc"
        if [[ -n "$ZSH_VERSION" ]]; then
            SHELL_RC="$HOME/.zshrc"
        fi
        
        # Add cmdline-tools to PATH if not already there
        if ! grep -q "cmdline-tools/latest/bin" "$SHELL_RC" 2>/dev/null; then
            echo "" >> "$SHELL_RC"
            echo "# Android Command Line Tools" >> "$SHELL_RC"
            echo 'export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH' >> "$SHELL_RC"
            echo "✅ Added cmdline-tools to PATH in $SHELL_RC"
        fi
        
        echo ""
        echo "🎉 Android SDK tools setup complete!"
        echo ""
        echo "📋 Summary:"
        echo "   ✅ Command line tools installed"
        echo "   ✅ Licenses accepted"
        echo "   ✅ Essential packages installed"
        echo "   ✅ PATH updated"
        echo ""
        echo "🔄 To apply PATH changes in new terminals:"
        echo "   source $SHELL_RC"
        echo ""
        echo "📱 Now you can run the local build script:"
        echo "   ./local-build.sh"
        
    else
        echo "❌ sdkmanager is not working properly"
        echo "Please install Android Studio and use its SDK Manager instead"
    fi
else
    echo "❌ sdkmanager not found after installation"
    echo "Please try installing Android Studio manually"
fi