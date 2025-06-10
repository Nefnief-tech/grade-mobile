import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassButton } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { TEXTS } from '../localization/de';
import { PDFExportService } from '../utils/pdfExport';
import { NotificationService } from '../utils/notificationService';
import { CalendarService } from '../utils/calendarService';
import { DatabaseService } from '../appwrite/database';
import { Subject, Grade, GradeStatistics, CalendarEvent } from '../types';
import { calculateAverage } from '../utils/gradeCalculations';

export const SettingsScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);
  const checkNotificationStatus = async () => {
    try {
      const status = await NotificationService.prototype.checkPermissions();
      setNotificationsEnabled(status.granted);
    } catch (error) {
      console.error('Error checking notification status:', error);
    }
  };
  const handleExportPDF = async () => {
    if (isExporting || !user) return;
    
    setIsExporting(true);
    try {
      // Get user data
      const databaseService = new DatabaseService();
      const subjects = await databaseService.getSubjects(user.$id);
      const grades = await databaseService.getGrades(user.$id);
      
      // Calculate statistics using correct interface
      const statistics: GradeStatistics = {
        overall: calculateAverage(grades),
        weighted: calculateAverage(grades), // Could be improved with actual weighted calculation
        subjectAverages: {},
        semesterAverages: {}
      };

      // Calculate subject averages
      subjects.forEach(subject => {
        const subjectGrades = grades.filter(grade => grade.subjectId === subject.$id);
        if (subjectGrades.length > 0) {
          statistics.subjectAverages[subject.$id!] = calculateAverage(subjectGrades);
        }
      });

      // Export PDF
      const pdfService = new PDFExportService();
      await pdfService.exportToPDF(subjects, grades, statistics, {
        includeStatistics: true,
        includeAllGrades: true
      });
      
      Alert.alert('Erfolg', 'PDF wurde erfolgreich exportiert und geteilt!');
    } catch (error) {
      console.error('PDF Export Error:', error);
      Alert.alert('Fehler', 'Beim Exportieren des PDFs ist ein Fehler aufgetreten.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNotificationSettings = async () => {
    try {
      const notificationService = new NotificationService();
      
      if (notificationsEnabled) {
        // Show notification settings
        Alert.alert(
          'Benachrichtigungen',
          'Benachrichtigungen sind aktiviert. Möchten Sie eine Test-Benachrichtigung senden?',
          [
            { text: 'Abbrechen', style: 'cancel' },
            { 
              text: 'Test senden', 
              onPress: async () => {
                try {
                  const testSubject: Subject = {
                    $id: 'test',
                    name: 'Test-Fach',
                    color: '#3B82F6',
                    userId: user?.$id || ''
                  };
                  
                  await notificationService.scheduleGradeReminder(
                    testSubject,
                    'Dies ist eine Test-Benachrichtigung für Ihre Noten-App!',
                    0.001 // 1/1000 hour = 3.6 seconds
                  );
                  Alert.alert('Erfolg', 'Test-Benachrichtigung wurde geplant!');
                } catch (error) {
                  Alert.alert('Fehler', 'Beim Senden der Test-Benachrichtigung ist ein Fehler aufgetreten.');
                }
              }
            }
          ]
        );
      } else {
        // Request permissions
        try {
          await notificationService.initialize();
          const status = await notificationService.checkPermissions();
          if (status.granted) {
            setNotificationsEnabled(true);
            Alert.alert('Erfolg', 'Benachrichtigungen wurden aktiviert!');
          } else {
            Alert.alert('Hinweis', 'Benachrichtigungen wurden nicht aktiviert. Sie können diese in den Systemeinstellungen aktivieren.');
          }
        } catch (error) {
          Alert.alert('Fehler', 'Beim Aktivieren der Benachrichtigungen ist ein Fehler aufgetreten.');
        }
      }
    } catch (error) {
      console.error('Notification settings error:', error);
    }
  };

  const handleCalendarIntegration = async () => {
    try {
      const calendarService = new CalendarService();
      const hasPermissionStatus = await calendarService.requestPermissions();
      
      if (!hasPermissionStatus.granted) {
        Alert.alert('Fehler', 'Kalender-Berechtigung wurde nicht gewährt.');
        return;
      }

      Alert.alert(
        'Kalender-Integration',
        'Möchten Sie einen Test-Termin für morgen erstellen?',
        [
          { text: 'Abbrechen', style: 'cancel' },
          {
            text: 'Ja',
            onPress: async () => {
              try {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(10, 0, 0, 0);

                const testEvent: CalendarEvent = {
                  title: 'Test-Klausur',
                  description: 'Dies ist ein Test-Termin von der Noten-App',
                  date: tomorrow.toISOString(),
                  type: 'exam',
                  subjectId: 'test',
                  userId: user?.$id || ''
                };

                const testSubject: Subject = {
                  $id: 'test',
                  name: 'Mathematik',
                  color: '#3B82F6',
                  userId: user?.$id || ''
                };

                await calendarService.createEvent(testEvent, testSubject, 60);

                Alert.alert('Erfolg', 'Test-Termin wurde zum Kalender hinzugefügt!');
              } catch (error) {
                Alert.alert('Fehler', 'Beim Erstellen des Kalender-Termins ist ein Fehler aufgetreten.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Calendar integration error:', error);
      Alert.alert('Fehler', 'Beim Zugriff auf den Kalender ist ein Fehler aufgetreten.');
    }
  };

  const handleBackup = () => {
    Alert.alert('Datensicherung', 'Diese Funktion wird in einer zukünftigen Version verfügbar sein.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Abmelden', onPress: logout }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Konto löschen',
      'Möchten Sie Ihr Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Löschen', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Hinweis', 'Diese Funktion wird in einer zukünftigen Version verfügbar sein.');
          }
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
            flex: 1
          }}>
            {TEXTS.SETTINGS}
          </Text>
          <GlassButton
            title={TEXTS.BACK}
            onPress={() => navigation.goBack()}
            size="small"
            gradient={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          />
        </View>

        {/* User Info */}
        <GlassCard style={{ marginBottom: 24 }}>
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 8
          }}>
            Benutzerinformationen
          </Text>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 16,
            marginBottom: 4
          }}>
            Name: {user?.name}
          </Text>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 16
          }}>
            E-Mail: {user?.email}
          </Text>
        </GlassCard>        {/* Export & Advanced Features */}
        <GlassCard style={{ marginBottom: 24 }}>
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 16
          }}>
            Erweiterte Funktionen
          </Text>
          
          <GlassButton
            title={isExporting ? 'Exportiere...' : TEXTS.EXPORT_PDF}
            onPress={handleExportPDF}
            style={{ marginBottom: 12 }}
            size="small"
            disabled={isExporting}
            gradient={['rgba(34, 197, 94, 0.6)', 'rgba(16, 185, 129, 0.6)']}
          />
          
          <GlassButton
            title={notificationsEnabled ? 'Benachrichtigungen verwalten' : 'Benachrichtigungen aktivieren'}
            onPress={handleNotificationSettings}
            style={{ marginBottom: 12 }}
            size="small"
            gradient={['rgba(249, 115, 22, 0.6)', 'rgba(234, 88, 12, 0.6)']}
          />
          
          <GlassButton
            title="Kalender-Integration testen"
            onPress={handleCalendarIntegration}
            style={{ marginBottom: 12 }}
            size="small"
            gradient={['rgba(168, 85, 247, 0.6)', 'rgba(147, 51, 234, 0.6)']}
          />
          
          <GlassButton
            title="Datensicherung erstellen"
            onPress={handleBackup}
            size="small"
            gradient={['rgba(59, 130, 246, 0.6)', 'rgba(147, 51, 234, 0.6)']}
          />
        </GlassCard>

        {/* Account Management */}
        <GlassCard style={{ marginBottom: 24 }}>
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 16
          }}>
            Konto
          </Text>
          
          <GlassButton
            title={TEXTS.LOGOUT}
            onPress={handleLogout}
            style={{ marginBottom: 12 }}
            size="small"
            gradient={['rgba(251, 146, 60, 0.6)', 'rgba(251, 113, 133, 0.6)']}
          />
          
          <GlassButton
            title="Konto löschen"
            onPress={handleDeleteAccount}
            size="small"
            gradient={['rgba(239, 68, 68, 0.6)', 'rgba(220, 38, 38, 0.6)']}
          />
        </GlassCard>

        {/* App Info */}
        <GlassCard>
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 8
          }}>
            App-Informationen
          </Text>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 14,
            marginBottom: 4
          }}>
            Version: 1.0.0
          </Text>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 14,
            marginBottom: 4
          }}>
            Entwickelt mit React Native & Expo
          </Text>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 14
          }}>
            Backend: Appwrite
          </Text>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
};
