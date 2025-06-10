import { ID, Query } from 'appwrite';
import { databases } from './client';
import { APPWRITE_CONFIG } from './config';
import { Subject, Grade, WeightSetting, CalendarEvent } from '../types';

// Mock database with comprehensive sample data
const mockSubjects: Subject[] = [
  {
    $id: '1',
    name: 'Mathematik',
    color: '#BB86FC',
    userId: 'mock-user-id',
  },
  {
    $id: '2',
    name: 'Deutsch',
    color: '#03DAC6',
    userId: 'mock-user-id',
  },
  {
    $id: '3',
    name: 'Englisch',
    color: '#FF6B35',
    userId: 'mock-user-id',
  },
  {
    $id: '4',
    name: 'Physik',
    color: '#2196F3',
    userId: 'mock-user-id',
  },
  {
    $id: '5',
    name: 'Chemie',
    color: '#4CAF50',
    userId: 'mock-user-id',
  },
];

const mockGrades: Grade[] = [
  // Mathematik grades
  {
    $id: '1',
    subjectId: '1',
    type: 'Klausur',
    value: 2.0,
    weight: 1.0,
    semester: 'WS 2024/25',
    date: '2024-01-15',
    userId: 'mock-user-id',
  },
  {
    $id: '2',
    subjectId: '1',
    type: 'Test',
    value: 1.7,
    weight: 0.5,
    semester: 'WS 2024/25',
    date: '2024-01-20',
    userId: 'mock-user-id',
  },
  {
    $id: '3',
    subjectId: '1',
    type: 'Hausaufgabe',
    value: 2.3,
    weight: 0.3,
    semester: 'WS 2024/25',
    date: '2024-01-25',
    userId: 'mock-user-id',
  },
  // Deutsch grades
  {
    $id: '4',
    subjectId: '2',
    type: 'Klausur',
    value: 1.5,
    weight: 1.0,
    semester: 'WS 2024/25',
    date: '2024-01-18',
    userId: 'mock-user-id',
  },
  {
    $id: '5',
    subjectId: '2',
    type: 'Mündlich',
    value: 2.1,
    weight: 0.6,
    semester: 'WS 2024/25',
    date: '2024-01-22',
    userId: 'mock-user-id',
  },
  // Englisch grades
  {
    $id: '6',
    subjectId: '3',
    type: 'Test',
    value: 2.7,
    weight: 0.8,
    semester: 'WS 2024/25',
    date: '2024-01-19',
    userId: 'mock-user-id',
  },
  {
    $id: '7',
    subjectId: '3',
    type: 'Präsentation',
    value: 1.8,
    weight: 0.7,
    semester: 'WS 2024/25',
    date: '2024-01-28',
    userId: 'mock-user-id',
  },
  // Physik grades
  {
    $id: '8',
    subjectId: '4',
    type: 'Klausur',
    value: 2.4,
    weight: 1.0,
    semester: 'WS 2024/25',
    date: '2024-01-16',
    userId: 'mock-user-id',
  },
  // Chemie grades
  {
    $id: '9',
    subjectId: '5',
    type: 'Projekt',
    value: 1.9,
    weight: 1.2,
    semester: 'WS 2024/25',
    date: '2024-01-30',
    userId: 'mock-user-id',
  },
];

let subjects = [...mockSubjects];
let grades = [...mockGrades];

export class DatabaseService {
  // Subject methods
  async getSubjects(userId: string): Promise<Subject[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(subjects.filter(subject => subject.userId === userId));
      }, 300);
    });
  }

  async createSubject(data: Omit<Subject, '$id'>): Promise<Subject> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSubject: Subject = {
          $id: ID.unique(),
          ...data,
        };
        subjects.push(newSubject);
        resolve(newSubject);
      }, 500);
    });
  }

  async updateSubject(subjectId: string, data: Partial<Subject>): Promise<Subject> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = subjects.findIndex(s => s.$id === subjectId);
        if (index === -1) {
          reject(new Error('Subject not found'));
          return;
        }
        
        subjects[index] = { ...subjects[index], ...data };
        resolve(subjects[index]);
      }, 500);
    });
  }

  async deleteSubject(subjectId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        subjects = subjects.filter(s => s.$id !== subjectId);
        grades = grades.filter(g => g.subjectId !== subjectId);
        resolve();
      }, 500);
    });
  }

  // Grade methods
  async getGrades(userId: string): Promise<Grade[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(grades.filter(grade => grade.userId === userId));
      }, 300);
    });
  }

  async getGradesBySubject(subjectId: string): Promise<Grade[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(grades.filter(grade => grade.subjectId === subjectId));
      }, 300);
    });
  }

  async createGrade(data: Omit<Grade, '$id'>): Promise<Grade> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newGrade: Grade = {
          $id: ID.unique(),
          ...data,
        };
        grades.push(newGrade);
        resolve(newGrade);
      }, 500);
    });
  }

  async updateGrade(gradeId: string, data: Partial<Grade>): Promise<Grade> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = grades.findIndex(g => g.$id === gradeId);
        if (index === -1) {
          reject(new Error('Grade not found'));
          return;
        }
        
        grades[index] = { ...grades[index], ...data };
        resolve(grades[index]);
      }, 500);
    });
  }

  async deleteGrade(gradeId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        grades = grades.filter(g => g.$id !== gradeId);
        resolve();
      }, 500);
    });
  }

  // Weight settings methods
  async getWeightSettings(userId: string): Promise<WeightSetting[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 300);
    });
  }

  async createWeightSetting(data: Omit<WeightSetting, '$id'>): Promise<WeightSetting> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSetting: WeightSetting = {
          $id: ID.unique(),
          ...data,
        };
        resolve(newSetting);
      }, 500);
    });
  }

  async updateWeightSetting(settingId: string, data: Partial<WeightSetting>): Promise<WeightSetting> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Weight setting not found'));
      }, 500);
    });
  }

  async deleteWeightSetting(settingId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  // Statistics methods
  async getOverallAverage(userId: string): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userGrades = grades.filter(grade => grade.userId === userId);
        if (userGrades.length === 0) {
          resolve(0);
          return;
        }
        
        let totalWeightedGrades = 0;
        let totalWeight = 0;
        
        userGrades.forEach(grade => {
          totalWeightedGrades += grade.value * grade.weight;
          totalWeight += grade.weight;
        });
        
        const average = totalWeight > 0 ? totalWeightedGrades / totalWeight : 0;
        resolve(Math.round(average * 100) / 100);
      }, 300);
    });
  }

  async getSubjectAverage(subjectId: string): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subjectGrades = grades.filter(grade => grade.subjectId === subjectId);
        if (subjectGrades.length === 0) {
          resolve(0);
          return;
        }
        
        let totalWeightedGrades = 0;
        let totalWeight = 0;
        
        subjectGrades.forEach(grade => {
          totalWeightedGrades += grade.value * grade.weight;
          totalWeight += grade.weight;
        });
        
        const average = totalWeight > 0 ? totalWeightedGrades / totalWeight : 0;
        resolve(Math.round(average * 100) / 100);
      }, 300);
    });
  }
}

export const databaseService = new DatabaseService();
