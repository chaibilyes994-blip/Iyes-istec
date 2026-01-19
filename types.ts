
export enum AppSection {
  COURSE = 'course',
  PRACTICE = 'practice',
  EXAM = 'exam'
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
  text: string;
  formula: string;
  params: any;
  correctAnswer: any;
  explanation: string;
  unit: string;
  type?: 'calculation' | 'theory';
  options?: string[];
}
