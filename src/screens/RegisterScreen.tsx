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

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { register, loading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Fehler', 'Bitte alle Felder ausfüllen');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Fehler', 'Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Fehler', 'Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    try {
      await register(email, password, name);
      // Navigation will be handled by auth state change
    } catch (error: any) {
      Alert.alert(
        'Registrierung fehlgeschlagen', 
        error.message || 'Ein Fehler ist aufgetreten'
      );
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
            Registrierung
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Erstelle dein kostenloses Konto
          </Text>
        </View>

        {/* Registration Form */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>
            <Text variant="headlineSmall" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Neues Konto erstellen
            </Text>

            <TextInput
              label="Vollständiger Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              mode="outlined"
              style={styles.input}
              disabled={loading}
            />

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

            <TextInput
              label="Passwort bestätigen"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              mode="outlined"
              style={styles.input}
              disabled={loading}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />

            <Text variant="bodySmall" style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}>
              Das Passwort muss mindestens 6 Zeichen lang sein
            </Text>

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              disabled={loading || !name || !email || !password || !confirmPassword}
            >
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.onPrimary} />
              ) : (
                'Konto erstellen'
              )}
            </Button>

            <View style={styles.loginSection}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Bereits ein Konto?
              </Text>
              <Button
                mode="text"
                onPress={handleBackToLogin}
                disabled={loading}
                contentStyle={styles.textButtonContent}
              >
                Jetzt anmelden
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Privacy Notice */}
        <Card style={[styles.privacyCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>
            <Text variant="bodySmall" style={[styles.privacyText, { color: theme.colors.onSurfaceVariant }]}>
              Mit der Registrierung stimmst du unseren Nutzungsbedingungen zu. 
              Deine Daten werden sicher verschlüsselt und nur für die App-Funktionalität verwendet.
            </Text>
          </Card.Content>
        </Card>
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
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  hint: {
    marginBottom: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  textButtonContent: {
    paddingVertical: 4,
  },
  loginSection: {
    alignItems: 'center',
    gap: 4,
  },
  privacyCard: {
    borderRadius: 12,
    elevation: 1,
  },
  privacyText: {
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
});
