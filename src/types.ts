// src/types.ts
export type HabitCategory = 'exercise' | 'mind' | 'health' | 'productivity';
export type HabitDifficulty = 'easy' | 'medium' | 'hard';
export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  frequency: HabitFrequency;
  streak: number;
  lastCompleted: string | null;
}

export interface UserState {
  totalXP: number;
  habits: Habit[];
}