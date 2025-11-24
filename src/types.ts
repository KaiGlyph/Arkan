export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  lastCompleted: string | null; // ISO string
  streak: number;
  difficulty: 'easy' | 'medium' | 'hard';
}