import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subject, Grade, WeightSetting, CalendarEvent, User } from '../types';

const STORAGE_KEYS = {
  USER: '@grade_tracker_user',
  SUBJECTS: '@grade_tracker_subjects',
  GRADES: '@grade_tracker_grades',
  WEIGHT_SETTINGS: '@grade_tracker_weight_settings',
  CALENDAR_EVENTS: '@grade_tracker_calendar_events',
  LAST_SYNC: '@grade_tracker_last_sync',
  PENDING_SYNC: '@grade_tracker_pending_sync',
} as const;

export interface PendingSync {
  subjects: { create: Subject[]; update: Subject[]; delete: string[] };
  grades: { create: Grade[]; update: Grade[]; delete: string[] };
  weightSettings: { create: WeightSetting[]; update: WeightSetting[]; delete: string[] };
  calendarEvents: { create: CalendarEvent[]; update: CalendarEvent[]; delete: string[] };
}

export class OfflineStorageService {
  // User operations
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  }

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user from storage:', error);
      throw error;
    }
  }

  // Subject operations
  async saveSubjects(subjects: Subject[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (error) {
      console.error('Error saving subjects to storage:', error);
      throw error;
    }
  }

  async getSubjects(): Promise<Subject[]> {
    try {
      const subjectsData = await AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return subjectsData ? JSON.parse(subjectsData) : [];
    } catch (error) {
      console.error('Error getting subjects from storage:', error);
      return [];
    }
  }

  // Grade operations
  async saveGrades(grades: Grade[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
    } catch (error) {
      console.error('Error saving grades to storage:', error);
      throw error;
    }
  }

  async getGrades(): Promise<Grade[]> {
    try {
      const gradesData = await AsyncStorage.getItem(STORAGE_KEYS.GRADES);
      return gradesData ? JSON.parse(gradesData) : [];
    } catch (error) {
      console.error('Error getting grades from storage:', error);
      return [];
    }
  }

  // Weight settings operations
  async saveWeightSettings(weightSettings: WeightSetting[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WEIGHT_SETTINGS, JSON.stringify(weightSettings));
    } catch (error) {
      console.error('Error saving weight settings to storage:', error);
      throw error;
    }
  }

  async getWeightSettings(): Promise<WeightSetting[]> {
    try {
      const weightSettingsData = await AsyncStorage.getItem(STORAGE_KEYS.WEIGHT_SETTINGS);
      return weightSettingsData ? JSON.parse(weightSettingsData) : [];
    } catch (error) {
      console.error('Error getting weight settings from storage:', error);
      return [];
    }
  }

  // Calendar events operations
  async saveCalendarEvents(calendarEvents: CalendarEvent[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(calendarEvents));
    } catch (error) {
      console.error('Error saving calendar events to storage:', error);
      throw error;
    }
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    try {
      const calendarEventsData = await AsyncStorage.getItem(STORAGE_KEYS.CALENDAR_EVENTS);
      return calendarEventsData ? JSON.parse(calendarEventsData) : [];
    } catch (error) {
      console.error('Error getting calendar events from storage:', error);
      return [];
    }
  }

  // Sync operations
  async saveLastSyncTime(timestamp: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString());
    } catch (error) {
      console.error('Error saving last sync time:', error);
      throw error;
    }
  }

  async getLastSyncTime(): Promise<number | null> {
    try {
      const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  async savePendingSync(pendingSync: PendingSync): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(pendingSync));
    } catch (error) {
      console.error('Error saving pending sync data:', error);
      throw error;
    }
  }

  async getPendingSync(): Promise<PendingSync> {
    try {
      const pendingSyncData = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
      if (pendingSyncData) {
        return JSON.parse(pendingSyncData);
      }
    } catch (error) {
      console.error('Error getting pending sync data:', error);
    }
    
    // Return empty pending sync structure
    return {
      subjects: { create: [], update: [], delete: [] },
      grades: { create: [], update: [], delete: [] },
      weightSettings: { create: [], update: [], delete: [] },
      calendarEvents: { create: [], update: [], delete: [] },
    };
  }

  async clearPendingSync(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
    } catch (error) {
      console.error('Error clearing pending sync data:', error);
      throw error;
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Check if we have cached data
  async hasCachedData(): Promise<boolean> {
    try {
      const [subjects, grades] = await Promise.all([
        this.getSubjects(),
        this.getGrades(),
      ]);
      return subjects.length > 0 || grades.length > 0;
    } catch (error) {
      console.error('Error checking cached data:', error);
      return false;
    }
  }

  // Export all data for backup
  async exportAllData(): Promise<string> {
    try {
      const [user, subjects, grades, weightSettings, calendarEvents, lastSync] = await Promise.all([
        this.getUser(),
        this.getSubjects(),
        this.getGrades(),
        this.getWeightSettings(),
        this.getCalendarEvents(),
        this.getLastSyncTime(),
      ]);

      const exportData = {
        user,
        subjects,
        grades,
        weightSettings,
        calendarEvents,
        lastSync,
        exportTimestamp: Date.now(),
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  // Import data from backup
  async importAllData(dataString: string): Promise<void> {
    try {
      const data = JSON.parse(dataString);
      
      if (data.user) await this.saveUser(data.user);
      if (data.subjects) await this.saveSubjects(data.subjects);
      if (data.grades) await this.saveGrades(data.grades);
      if (data.weightSettings) await this.saveWeightSettings(data.weightSettings);
      if (data.calendarEvents) await this.saveCalendarEvents(data.calendarEvents);
      if (data.lastSync) await this.saveLastSyncTime(data.lastSync);
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

export const offlineStorageService = new OfflineStorageService();
