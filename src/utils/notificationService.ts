import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import { CalendarEvent, Subject, Grade } from '../types';
import { TEXTS } from '../localization/de';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  ios?: {
    allowsAlert: boolean;
    allowsBadge: boolean;
    allowsSound: boolean;
  };
}

export interface NotificationData {
  type: 'exam_reminder' | 'grade_reminder' | 'weekly_summary' | 'achievement';
  subjectId?: string;
  gradeId?: string;
  eventId?: string;
  [key: string]: any;
}

export class NotificationService {
  private expoPushToken: string | null = null;

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    try {
      if (Device.isDevice) {
        const token = await this.registerForPushNotificationsAsync();
        this.expoPushToken = token;
      } else {
        console.log('Push notifications only work on physical devices');
      }
    } catch (error) {
      console.error('Notification initialization error:', error);
    }
  }

  /**
   * Register for push notifications
   */
  private async registerForPushNotificationsAsync(): Promise<string | null> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Push-Benachrichtigungen',
          'Um Sie über wichtige Termine zu informieren, benötigt die App Berechtigung für Push-Benachrichtigungen.',
          [
            { text: 'Später', style: 'cancel' },
            {
              text: 'Einstellungen',
              onPress: () => {
                Alert.alert('Hinweis', 'Bitte aktivieren Sie Push-Benachrichtigungen in den App-Einstellungen.');
              }
            }
          ]
        );
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('grades', {
          name: 'Noten & Termine',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4f46e5',
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('reminders', {
          name: 'Erinnerungen',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#f59e0b',
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('achievements', {
          name: 'Erfolge',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250],
          lightColor: '#10b981',
          sound: 'default',
        });
      }

      return token;
    } catch (error) {
      console.error('Register for push notifications error:', error);
      return null;
    }
  }

  /**
   * Check notification permissions
   */  async checkPermissions(): Promise<NotificationPermissionStatus> {
    try {
      const { status, canAskAgain, ios } = await Notifications.getPermissionsAsync();
      return {
        granted: status === 'granted',
        canAskAgain,
        ios: ios ? {
          allowsAlert: ios.allowsAlert || false,
          allowsBadge: ios.allowsBadge || false,
          allowsSound: ios.allowsSound || false,
        } : undefined,
      };
    } catch (error) {
      console.error('Check notification permissions error:', error);
      return { granted: false, canAskAgain: false };
    }
  }

  /**
   * Schedule exam reminder notification
   */
  async scheduleExamReminder(
    event: CalendarEvent,
    subject: Subject,
    hoursBeforeExam: number = 24
  ): Promise<string | null> {
    try {
      const permissions = await this.checkPermissions();
      if (!permissions.granted) {
        return null;
      }

      const examDate = new Date(event.date);
      const reminderDate = new Date(examDate.getTime() - hoursBeforeExam * 60 * 60 * 1000);

      // Don't schedule if reminder time is in the past
      if (reminderDate < new Date()) {
        return null;
      }      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `📝 ${event.title}`,
          body: `${subject.name} - ${event.type === 'exam' ? 'Prüfung' : 'Termin'} ${hoursBeforeExam === 24 ? 'morgen' : `in ${hoursBeforeExam} Stunden`}`,
          data: {
            type: 'exam_reminder',
            eventId: event.$id,
            subjectId: subject.$id,
          } as NotificationData,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { seconds: Math.max(1, Math.floor((reminderDate.getTime() - Date.now()) / 1000)) },
      });

      return notificationId;
    } catch (error) {
      console.error('Schedule exam reminder error:', error);
      return null;
    }
  }

  /**
   * Schedule grade reminder notification
   */
  async scheduleGradeReminder(
    subject: Subject,
    message: string,
    delayHours: number = 1
  ): Promise<string | null> {
    try {
      const permissions = await this.checkPermissions();
      if (!permissions.granted) {
        return null;
      }

      const reminderDate = new Date(Date.now() + delayHours * 60 * 60 * 1000);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `📊 ${subject.name}`,
          body: message,
          data: {
            type: 'grade_reminder',
            subjectId: subject.$id,
          } as NotificationData,
          sound: 'default',
        },        trigger: { seconds: Math.max(1, Math.floor((reminderDate.getTime() - Date.now()) / 1000)) },
      });

      return notificationId;
    } catch (error) {
      console.error('Schedule grade reminder error:', error);
      return null;
    }
  }

  /**
   * Send immediate notification
   */
  async sendImmedateNotification(
    title: string,
    body: string,
    data?: NotificationData
  ): Promise<string | null> {
    try {
      const permissions = await this.checkPermissions();
      if (!permissions.granted) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || { type: 'achievement' },
          sound: 'default',
        },
        trigger: null, // Send immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Send immediate notification error:', error);
      return null;
    }
  }

  /**
   * Schedule weekly summary notification
   */
  async scheduleWeeklySummary(): Promise<string | null> {
    try {
      const permissions = await this.checkPermissions();
      if (!permissions.granted) {
        return null;
      }

      // Schedule for every Sunday at 18:00
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📈 Wöchentliche Zusammenfassung',
          body: 'Schauen Sie sich Ihre Noten der letzten Woche an',
          data: {
            type: 'weekly_summary',
          } as NotificationData,
          sound: 'default',
        },
        trigger: {
          weekday: 1, // Sunday
          hour: 18,
          minute: 0,
          repeats: true,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Schedule weekly summary error:', error);
      return null;
    }
  }

  /**
   * Cancel scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Cancel notification error:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Cancel all notifications error:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Get scheduled notifications error:', error);
      return [];
    }
  }

  /**
   * Handle notification received
   */
  addNotificationReceivedListener(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Handle notification tapped
   */
  addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Create achievement notification for good grades
   */
  async notifyGradeAchievement(grade: Grade, subject: Subject): Promise<void> {
    if (grade.value <= 2.0) {
      const message = grade.value <= 1.5 
        ? `Ausgezeichnet! Sie haben eine ${grade.value} in ${subject.name} erreicht! 🌟`
        : `Gut gemacht! Eine ${grade.value} in ${subject.name}! 👏`;

      await this.sendImmedateNotification(
        '🎉 Glückwunsch!',
        message,
        {
          type: 'achievement',
          gradeId: grade.$id,
          subjectId: subject.$id,
        }
      );
    }
  }

  /**
   * Create notification for grade improvement
   */
  async notifyGradeImprovement(
    previousAverage: number,
    newAverage: number,
    subject: Subject
  ): Promise<void> {
    if (newAverage < previousAverage && previousAverage - newAverage >= 0.3) {
      await this.sendImmedateNotification(
        '📈 Verbesserung!',
        `Ihr Durchschnitt in ${subject.name} hat sich von ${previousAverage.toFixed(2)} auf ${newAverage.toFixed(2)} verbessert!`,
        {
          type: 'achievement',
          subjectId: subject.$id,
        }
      );
    }
  }

  /**
   * Get push token for server communication
   */
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Set badge count on app icon (iOS)
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await Notifications.setBadgeCountAsync(count);
      }
    } catch (error) {
      console.error('Set badge count error:', error);
    }
  }
}

export const notificationService = new NotificationService();
