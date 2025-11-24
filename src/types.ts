// src/types.ts
export type HabitDifficulty = 'easy' | 'medium' | 'hard';
export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  frequency: HabitFrequency;
  lastCompleted: string | null;
  streak: number;
  difficulty: HabitDifficulty;
  completedToday?: boolean;
}

export interface UserState {
  totalXP: number;
  habits: Habit[];
}