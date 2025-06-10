# Noten Tracker - German Grade Tracker Mobile App

A React Native Expo mobile application for tracking German school grades (1.0-6.0 scale) with a beautiful glassmorphism UI.

## Features

- **Authentication**: Secure user login and registration with Appwrite
- **Grade Management**: Add, view, and track grades across subjects
- **Subject Organization**: Create and manage subjects with color coding
- **Grade Calculations**: Automatic calculation of weighted and unweighted averages
- **Glassmorphism UI**: Modern translucent design with blur effects
- **German Localization**: All UI text in German
- **Offline Support**: Data persistence with AsyncStorage and sync capabilities
- **German Grade Scale**: Full support for 1.0-6.0 grading system

## Technology Stack

- **Frontend**: React Native with Expo SDK
- **Backend**: Appwrite (authentication, database, storage)
- **Styling**: NativeWind (Tailwind CSS for React Native) with glassmorphism effects
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Offline Storage**: AsyncStorage
- **Notifications**: Expo Notifications
- **PDF Export**: Expo Print & Sharing
- **Calendar**: Expo Calendar

## German Grade Scale

- 1.0 = Sehr gut (Very Good)
- 2.0 = Gut (Good) 
- 3.0 = Befriedigend (Satisfactory)
- 4.0 = Ausreichend (Sufficient)
- 5.0 = Mangelhaft (Poor)
- 6.0 = Ungenügend (Insufficient)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grade-tracker-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Appwrite**
   - Create an Appwrite project
   - Update `src/appwrite/config.ts` with your Appwrite configuration
   - Set up the database collections according to the schema

4. **Start the development server**
   ```bash
   npm start
   ```

## Appwrite Configuration

### Database Schema

#### Collections:

1. **Subjects**
   - `name` (string): Subject name
   - `color` (string): Hex color code
   - `userId` (string): User reference

2. **Grades** 
   - `subjectId` (string): Subject reference
   - `type` (string): Grade type (Klausur, Hausaufgabe, etc.)
   - `value` (number): Grade value (1.0-6.0)
   - `weight` (number): Grade weight (0.1-1.0)
   - `semester` (string): Semester
   - `date` (string): ISO date string
   - `userId` (string): User reference

3. **WeightSettings**
   - `subjectId` (string): Subject reference
   - `gradeType` (string): Grade type
   - `weight` (number): Default weight
   - `userId` (string): User reference

### Permissions
Configure document-level permissions for user data security.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── GlassCard.tsx   # Glassmorphism card component
│   ├── GlassButton.tsx # Glassmorphism button component
│   ├── GlassInput.tsx  # Glassmorphism input component
│   └── GlassPicker.tsx # Glassmorphism picker component
├── screens/            # Application screens
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── OverviewScreen.tsx
│   ├── AddGradeScreen.tsx
│   └── AddSubjectScreen.tsx
├── appwrite/           # Appwrite client and services
│   ├── client.ts       # Appwrite client configuration
│   ├── auth.ts         # Authentication service
│   └── database.ts     # Database service
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── utils/              # Utility functions
│   ├── gradeCalculations.ts  # Grade calculation functions
│   └── offlineStorage.ts     # Offline storage utilities
├── localization/       # German text constants
│   ├── de.ts
│   ├── german.ts
│   └── index.ts
└── types/              # TypeScript type definitions
    └── index.ts
```

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator  
- `npm run web` - Run in web browser

### Design Guidelines

- **Glassmorphism**: Translucent cards with blur effects and soft shadows
- **Color Scheme**: Blue/purple gradients with white accents
- **Typography**: Modern sans-serif fonts
- **Responsive**: Supports various screen sizes
- **Accessibility**: Proper contrast ratios and touch targets

## Features In Development

- [ ] PDF export functionality
- [ ] Calendar integration with exam reminders
- [ ] Push notifications
- [ ] Subject-specific weight settings
- [ ] Grade statistics and charts
- [ ] Dark/light theme switching
- [ ] Data backup and restore

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

# Fixed Bundling Error

## Issue Resolved
- ✅ Created missing German localization file (`src/localization/german.ts`)
- ✅ Added comprehensive German text constants
- ✅ Created localization index file for better organization

## Files Added
1. `src/localization/german.ts` - Complete German text constants
2. `src/localization/index.ts` - Localization exports

The bundling error should now be resolved. The app can be started with `npx expo start`.
