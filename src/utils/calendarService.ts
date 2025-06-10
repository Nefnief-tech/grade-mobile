import * as Calendar from 'expo-calendar';
import { Platform, Alert } from 'react-native';
import { CalendarEvent as AppCalendarEvent, Subject } from '../types';
import { TEXTS } from '../localization/de';

export interface CalendarPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

export class CalendarService {
  private defaultCalendarId: string | null = null;

  /**
   * Request calendar permissions
   */
  async requestPermissions(): Promise<CalendarPermissionStatus> {
    try {
      const { status, canAskAgain } = await Calendar.requestCalendarPermissionsAsync();
      return {
        granted: status === 'granted',
        canAskAgain,
      };
    } catch (error) {
      console.error('Calendar permissions error:', error);
      return { granted: false, canAskAgain: false };
    }
  }

  /**
   * Get or create default calendar for the app
   */
  async getDefaultCalendar(): Promise<string | null> {
    try {
      if (this.defaultCalendarId) {
        return this.defaultCalendarId;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      
      // Try to find existing app calendar
      let appCalendar = calendars.find(cal => cal.title === 'Noten Tracker');
        if (!appCalendar) {
        // Create new calendar
        if (Platform.OS === 'android') {
          const defaultCalendarSource = {
            isLocalAccount: true,
            name: 'Expo Calendar',
            type: Calendar.CalendarType.LOCAL,
          };

          const newCalendarId = await Calendar.createCalendarAsync({
            title: 'Noten Tracker',
            color: '#4f46e5',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: undefined,
            source: defaultCalendarSource,
            name: 'notenTracker',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
          });
          this.defaultCalendarId = newCalendarId;
        } else {
          // iOS
          const defaultCalendar = await Calendar.getDefaultCalendarAsync();
          const newCalendarId = await Calendar.createCalendarAsync({
            title: 'Noten Tracker',
            color: '#4f46e5',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendar.source?.id,
            source: defaultCalendar.source,
            name: 'notenTracker',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
          });
          this.defaultCalendarId = newCalendarId;
        }
      } else {
        this.defaultCalendarId = appCalendar.id;
      }

      return this.defaultCalendarId;
    } catch (error) {
      console.error('Get default calendar error:', error);
      return null;
    }
  }

  /**
   * Create a calendar event for an exam or assignment
   */
  async createEvent(
    event: AppCalendarEvent,
    subject: Subject,
    reminderMinutes: number = 60
  ): Promise<string | null> {
    try {
      const permissions = await this.requestPermissions();
      if (!permissions.granted) {
        Alert.alert(
          'Berechtigung erforderlich',
          'Um Termine zu erstellen, benötigt die App Zugriff auf Ihren Kalender.',
          [
            { text: 'Abbrechen', style: 'cancel' },
            {
              text: 'Einstellungen öffnen',
              onPress: () => {
                // Open settings would require additional expo-linking setup
                Alert.alert('Hinweis', 'Bitte aktivieren Sie die Kalender-Berechtigung in den App-Einstellungen.');
              }
            }
          ]
        );
        return null;
      }

      const calendarId = await this.getDefaultCalendar();
      if (!calendarId) {
        throw new Error('Kalender konnte nicht erstellt werden');
      }

      const eventDate = new Date(event.date);
      const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000); // 1 hour duration

      const eventId = await Calendar.createEventAsync(calendarId, {
        title: `${this.getEventIcon(event.type)} ${event.title}`,
        startDate: eventDate,
        endDate: endDate,
        notes: `${event.description || ''}\n\nFach: ${subject.name}\nErstellt mit Noten Tracker`,
        alarms: [
          { relativeOffset: -reminderMinutes },
          { relativeOffset: -24 * 60 }, // 24 hours before
        ],
        timeZone: 'Europe/Berlin',
      });

      return eventId;
    } catch (error) {
      console.error('Create calendar event error:', error);
      throw new Error('Fehler beim Erstellen des Termins');
    }
  }

  /**
   * Update an existing calendar event
   */
  async updateEvent(
    calendarEventId: string,
    event: AppCalendarEvent,
    subject: Subject,
    reminderMinutes: number = 60
  ): Promise<void> {
    try {
      const eventDate = new Date(event.date);
      const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000);

      await Calendar.updateEventAsync(calendarEventId, {
        title: `${this.getEventIcon(event.type)} ${event.title}`,
        startDate: eventDate,
        endDate: endDate,
        notes: `${event.description || ''}\n\nFach: ${subject.name}\nErstellt mit Noten Tracker`,
        alarms: [
          { relativeOffset: -reminderMinutes },
          { relativeOffset: -24 * 60 },
        ],
      });
    } catch (error) {
      console.error('Update calendar event error:', error);
      throw new Error('Fehler beim Aktualisieren des Termins');
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(calendarEventId: string): Promise<void> {
    try {
      await Calendar.deleteEventAsync(calendarEventId);
    } catch (error) {
      console.error('Delete calendar event error:', error);
      throw new Error('Fehler beim Löschen des Termins');
    }
  }

  /**
   * Get upcoming events from the app calendar
   */
  async getUpcomingEvents(daysAhead: number = 30): Promise<Calendar.Event[]> {
    try {
      const permissions = await this.requestPermissions();
      if (!permissions.granted) {
        return [];
      }

      const calendarId = await this.getDefaultCalendar();
      if (!calendarId) {
        return [];
      }

      const now = new Date();
      const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

      const events = await Calendar.getEventsAsync(
        [calendarId],
        now,
        futureDate
      );

      return events.sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    } catch (error) {
      console.error('Get upcoming events error:', error);
      return [];
    }
  }

  /**
   * Create multiple events for exam schedule
   */
  async createExamSchedule(
    events: AppCalendarEvent[],
    subjects: Subject[],
    reminderMinutes: number = 60
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const event of events) {
      try {
        const subject = subjects.find(s => s.$id === event.subjectId);
        if (subject) {
          await this.createEvent(event, subject, reminderMinutes);
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Failed to create event ${event.title}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Get event icon based on type
   */
  private getEventIcon(type: string): string {
    switch (type) {
      case 'exam':
        return '📝';
      case 'homework':
        return '📚';
      case 'project':
        return '💻';
      default:
        return '📅';
    }
  }

  /**
   * Format event reminder text
   */
  getEventReminderText(event: AppCalendarEvent, subject: Subject): string {
    const eventDate = new Date(event.date);
    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let timeText = '';
    if (diffDays === 0) {
      timeText = 'heute';
    } else if (diffDays === 1) {
      timeText = 'morgen';
    } else if (diffDays > 1) {
      timeText = `in ${diffDays} Tagen`;
    } else {
      timeText = 'vergangen';
    }

    return `${this.getEventIcon(event.type)} ${event.title} (${subject.name}) - ${timeText}`;
  }

  /**
   * Check if calendar permissions are granted
   */
  async hasPermissions(): Promise<boolean> {
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Check calendar permissions error:', error);
      return false;
    }
  }
}

export const calendarService = new CalendarService();
