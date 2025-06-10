import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { MaterialDarkTheme } from './src/theme/materialTheme';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Import all screens
import { Material3OverviewScreen } from './src/screens/Material3OverviewScreen';
import { AddGradeScreen } from './src/screens/AddGradeScreen';
import MaterialDetailsScreen from './src/screens/MaterialDetailsScreen';
import MaterialSettingsScreen from './src/screens/MaterialSettingsScreen';
import { AddSubjectScreen } from './src/screens/AddSubjectScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// Authentication Stack
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// Main tabs navigation (authenticated)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: MaterialDarkTheme.colors.surface,
          borderTopColor: MaterialDarkTheme.colors.outline,
          borderTopWidth: 1,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarActiveTintColor: MaterialDarkTheme.colors.primary,
        tabBarInactiveTintColor: MaterialDarkTheme.colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Overview"
        component={Material3OverviewScreen}
        options={{
          tabBarLabel: 'Übersicht',
          tabBarIcon: ({ color, size }) => (
            <Icon name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={MaterialSettingsScreen}
        options={{
          tabBarLabel: 'Einstellungen',
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Stack navigation for authenticated users
function AppStack() {
  return (
    <Stack.Navigator 
      initialRouteName="MainTabs"
      screenOptions={{ 
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="AddGrade" 
        component={AddGradeScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Note hinzufügen',
          headerStyle: {
            backgroundColor: MaterialDarkTheme.colors.surface,
          },
          headerTintColor: MaterialDarkTheme.colors.onSurface,
        }}
      />
      <Stack.Screen 
        name="AddSubject" 
        component={AddSubjectScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Fach hinzufügen',
          headerStyle: {
            backgroundColor: MaterialDarkTheme.colors.surface,
          },
          headerTintColor: MaterialDarkTheme.colors.onSurface,
        }}
      />
      <Stack.Screen 
        name="Details" 
        component={MaterialDetailsScreen}
        options={{
          presentation: 'card',
          headerShown: true,
          headerTitle: 'Fach Details',
          headerStyle: {
            backgroundColor: MaterialDarkTheme.colors.surface,
          },
          headerTintColor: MaterialDarkTheme.colors.onSurface,
        }}
      />
    </Stack.Navigator>
  );
}

// Loading screen component
function LoadingScreen() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: MaterialDarkTheme.colors.background 
    }}>
      <ActivityIndicator size="large" color={MaterialDarkTheme.colors.primary} />
      <Text style={{ 
        marginTop: 16, 
        color: MaterialDarkTheme.colors.onSurface 
      }}>
        Lade App...
      </Text>
    </View>
  );
}

// Navigation based on auth state
function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={MaterialDarkTheme}>
        <SafeAreaProvider>
          <StatusBar style="light" translucent />
          <AppNavigator />
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
