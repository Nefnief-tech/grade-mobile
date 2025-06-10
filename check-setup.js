#!/usr/bin/env node

/**
 * EAS Setup Checker
 * Validates your Expo/EAS configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking EAS Setup...\n');

// Check if app.json exists
const appJsonPath = path.join(process.cwd(), 'app.json');
if (!fs.existsSync(appJsonPath)) {
  console.log('❌ app.json not found');
  process.exit(1);
}

// Read app.json
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

console.log('📱 App Configuration:');
console.log(`   Name: ${appJson.expo?.name || 'Not set'}`);
console.log(`   Slug: ${appJson.expo?.slug || 'Not set'}`);
console.log(`   Version: ${appJson.expo?.version || 'Not set'}`);

// Check for project ID
const projectId = appJson.expo?.extra?.eas?.projectId;
if (projectId && projectId !== 'your-project-id-here') {
  console.log(`✅ Project ID: ${projectId}`);
} else {
  console.log('❌ Project ID: Not set or placeholder');
  console.log('   Run: eas project:init');
}

// Check eas.json
const easJsonPath = path.join(process.cwd(), 'eas.json');
if (fs.existsSync(easJsonPath)) {
  console.log('✅ eas.json exists');
  
  const easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));
  console.log(`   CLI Version: ${easJson.cli?.version || 'Not specified'}`);
  
  const profiles = Object.keys(easJson.build || {});
  console.log(`   Build Profiles: ${profiles.join(', ') || 'None'}`);
} else {
  console.log('⚠️  eas.json not found');
}

// Check package.json dependencies
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  console.log('\n🔒 GDPR Dependencies:');
  const cryptoJs = packageJson.dependencies?.['crypto-js'];
  const secureStore = packageJson.dependencies?.['expo-secure-store'];
  
  console.log(`   crypto-js: ${cryptoJs ? '✅ ' + cryptoJs : '❌ Not installed'}`);
  console.log(`   expo-secure-store: ${secureStore ? '✅ ' + secureStore : '❌ Not installed'}`);
  
  if (!cryptoJs || !secureStore) {
    console.log('\n   Install missing dependencies:');
    console.log('   npm install crypto-js expo-secure-store');
  }
}

console.log('\n🚀 Next Steps:');
if (!projectId || projectId === 'your-project-id-here') {
  console.log('1. Run: eas project:init');
  console.log('2. Run: eas build:configure');
} else {
  console.log('1. Run: eas build:configure (if not done)');
  console.log('2. Run: eas build --profile preview --platform android');
}

console.log('\n📚 Your German Grade Tracker setup status checked!');