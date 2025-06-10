export interface Subject {
  $id: string;
  name: string;
  color: string;
  userId: string;
}

export interface Grade {
  $id: string;
  subjectId: string;
  type: string;
  value: number;
  weight: number;
  semester: string;
  date: string;
  userId: string;
}

export interface WeightSetting {
  $id: string;
  subjectId: string;
  gradeType: string;
  weight: number;
  userId: string;
}

export interface User {
  $id: string;
  email: string;
  name: string;
}

export type GradeType = 
  | 'Klausur'
  | 'Hausaufgabe'
  | 'Test'
  | 'Mündlich'
  | 'Projekt'
  | 'Präsentation';

export type Semester = 
  | 'WS 2023/24'
  | 'SS 2024'
  | 'WS 2024/25'
  | 'SS 2025';

export interface SubjectWithAverage extends Subject {
  average: number;
  gradeCount: number;
}
