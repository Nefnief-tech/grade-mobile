export const TEXTS = {
  // App
  APP_NAME: 'Noten Tracker',
  
  // Authentication
  LOGIN: 'Anmelden',
  REGISTER: 'Registrieren',
  EMAIL: 'E-Mail',
  PASSWORD: 'Passwort',
  CONFIRM_PASSWORD: 'Passwort bestätigen',
  FORGOT_PASSWORD: 'Passwort vergessen?',
  LOGOUT: 'Abmelden',
  NAME: 'Name',

  // Navigation
  OVERVIEW: 'Übersicht',
  ADD_GRADE: 'Note hinzufügen',
  SETTINGS: 'Einstellungen',
  CALENDAR: 'Kalender',
  STATISTICS: 'Statistiken',

  // Grades
  GRADE: 'Note',
  SUBJECT: 'Fach',
  TYPE: 'Art',
  VALUE: 'Wert',
  WEIGHT: 'Gewichtung',
  SEMESTER: 'Semester',
  DATE: 'Datum',
  AVERAGE: 'Durchschnitt',
  WEIGHTED_AVERAGE: 'Gewichteter Durchschnitt',

  // Grade Types
  EXAM: 'Klausur',
  HOMEWORK: 'Hausaufgabe',
  PARTICIPATION: 'Mitarbeit',
  PROJECT: 'Projekt',
  PRESENTATION: 'Präsentation',
  TEST: 'Test',

  // Grade Values
  VERY_GOOD: 'Sehr gut',
  GOOD: 'Gut',
  SATISFACTORY: 'Befriedigend',
  SUFFICIENT: 'Ausreichend',
  POOR: 'Mangelhaft',
  INSUFFICIENT: 'Ungenügend',

  // Actions
  ADD: 'Hinzufügen',
  EDIT: 'Bearbeiten',
  DELETE: 'Löschen',
  SAVE: 'Speichern',
  CANCEL: 'Abbrechen',
  CONFIRM: 'Bestätigen',
  BACK: 'Zurück',

  // Settings
  THEME: 'Design',
  LIGHT_MODE: 'Hell',
  DARK_MODE: 'Dunkel',
  SYSTEM_MODE: 'System',
  NOTIFICATIONS: 'Benachrichtigungen',
  EXPORT_PDF: 'Als PDF exportieren',
  WEIGHT_SETTINGS: 'Gewichtungseinstellungen',

  // Calendar
  UPCOMING_EXAMS: 'Anstehende Prüfungen',
  ADD_EVENT: 'Termin hinzufügen',
  EXAM_REMINDER: 'Prüfungserinnerung',

  // Error Messages
  ERROR: 'Fehler',
  LOGIN_ERROR: 'Anmeldung fehlgeschlagen',
  REGISTER_ERROR: 'Registrierung fehlgeschlagen',
  INVALID_EMAIL: 'Ungültige E-Mail-Adresse',
  PASSWORD_TOO_SHORT: 'Passwort zu kurz',
  PASSWORDS_DONT_MATCH: 'Passwörter stimmen nicht überein',
  NETWORK_ERROR: 'Netzwerkfehler',
  UNKNOWN_ERROR: 'Unbekannter Fehler',

  // Success Messages
  SUCCESS: 'Erfolgreich',
  GRADE_ADDED: 'Note hinzugefügt',
  GRADE_UPDATED: 'Note aktualisiert',
  GRADE_DELETED: 'Note gelöscht',
  SUBJECT_ADDED: 'Fach hinzugefügt',
  SETTINGS_SAVED: 'Einstellungen gespeichert',

  // Placeholders
  ENTER_SUBJECT_NAME: 'Fachname eingeben',
  SELECT_GRADE_TYPE: 'Notenart auswählen',
  SELECT_SEMESTER: 'Semester auswählen',
  ENTER_GRADE_VALUE: 'Notenwert eingeben (1.0 - 6.0)',
  ENTER_WEIGHT: 'Gewichtung eingeben (0.0 - 1.0)',

  // Common
  LOADING: 'Lädt...',
  NO_DATA: 'Keine Daten verfügbar',
  OFFLINE: 'Offline',
  SYNC: 'Synchronisieren',
  LAST_SYNC: 'Letzte Synchronisation',
  TODAY: 'Heute',
  YESTERDAY: 'Gestern',
  THIS_WEEK: 'Diese Woche',
  THIS_MONTH: 'Dieser Monat',
  SEMESTER_CURRENT: 'Aktuelles Semester',
  ALL_SEMESTERS: 'Alle Semester',
} as const;

export const GRADE_DESCRIPTIONS = {
  1.0: 'Sehr gut',
  1.3: 'Sehr gut -',
  1.7: 'Gut +',
  2.0: 'Gut',
  2.3: 'Gut -',
  2.7: 'Befriedigend +',
  3.0: 'Befriedigend',
  3.3: 'Befriedigend -',
  3.7: 'Ausreichend +',
  4.0: 'Ausreichend',
  4.3: 'Ausreichend -',
  4.7: 'Mangelhaft +',
  5.0: 'Mangelhaft',
  5.3: 'Mangelhaft -',
  5.7: 'Ungenügend +',
  6.0: 'Ungenügend',
} as const;

export const GRADE_TYPES = [
  { value: 'Klausur', label: 'Klausur' },
  { value: 'Hausaufgabe', label: 'Hausaufgabe' },
  { value: 'Mitarbeit', label: 'Mitarbeit' },
  { value: 'Projekt', label: 'Projekt' },
  { value: 'Präsentation', label: 'Präsentation' },
  { value: 'Test', label: 'Test' },
] as const;

export const SEMESTERS = [
  'WS 2024/25',
  'SS 2025',
  'WS 2025/26',
  'SS 2026',
] as const;
