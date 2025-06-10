import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MaterialDarkTheme } from './materialTheme';

interface MaterialThemeProviderProps {
  children: React.ReactNode;
}

export const MaterialThemeProvider: React.FC<MaterialThemeProviderProps> = ({
  children,
}) => {
  return (
    <PaperProvider theme={MaterialDarkTheme}>
      <StatusBar style="light" backgroundColor={MaterialDarkTheme.colors.background} />
      {children}
    </PaperProvider>
  );
};

export default MaterialThemeProvider;
