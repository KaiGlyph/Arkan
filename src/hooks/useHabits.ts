// src/hooks/useHabits.ts
import { useState, useEffect } from 'react';
import type { Habit, UserState } from '../types';

const STORAGE_KEY = 'arkan_user_v1';

// 📊 XP por dificultad
const XP_BY_DIFFICULTY = {
  easy: 10,
  medium: 25,
  hard: 50,
} as const;

const getDefaultHabits = (): Habit[] => [
  {
    id: 'read-10min',
    name: 'Leer 10 min',
    frequency: 'daily',
    difficulty: 'easy',
    streak: 0,
    lastCompleted: null,
  },
  {
    id: 'push-ups-100',
    name: 'Hacer 100 flexiones',
    frequency: 'daily',
    difficulty: 'hard',
    streak: 0,
    lastCompleted: null,
  },
];

export const useHabits = () => {
  const [state, setState] = useState<UserState>({
    totalXP: 0,
    habits: getDefaultHabits(),
  });

  // 🔁 Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedHabits = parsed.habits || [];
        const defaultHabits = getDefaultHabits();

        // Fusionar: usar savedHabits, y añadir defaults que falten por id
        const mergedHabits = [...savedHabits];
        defaultHabits.forEach((def) => {
          if (!mergedHabits.some((h: any) => h.id === def.id)) {
            mergedHabits.push(def);
          }
        });

        setState({
          totalXP: parsed.totalXP ?? 0,
          habits: mergedHabits,
        });
      } catch (e) {
        console.warn('Failed to parse state, using defaults', e);
        setState({ totalXP: 0, habits: getDefaultHabits() });
      }
    } else {
      // Si no hay nada guardado, usar defaults
      setState({ totalXP: 0, habits: getDefaultHabits() });
    }
  }, []);

  // 💾 Guardar
  const saveState = (newState: UserState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  };

  // ✅ Marcar hábito
  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habit = state.habits.find((h) => h.id === habitId);

    if (!habit) return;

    // Evitar duplicados hoy
    if (habit.lastCompleted === today) return;

    // Calcular racha
    const yesterday = new Date(Date.now() - 864e5)
      .toISOString()
      .split('T')[0];
    const newStreak =
      habit.lastCompleted === yesterday ? habit.streak + 1 : 1;

    // 👇 XP dinámico por dificultad
    const xpReward = XP_BY_DIFFICULTY[habit.difficulty];

    const updatedHabit: Habit = {
      ...habit,
      streak: newStreak,
      lastCompleted: today,
    };

    const newState: UserState = {
      totalXP: state.totalXP + xpReward,
      habits: [...state.habits.filter((h) => h.id !== habitId), updatedHabit],
    };

    saveState(newState);
  };

  // 📈 Nivel y progreso
  const getXPToReachLevel = (level: number): number => {
    if (level <= 1) return 0;
    let total = 0;
    for (let l = 2; l <= level; l++) {
      total += 50 * l * (l - 1);
    }
    return total;
  };

  const currentLevel = (() => {
    let level = 1;
    while (getXPToReachLevel(level + 1) <= state.totalXP) level++;
    return level;
  })();

  const totalXPForNext = getXPToReachLevel(currentLevel + 1);
  const totalXPForCurrent = getXPToReachLevel(currentLevel);
  const xpProgress = state.totalXP - totalXPForCurrent;
  const xpNeeded = totalXPForNext - totalXPForCurrent;
  const progressPercent =
    xpNeeded > 0
      ? Math.min(100, Math.round((xpProgress / xpNeeded) * 100))
      : 100;

  // 📅 ¿Completado hoy? (solo para el primer hábito por ahora — opcional)
  const today = new Date().toISOString().split('T')[0];
  const readHabit = state.habits.find((h) => h.id === 'read-10min');
  const completedToday = readHabit?.lastCompleted === today;

  return {
    level: currentLevel,
    xpProgress,
    xpNeeded,
    progressPercent,
    habits: state.habits,
    toggleHabit,
    completedToday,
  };
};