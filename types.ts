
export enum AppSection {
  COURSE = 'course',
  PRACTICE = 'practice',
  EXAM = 'exam',
  PROGRESS = 'progress'
}

export type CourseType = 'finance' | 'management';

export interface AmortizationRow {
  period: number;
  remainingStart: number;
  interest: number;
  amortization: number;
  annuity: number;
  remainingEnd: number;
}

export type InterestType = 'simple' | 'compound';

export interface Question {
  id: string;
  module: CourseType;
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  correctAnswer: number | string;
  unit: string;
  explanation: string; // Le corrigé détaillé étape par étape
  method: string; // La méthode générale (règle de calcul)
  courseReminder: string; // La formule brute
  trapWarning?: string; // L'erreur classique à éviter
  type: 'calculation' | 'theory';
  options?: string[];
  points?: number;
}

export interface UserStats {
  module: CourseType;
  theme: string;
  totalAnswered: number;
  correctAnswers: number;
}

export interface ExamAttempt {
  date: number;
  score: number;
  total: number;
  module: CourseType;
  duration: number;
  mistakes: string[]; // IDs des thèmes ratés
}

export interface ProgressData {
  stats: UserStats[];
  history: ExamAttempt[];
  totalPoints: number;
}
