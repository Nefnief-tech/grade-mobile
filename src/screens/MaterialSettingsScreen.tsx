import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Text, 
  Switch, 
  Card, 
  Button, 
  useTheme,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

interface MaterialSettingsScreenProps {
  navigation: any;
}

const MaterialSettingsScreen: React.FC<MaterialSettingsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { logout, user, loading } = useAuth();
  
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abmelden',
          style: 'destructive',
          onPress: async () => {
            try {
              setLogoutLoading(true);
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            } finally {
              setLogoutLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            Einstellungen
          </Text>
          {user && (
            <Text variant="bodyMedium" style={[styles.userInfo, { color: theme.colors.onSurfaceVariant }]}>
              Angemeldet als: {user.name}
            </Text>
          )}
        </View>

        {/* Quick Actions Section */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Schnellaktionen
            </Text>

            <View style={styles.actionGrid}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('AddSubject')}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                icon="book-plus"
              >
                Fach hinzufügen
              </Button>

              <Button
                mode="outlined"
                onPress={() => navigation.navigate('AddGrade')}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                icon="plus"
              >
                Note hinzufügen
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* App Settings Section */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              App-Einstellungen
            </Text>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>                <Text variant="bodyLarge" style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                  Dunkler Modus
                </Text>
                <Text variant="bodyMedium" style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Verwende dunkles Design
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                thumbColor={darkMode ? theme.colors.primary : theme.colors.outline}
                trackColor={{
                  false: theme.colors.surfaceVariant,
                  true: theme.colors.primaryContainer,
                }}
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>                <Text variant="bodyLarge" style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                  Benachrichtigungen
                </Text>
                <Text variant="bodyMedium" style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Erhalte Erinnerungen für Prüfungen
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                thumbColor={notifications ? theme.colors.primary : theme.colors.outline}
                trackColor={{
                  false: theme.colors.surfaceVariant,
                  true: theme.colors.primaryContainer,
                }}
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>                <Text variant="bodyLarge" style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                  Auto-Backup
                </Text>
                <Text variant="bodyMedium" style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Automatische Cloud-Sicherung
                </Text>
              </View>
              <Switch
                value={autoBackup}
                onValueChange={setAutoBackup}
                thumbColor={autoBackup ? theme.colors.primary : theme.colors.outline}
                trackColor={{
                  false: theme.colors.surfaceVariant,
                  true: theme.colors.primaryContainer,
                }}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Data Management Section */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Daten verwalten
            </Text>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>                <Text variant="bodyLarge" style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                  Daten exportieren
                </Text>
                <Text variant="bodyMedium" style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Noten als CSV-Datei exportieren
                </Text>
              </View>
              <Button
                mode="outlined"
                onPress={() => console.log('Export data')}
                icon="download"
                compact
              >
                Export
              </Button>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>                <Text variant="bodyLarge" style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                  Daten importieren
                </Text>
                <Text variant="bodyMedium" style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Noten aus CSV-Datei importieren
                </Text>
              </View>
              <Button
                mode="outlined"
                onPress={() => console.log('Import data')}
                icon="upload"
                compact
              >
                Import
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Account Section */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Konto
            </Text>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>                <Text variant="bodyLarge" style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                  Abmelden
                </Text>
                <Text variant="bodyMedium" style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Aus dem aktuellen Konto abmelden
                </Text>
              </View>
              <Button
                mode="outlined"
                onPress={handleLogout}
                icon="logout"
                compact
                disabled={logoutLoading}
                buttonColor={theme.colors.errorContainer}
                textColor={theme.colors.onErrorContainer}
              >
                {logoutLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.onErrorContainer} />
                ) : (
                  'Abmelden'
                )}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* App Info */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              App-Information
            </Text>
            
            <View style={styles.infoSection}>
              <Text variant="bodyMedium" style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                Noten Tracker v1.0.0
              </Text>
              <Text variant="bodySmall" style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                Deutsche Notenverwaltung für Schüler
              </Text>
              <Text variant="bodySmall" style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                © 2024 Noten Tracker
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
  },
  userInfo: {
    opacity: 0.7,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 64,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 16,
  },
  divider: {
    marginVertical: 8,
    opacity: 0.3,
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 32,
  },
});

export default MaterialSettingsScreen;
