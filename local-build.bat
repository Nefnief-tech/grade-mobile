@echo off
REM Local Build Script for German Grade Tracker (Windows)
echo 🔧 Local Build Setup for German Grade Tracker (Windows)

REM Check Java
echo 🔍 Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java not found. Please install JDK 17.
    echo Download from: https://docs.microsoft.com/en-us/java/openjdk/download#openjdk-17
    pause
    exit /b 1
)
echo ✅ Java found

REM Check JAVA_HOME
if "%JAVA_HOME%"=="" (
    echo ⚠️  JAVA_HOME not set
    echo Please set JAVA_HOME environment variable
    pause
    exit /b 1
) else (
    echo ✅ JAVA_HOME set: %JAVA_HOME%
)

REM Check Android SDK
if "%ANDROID_HOME%"=="" (
    echo ❌ ANDROID_HOME not set
    echo Please install Android Studio and set ANDROID_HOME
    pause
    exit /b 1
) else (
    echo ✅ ANDROID_HOME set: %ANDROID_HOME%
)

REM Check if ADB exists
if not exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    echo ❌ Android SDK not properly installed
    echo Please install Android SDK Platform-Tools
    pause
    exit /b 1
)
echo ✅ Android SDK found

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js found

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Install crypto dependencies
echo 📦 Checking GDPR crypto dependencies...
npm install crypto-js expo-secure-store

REM Show build options
echo.
echo 🚀 Choose local build option:
echo 1. Development build (debug APK)
echo 2. Preview build (release APK)  
echo 3. Production build (App Bundle)
echo 4. Run on device/emulator
echo 5. Start development server only
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" (
    echo 🔨 Building development APK locally...
    eas build --profile development --platform android --local
) else if "%choice%"=="2" (
    echo 📱 Building preview APK locally...
    eas build --profile preview --platform android --local
) else if "%choice%"=="3" (
    echo 🏪 Building production App Bundle locally...
    eas build --profile production --platform android --local
) else if "%choice%"=="4" (
    echo 📱 Running on device/emulator...
    npx expo run:android
) else if "%choice%"=="5" (
    echo 🖥️  Starting development server...
    npx expo start
) else (
    echo ❌ Invalid choice
    pause
    exit /b 1
)

echo.
echo ✅ Local build process completed!
echo 🎉 Your German Grade Tracker with GDPR encryption is ready!
pause