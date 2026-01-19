
import { ProgressData, ExamAttempt, UserStats, CourseType } from '../types';

const STORAGE_KEY = 'istec_progress_v1';

const defaultProgress: ProgressData = {
  stats: [],
  history: [],
  totalPoints: 0
};

export const getProgress = (): ProgressData => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : defaultProgress;
};

export const saveExamAttempt = (attempt: ExamAttempt) => {
  const p = getProgress();
  p.history.push(attempt);
  p.totalPoints += attempt.score * 10;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
};

export const updateStats = (module: CourseType, theme: string, isCorrect: boolean) => {
  const p = getProgress();
  let stat = p.stats.find(s => s.module === module && s.theme === theme);
  if (!stat) {
    stat = { module, theme, totalAnswered: 0, correctAnswers: 0 };
    p.stats.push(stat);
  }
  stat.totalAnswered++;
  if (isCorrect) stat.correctAnswers++;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
};
