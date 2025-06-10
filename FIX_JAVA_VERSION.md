# Fix Java Version Compatibility Issue

## The Problem
Your Java 21 installation doesn't provide the required `JAVA_COMPILER` capability that Gradle needs for Android builds. React Native/Android builds work best with Java 17 (LTS).

Error: `Toolchain installation '/usr/lib/jvm/java-21-openjdk-amd64' does not provide the required capabilities: [JAVA_COMPILER]`

## Solution: Install and Use Java 17

### Option 1: Install Java 17 alongside Java 21

```bash
# Install Java 17 (recommended for Android development)
sudo apt update
sudo apt install openjdk-17-jdk

# Verify installation
java -version
javac -version

# List available Java versions
sudo update-alternatives --config java
sudo update-alternatives --config javac
```

### Option 2: Use SDKMAN to manage Java versions

```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Install Java 17
sdk install java 17.0.9-tem

# Use Java 17 as default
sdk default java 17.0.9-tem

# Or use for current session only
sdk use java 17.0.9-tem
```

### Option 3: Quick Fix Script

```bash
#!/bin/bash

echo "🔧 Fixing Java version for Android builds..."

# Check current Java version
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
echo "Current Java version: $JAVA_VERSION"

if [[ "$JAVA_VERSION" != "17" ]]; then
    echo "⚠️  Java 17 is recommended for Android builds"
    
    # Check if Java 17 is available
    if dpkg -l | grep -q openjdk-17-jdk; then
        echo "✅ Java 17 is already installed"
        
        # Update alternatives to use Java 17
        echo "🔄 Switching to Java 17..."
        sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-17-openjdk-amd64/bin/java 1700
        sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-17-openjdk-amd64/bin/javac 1700
        
        # Set as default
        sudo update-alternatives --set java /usr/lib/jvm/java-17-openjdk-amd64/bin/java
        sudo update-alternatives --set javac /usr/lib/jvm/java-17-openjdk-amd64/bin/javac
        
        # Update JAVA_HOME
        export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
        
        # Update shell configuration
        SHELL_RC="$HOME/.bashrc"
        if [[ -n "$ZSH_VERSION" ]]; then
            SHELL_RC="$HOME/.zshrc"
        fi
        
        # Remove old JAVA_HOME and add new one
        sed -i '/export JAVA_HOME/d' "$SHELL_RC"
        echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" >> "$SHELL_RC"
        
        echo "✅ Switched to Java 17"
        java -version
        
    else
        echo "📦 Installing Java 17..."
        sudo apt update
        sudo apt install -y openjdk-17-jdk
        
        if [[ $? -eq 0 ]]; then
            echo "✅ Java 17 installed successfully"
            
            # Set as default
            sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-17-openjdk-amd64/bin/java 1700
            sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-17-openjdk-amd64/bin/javac 1700
            sudo update-alternatives --set java /usr/lib/jvm/java-17-openjdk-amd64/bin/java
            sudo update-alternatives --set javac /usr/lib/jvm/java-17-openjdk-amd64/bin/javac
            
            # Update JAVA_HOME
            export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
            
            # Update shell configuration
            SHELL_RC="$HOME/.bashrc"
            if [[ -n "$ZSH_VERSION" ]]; then
                SHELL_RC="$HOME/.zshrc"
            fi
            
            sed -i '/export JAVA_HOME/d' "$SHELL_RC"
            echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" >> "$SHELL_RC"
            
            echo "✅ Java 17 configured as default"
        else
            echo "❌ Failed to install Java 17"
            exit 1
        fi
    fi
else
    echo "✅ Java 17 is already in use"
fi

echo ""
echo "📋 Current Java configuration:"
echo "   Java version: $(java -version 2>&1 | head -n 1)"
echo "   JAVA_HOME: $JAVA_HOME"
echo "   Javac: $(which javac)"
echo ""
echo "🔄 Please restart your terminal or run: source ~/.bashrc"
echo "📱 Then try the build again: ./local-build.sh"
```

## Manual Commands

If you prefer to do it manually:

```bash
# 1. Install Java 17
sudo apt update
sudo apt install openjdk-17-jdk

# 2. Set Java 17 as default
sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-17-openjdk-amd64/bin/java 1700
sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-17-openjdk-amd64/bin/javac 1700
sudo update-alternatives --set java /usr/lib/jvm/java-17-openjdk-amd64/bin/java
sudo update-alternatives --set javac /usr/lib/jvm/java-17-openjdk-amd64/bin/javac

# 3. Update JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" >> ~/.bashrc

# 4. Reload configuration
source ~/.bashrc

# 5. Verify the change
java -version
echo $JAVA_HOME
```

## Why Java 17?

- ✅ **LTS (Long Term Support)** version
- ✅ **React Native compatible** - officially supported
- ✅ **Android Gradle Plugin** works reliably
- ✅ **Provides JAVA_COMPILER** capability
- ✅ **Stable and well-tested** for mobile development

Java 21 is newer but may have compatibility issues with React Native toolchain.