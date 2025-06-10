import { Grade } from '../types';

/**
 * Validates if a grade value is within the German grading scale (1.0-6.0)
 */
export const validateGrade = (grade: number): boolean => {
  return grade >= 1.0 && grade <= 6.0;
};

/**
 * Validates if a weight value is valid (0.1-2.0)
 */
export const validateWeight = (weight: number): boolean => {
  return weight >= 0.1 && weight <= 2.0;
};

/**
 * Calculate weighted average for a subject
 */
export const calculateSubjectAverage = (grades: Grade[]): number => {
  if (grades.length === 0) return 0;
  
  let totalWeightedGrades = 0;
  let totalWeight = 0;
  
  grades.forEach(grade => {
    totalWeightedGrades += grade.value * grade.weight;
    totalWeight += grade.weight;
  });
  
  return totalWeight > 0 ? Math.round((totalWeightedGrades / totalWeight) * 100) / 100 : 0;
};

/**
 * Calculate overall average across all subjects
 */
export const calculateOverallAverage = (grades: Grade[]): number => {
  if (grades.length === 0) return 0;
  
  // Group grades by subject and calculate subject averages
  const subjectGrades: { [key: string]: Grade[] } = {};
  
  grades.forEach(grade => {
    if (!subjectGrades[grade.subjectId]) {
      subjectGrades[grade.subjectId] = [];
    }
    subjectGrades[grade.subjectId].push(grade);
  });
  
  const subjectAverages = Object.values(subjectGrades).map(calculateSubjectAverage);
  const validAverages = subjectAverages.filter(avg => avg > 0);
  
  if (validAverages.length === 0) return 0;
  
  const sum = validAverages.reduce((acc, avg) => acc + avg, 0);
  return Math.round((sum / validAverages.length) * 100) / 100;
};

/**
 * Get German grade text description
 */
export const getGradeText = (grade: number): string => {
  if (grade <= 1.5) return 'Sehr gut';
  if (grade <= 2.5) return 'Gut';
  if (grade <= 3.5) return 'Befriedigend';
  if (grade <= 4.0) return 'Ausreichend';
  if (grade <= 5.0) return 'Mangelhaft';
  return 'Ungenügend';
};

/**
 * Get color based on grade value for UI display
 */
export const getGradeColor = (grade: number): string => {
  if (grade <= 1.5) return '#4CAF50'; // Excellent - Green
  if (grade <= 2.5) return '#2196F3'; // Good - Blue  
  if (grade <= 3.5) return '#FF9800'; // Satisfactory - Orange
  if (grade <= 4.0) return '#FFA726'; // Sufficient - Amber
  if (grade <= 5.0) return '#F44336'; // Poor - Red
  return '#9E9E9E'; // Insufficient - Grey
};

/**
 * Format grade value for display
 */
export const formatGrade = (grade: number): string => {
  return grade.toFixed(1);
};

/**
 * Get grade statistics for a set of grades
 */
export const getGradeStatistics = (grades: Grade[]) => {
  if (grades.length === 0) {
    return {
      average: 0,
      best: 0,
      worst: 0,
      count: 0,
    };
  }
  
  const values = grades.map(g => g.value);
  const average = calculateSubjectAverage(grades);
  const best = Math.min(...values);
  const worst = Math.max(...values);
  
  return {
    average,
    best,
    worst,
    count: grades.length,
  };
};

/**
 * Grade scale constants
 */
export const GRADE_SCALE = {
  MIN: 1.0,
  MAX: 6.0,
  EXCELLENT: 1.5,
  GOOD: 2.5,
  SATISFACTORY: 3.5,
  SUFFICIENT: 4.0,
  POOR: 5.0,
} as const;

/**
 * Weight scale constants
 */
export const WEIGHT_SCALE = {
  MIN: 0.1,
  MAX: 2.0,
  DEFAULT: 1.0,
} as const;
