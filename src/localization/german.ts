export const text = {
  // App Info
  appName: 'Noten Tracker',
  appDescription: 'Verwalte deine Schulnoten einfach und übersichtlich',
  
  // Navigation
  overview: 'Übersicht',
  settings: 'Einstellungen',
  details: 'Details',
  
  // Common Actions
  save: 'Speichern',
  cancel: 'Abbrechen',
  delete: 'Löschen',
  edit: 'Bearbeiten',
  add: 'Hinzufügen',
  search: 'Suchen...',
  loading: 'Wird geladen...',
  refresh: 'Aktualisieren',
  
  // Grades
  addGrade: 'Note hinzufügen',
  editGrade: 'Note bearbeiten',
  deleteGrade: 'Note löschen',
  grade: 'Note',
  grades: 'Noten',
  gradeValue: 'Notenwert',
  gradeType: 'Notentyp',
  weight: 'Gewichtung',
  date: 'Datum',
  semester: 'Semester',
  average: 'Durchschnitt',
  overallAverage: 'Gesamtdurchschnitt',
  
  // Subjects  
  addSubject: 'Fach hinzufügen',
  editSubject: 'Fach bearbeiten',
  deleteSubject: 'Fach löschen',
  subject: 'Fach',
  subjects: 'Fächer',
  subjectName: 'Fachname',
  subjectColor: 'Fachfarbe',
  noSubjects: 'Noch keine Fächer vorhanden',
  noGrades: 'Noch keine Noten vorhanden',
  
  // Grade Types
  exam: 'Klausur',
  test: 'Test',
  homework: 'Hausaufgabe',
  oral: 'Mündlich',
  project: 'Projekt',
  presentation: 'Präsentation',
  
  // Grade Scale
  excellent: 'Sehr gut',
  good: 'Gut',
  satisfactory: 'Befriedigend',
  sufficient: 'Ausreichend',
  poor: 'Mangelhaft',
  insufficient: 'Ungenügend',
  
  // Settings
  theme: 'Design',
  darkMode: 'Dunkler Modus',
  notifications: 'Benachrichtigungen',
  export: 'Daten exportieren',
  backup: 'Backup erstellen',
  import: 'Daten importieren',
  
  // Validation Messages
  fieldRequired: 'Dieses Feld ist erforderlich',
  invalidGrade: 'Note muss zwischen 1.0 und 6.0 liegen',
  invalidWeight: 'Gewichtung muss zwischen 0.1 und 1.0 liegen',
  
  // Error Messages
  error: 'Fehler',
  success: 'Erfolg',
  errorLoadingData: 'Fehler beim Laden der Daten',
  errorSavingData: 'Fehler beim Speichern',
  gradeAdded: 'Note wurde hinzugefügt',
  gradeUpdated: 'Note wurde aktualisiert',
  gradeDeleted: 'Note wurde gelöscht',
  subjectAdded: 'Fach wurde hinzugefügt',
  subjectUpdated: 'Fach wurde aktualisiert',
  subjectDeleted: 'Fach wurde gelöscht',
  
  // Confirmation
  confirmDelete: 'Wirklich löschen?',
  confirmDeleteGrade: 'Möchtest du diese Note wirklich löschen?',
  confirmDeleteSubject: 'Möchtest du dieses Fach und alle zugehörigen Noten wirklich löschen?',
  
  // Statistics
  totalGrades: 'Noten gesamt',
  bestGrade: 'Beste Note',
  worstGrade: 'Schlechteste Note',
  
  // Time Periods
  currentSemester: 'Aktuelles Semester',
  lastSemester: 'Letztes Semester',
  thisYear: 'Dieses Jahr',
  lastYear: 'Letztes Jahr',
  
  // Placeholders
  enterGradeValue: 'z.B. 2.3',
  enterSubjectName: 'z.B. Mathematik',
  selectGradeType: 'Wähle Notentyp',
  selectSubject: 'Wähle Fach',
  enterWeight: 'z.B. 0.6',
  
  // Empty States
  noGradesForSubject: 'Noch keine Noten für dieses Fach',
  noDataAvailable: 'Keine Daten verfügbar',
  
  // Calendar
  today: 'Heute',
  yesterday: 'Gestern',
  thisWeek: 'Diese Woche',
  lastWeek: 'Letzte Woche',
  thisMonth: 'Dieser Monat',
  lastMonth: 'Letzter Monat',
} as const;