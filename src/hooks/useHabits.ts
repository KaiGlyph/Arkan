// src/hooks/useHabits.ts
import { useState, useEffect } from 'react';
import type { Habit, UserState, HabitCategory } from '../types';
import { db, auth } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc,
} from 'firebase/firestore';
import { 
  onAuthStateChanged,
} from 'firebase/auth';

const STORAGE_KEY = 'arkan_user_v1';

// 📊 XP por dificultad
const XP_BY_DIFFICULTY = {
  easy: 10,
  medium: 25,
  hard: 50,
} as const;

const getDefaultHabits = (): Habit[] => [
  // ✅ Ejercicio
  { id: 'push-ups-100', 
    name: '100 flexiones', 
    category: 'exercise', 
    difficulty: 'hard', 
    frequency: 'daily', 
    streak: 0, 
    lastCompleted: null },
  { id: 'run-5km', 
    name: 'Correr 5 km', 
    category: 'exercise', 
    difficulty: 'hard', 
    frequency: 'daily', 
    streak: 0, 
    lastCompleted: null },

  // ✅ Mente
  { id: 'read-10min', 
    name: 'Leer 10 min', 
    category: 'mind', 
    difficulty: 'easy', 
    frequency: 'daily', 
    streak: 0, 
    lastCompleted: null },
  { id: 'meditate-5min', 
    name: 'Meditar 5 min', 
    category: 'mind', 
    difficulty: 'medium', 
    frequency: 'daily', 
    streak: 0, 
    lastCompleted: null },

  // ✅ Salud
  { id: 'water-2l', 
    name: 'Beber 2L agua', 
    category: 'health', 
    difficulty: 'easy', 
    frequency: 'daily', 
    streak: 0, 
    lastCompleted: null },

  // ✅ Productividad
  { id: 'plan-day', 
    name: 'Planificar día', 
    category: 'productivity', 
    difficulty: 'medium', 
    frequency: 'daily', 
    streak: 0, 
    lastCompleted: null },
];

export const useHabits = () => {
  const [state, setState] = useState<UserState>({
    totalXP: 0,
    habits: getDefaultHabits(),
  });

  // 🔁 Cargar datos al iniciar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Auth falló → usar localStorage
        loadFromLocalStorage();
      } else {
        // Auth exitosa → cargar desde Firestore
        await loadFromFirestore(user.uid);
      }
    });
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        });
    }
    return () => unsubscribe();
  }, []);

  // 💾 Guardar estado
  const saveState = async (newState: UserState) => {
    setState(newState);
    try {
      const user = auth.currentUser;
      if (user) {
        // Guardar en Firestore
        await setDoc(doc(db, 'users', user.uid), {
          ...newState,
          updatedAt: new Date(),
        });
      } else {
        // Fallback a localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      }
    } catch (e) {
      console.error('Failed to save state', e);
      // Si Firestore falla, guardar en localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }
  };

  // 📥 Cargar desde Firestore
  const loadFromFirestore = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as UserState;
        const savedHabits = data.habits || [];
        const defaultHabits = getDefaultHabits();

        // 👇 Fusiona SIEMPRE: mantiene los datos guardados, pero añade nuevos hábitos por id
        const mergedHabits = [...savedHabits];
        defaultHabits.forEach((def) => {
          if (!mergedHabits.some((h: any) => h.id === def.id)) {
            mergedHabits.push(def);
          }
        });

        setState({
          totalXP: data.totalXP ?? 0,
          habits: mergedHabits,
        });
      } else {
        setState({ totalXP: 0, habits: getDefaultHabits() });
      }
    } catch (e) {
      console.error('Firestore load failed', e);
      loadFromLocalStorage(); // Fallback
    }
  };

  // 📥 Cargar desde localStorage (fallback)
  const loadFromLocalStorage = () => {
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

  // 🧭 Misiones diarias por categoría
  const categories: HabitCategory[] = ['exercise', 'mind', 'health', 'productivity'];
  const dailyMissions = categories.reduce((acc, category) => {
    const pending = state.habits
      .filter(h => h.category === category && h.lastCompleted !== today)
      .sort((a, b) => 
        ({ hard: 3, medium: 2, easy: 1 }[a.difficulty] - 
         { hard: 3, medium: 2, easy: 1 }[b.difficulty])
      );
    acc[category] = pending[0] || null; // null si todos completados
    return acc;
  }, {} as Record<HabitCategory, Habit | null>);

  return {
    level: currentLevel,
    xpProgress,
    xpNeeded,
    progressPercent,
    habits: state.habits,
    dailyMissions, // 👈 nuevo
    toggleHabit,
    completedToday,
  };
};