import { useState, useEffect } from 'react';
import type { Habit } from '../types';

const STORAGE_KEY = 'arkan-habits';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Leer 10 min',
        frequency: 'daily',
        lastCompleted: null,
        streak: 0,
        difficulty: 'easy',
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;
      
      const today = new Date().toISOString().split('T')[0];
      const wasCompletedToday = habit.lastCompleted === today;
      
      return {
        ...habit,
        lastCompleted: wasCompletedToday ? null : today,
        streak: wasCompletedToday ? habit.streak - 1 : habit.streak + 1,
      };
    }));
  };

  return { habits, toggleHabit };
}