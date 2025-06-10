# Fix EAS Build Configuration - Step by Step

## The Problem
The "Invalid UUID appId" error occurs when your project isn't properly linked to an Expo project in their system.

## Solution Steps

### Step 1: Create a New Expo Project
```bash
# Initialize as a new Expo project
eas project:init
```

This will:
- Create a new project in your Expo account
- Generate a valid project ID
- Update your app.json automatically

### Step 2: Alternative - Manual Project Creation
If Step 1 doesn't work, try:

```bash
# Login first
eas login

# Create project manually
eas project:create
```

### Step 3: Verify Configuration
After running the init command, your `app.json` should be updated with:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-actual-project-id"
      }
    }
  }
}
```

### Step 4: Now Configure Builds
```bash
eas build:configure
```

## Complete Command Sequence

Run these commands in order:

```bash
# 1. Make sure you're logged in
eas login

# 2. Initialize the project (this fixes the UUID issue)
eas project:init

# 3. Configure builds
eas build:configure

# 4. Build preview
eas build --profile preview --platform android
```

## Troubleshooting

### If eas project:init fails:
```bash
# Try creating manually
eas project:create --name "Grade Tracker"
```

### If you get authentication errors:
```bash
# Re-login
eas logout
eas login
```

### If you want to use a different account:
```bash
# Check current user
eas whoami

# Switch accounts if needed
eas logout
eas login
```

## Important Notes

- The `projectId` will be automatically generated and added to your `app.json`
- This links your local project to Expo's build system
- Each Expo project needs a unique project ID
- The slug `"grade-tracker-mobile"` must be unique across all Expo projects

## After Successful Setup

Once the project is properly initialized, you can:
- Build development versions
- Build preview APKs
- Build production apps
- Submit to app stores