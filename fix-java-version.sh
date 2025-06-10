#!/bin/bash

# Fix Java Version for Android Development
echo "🔧 Fixing Java version for Android builds..."

# Check current Java version
CURRENT_JAVA=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
JAVA_MAJOR=$(echo "$CURRENT_JAVA" | cut -d'.' -f1)

echo "📋 Current Java version: $CURRENT_JAVA"
echo "📋 Major version: $JAVA_MAJOR"

if [[ "$JAVA_MAJOR" != "17" ]]; then
    echo "⚠️  Java 17 is required for reliable Android builds"
    echo "🔄 Current Java $JAVA_MAJOR may cause build issues"
    
    # Check if Java 17 is already installed
    if [[ -d "/usr/lib/jvm/java-17-openjdk-amd64" ]]; then
        echo "✅ Java 17 is already installed"
    else
        echo "📦 Installing Java 17..."
        sudo apt update
        sudo apt install -y openjdk-17-jdk
        
        if [[ $? -ne 0 ]]; then
            echo "❌ Failed to install Java 17"
            exit 1
        fi
        echo "✅ Java 17 installed successfully"
    fi
    
    # Configure Java 17 as default
    echo "🔧 Configuring Java 17 as default..."
    
    # Update alternatives
    sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-17-openjdk-amd64/bin/java 1700
    sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-17-openjdk-amd64/bin/javac 1700
    
    # Set as default (non-interactive)
    sudo update-alternatives --set java /usr/lib/jvm/java-17-openjdk-amd64/bin/java
    sudo update-alternatives --set javac /usr/lib/jvm/java-17-openjdk-amd64/bin/javac
    
    # Update JAVA_HOME for current session
    export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
    export PATH=$JAVA_HOME/bin:$PATH
    
    # Update shell configuration
    SHELL_RC="$HOME/.bashrc"
    if [[ -n "$ZSH_VERSION" ]]; then
        SHELL_RC="$HOME/.zshrc"
    fi
    
    # Remove old JAVA_HOME entries
    if [[ -f "$SHELL_RC" ]]; then
        grep -v "export JAVA_HOME" "$SHELL_RC" > "${SHELL_RC}.tmp" && mv "${SHELL_RC}.tmp" "$SHELL_RC"
    fi
    
    # Add new JAVA_HOME
    echo "" >> "$SHELL_RC"
    echo "# Java 17 for Android Development" >> "$SHELL_RC"
    echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" >> "$SHELL_RC"
    echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> "$SHELL_RC"
    
    echo "✅ Java 17 configured as default"
    
else
    echo "✅ Java 17 is already in use"
    export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
fi

# Verify the configuration
echo ""
echo "📋 Updated Java configuration:"
NEW_JAVA_VERSION=$(java -version 2>&1 | head -n 1)
echo "   Java version: $NEW_JAVA_VERSION"
echo "   JAVA_HOME: $JAVA_HOME"
echo "   Javac location: $(which javac)"

# Test javac
if javac -version >/dev/null 2>&1; then
    echo "   ✅ Java compiler (javac) is working"
else
    echo "   ❌ Java compiler (javac) is not working"
fi

# Check if Android environment is also set
if [[ -n "$ANDROID_HOME" ]]; then
    echo "   ✅ ANDROID_HOME: $ANDROID_HOME"
else
    echo "   ⚠️  ANDROID_HOME not set (run setup-linux-env.sh if needed)"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Restart your terminal or run: source ~/.bashrc"
echo "2. Verify Java version: java -version"
echo "3. Run the build again: ./local-build.sh"
echo ""
echo "🔄 If you have multiple terminals open, restart them all to use Java 17"
echo "✅ Java 17 setup complete!"

# Additional verification
echo ""
echo "🧪 Testing Java compiler capability..."
TEMP_JAVA_FILE="/tmp/TestJava.java"
cat > "$TEMP_JAVA_FILE" << 'EOF'
public class TestJava {
    public static void main(String[] args) {
        System.out.println("Java compiler test successful");
    }
}
EOF

if javac "$TEMP_JAVA_FILE" 2>/dev/null; then
    echo "✅ Java compiler test passed"
    rm -f /tmp/TestJava.java /tmp/TestJava.class
else
    echo "❌ Java compiler test failed"
fi