import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  useTheme,
  ActivityIndicator 
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { login, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Fehler', 'Bitte alle Felder ausfüllen');
      return;
    }

    try {
      await login(email, password);
      // Navigation will be handled by auth state change
    } catch (error: any) {
      Alert.alert(
        'Anmeldung fehlgeschlagen', 
        error.message || 'E-Mail oder Passwort falsch'
      );
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* App Title */}
        <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
            Noten Tracker
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Verwalte deine Schulnoten einfach und übersichtlich
          </Text>
        </View>

        {/* Login Form */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>
            <Text variant="headlineSmall" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Anmelden
            </Text>

            <TextInput
              label="E-Mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              style={styles.input}
              disabled={loading}
            />

            <TextInput
              label="Passwort"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              mode="outlined"
              style={styles.input}
              disabled={loading}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.onPrimary} />
              ) : (
                'Anmelden'
              )}
            </Button>

            <View style={styles.registerSection}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Noch kein Konto?
              </Text>
              <Button
                mode="text"
                onPress={handleRegister}
                disabled={loading}
                contentStyle={styles.textButtonContent}
              >
                Jetzt registrieren
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Features Preview */}
        <View style={styles.features}>
          <Text variant="titleMedium" style={[styles.featuresTitle, { color: theme.colors.onSurface }]}>
            Features
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
                📊 Übersichtliche Notenverwaltung
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
                📈 Automatische Durchschnittsberechnung
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
                🎯 Gewichtete Bewertungen
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
                ☁️ Cloud-Synchronisation
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  card: {
    borderRadius: 16,
    elevation: 2,
    marginBottom: 24,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  textButtonContent: {
    paddingVertical: 4,
  },
  registerSection: {
    alignItems: 'center',
    gap: 4,
  },
  features: {
    marginTop: 16,
  },
  featuresTitle: {
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    textAlign: 'center',
  },
});
