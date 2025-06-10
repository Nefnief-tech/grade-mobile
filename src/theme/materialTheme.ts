import { MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Simplified Material Dark Theme
export const MaterialDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    onPrimary: '#1A1A1A',
    primaryContainer: '#5D2D91',
    onPrimaryContainer: '#E1C4FF',
    
    secondary: '#03DAC6',
    onSecondary: '#1A1A1A',
    secondaryContainer: '#005048',
    onSecondaryContainer: '#B3FAF1',
    
    tertiary: '#FF6B35',
    onTertiary: '#1A1A1A',
    tertiaryContainer: '#693C00',
    onTertiaryContainer: '#FFD8CC',
    
    error: '#CF6679',
    onError: '#1A1A1A',
    errorContainer: '#8C1D18',
    onErrorContainer: '#F9DEDC',
    
    background: '#0F0F0F',
    onBackground: '#E6E6E6',
    surface: '#121212',
    onSurface: '#E6E6E6',
    surfaceVariant: '#2A2A2A',
    onSurfaceVariant: '#C7C7C7',
    
    outline: '#8C8C8C',
    outlineVariant: '#4A4A4A',
    
    inverseSurface: '#E6E6E6',
    inverseOnSurface: '#1A1A1A',
    inversePrimary: '#5D2D91',
    
    shadow: '#000000',
    scrim: '#000000',
    surfaceDisabled: '#E6E6E61F',
    onSurfaceDisabled: '#E6E6E661',
    backdrop: '#00000040',
    
    elevation: {
      level0: 'transparent',
      level1: '#1A1A1A',
      level2: '#1E1E1E',
      level3: '#2A2A2A',
      level4: '#2A2A2A',
      level5: '#363636',
    },
  },
};
