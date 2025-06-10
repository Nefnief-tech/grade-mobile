# Copilot Instructions for German Grade Tracker Mobile App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a React Native Expo mobile application for tracking German school grades (1.0-6.0 scale).

## Key Technologies
- **React Native with Expo SDK**
- **Appwrite** for backend (authentication, database, storage)
- **NativeWind** for styling (Tailwind CSS for React Native)
- **React Navigation** for screen navigation
- **AsyncStorage** for offline data persistence
- **German localization** (all UI text in German)

## Design Guidelines
- **Glassmorphism UI**: Use translucent cards, blurred backgrounds, soft shadows
- **Color scheme**: Blue/purple gradients with white accents
- **Typography**: Modern sans-serif fonts
- **Support both light and dark themes**

## Database Schema (Appwrite)
1. **Subjects**: name, color, userId
2. **Grades**: subjectId, type, value (1.0-6.0), weight, semester, date, userId
3. **WeightSettings**: subjectId, gradeType, weight, userId

## German Grade Scale
- 1.0 = Sehr gut (Very Good)
- 2.0 = Gut (Good)
- 3.0 = Befriedigend (Satisfactory)
- 4.0 = Ausreichend (Sufficient)
- 5.0 = Mangelhaft (Poor)
- 6.0 = Ungenügend (Insufficient)

## File Structure
- `/src/components/` - Reusable UI components with glassmorphism styling
- `/src/screens/` - Main app screens
- `/src/appwrite/` - Appwrite client and API services
- `/src/utils/` - Grade calculation utilities and constants
- `/src/localization/` - German text constants

## Code Patterns
- Use TypeScript for type safety
- Implement proper error handling
- Use React hooks for state management
- Follow React Native best practices
- Maintain consistent glassmorphism styling across components
