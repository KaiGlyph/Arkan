// src/hooks/useHabits.ts
import { useState, useEffect } from 'react';
import type { 
  Habit, 
  UserState, 
  HabitCategory,
  InventoryItem, // 👈 nuevo
} from '../types';
import { db, auth } from '../lib/firebase';
import { 
  doc, getDoc, setDoc 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
  XP_BY_DIFFICULTY,
  ENERGY_COST,
  ATTRIBUTE_BY_CATEGORY,
  DEFAULT_HABITS,
  STORAGE_KEY,
  calculateLevel,
  getXPToReachLevel,
  mergeHabits,
} from '../constants';

export const useHabits = () => {
  // Estado inicial realista
  const getInitialState = (): UserState => ({
    totalXP: 0,
    habits: DEFAULT_HABITS,
    level: 1,
    // 🧠 Atributos iniciales (nivel 1 = 1 en todos)
    attributes: {
      condicionFisica: 1,
      movilidad: 1,
      salud: 1,
      conocimiento: 1,
      atencion: 1,
      autocontrol: 1
    },
    energy: 85,   // Energía mental inicial
    health: 95,   // Salud inicial
    status: 'activo',
    illnesses: [],
    inventory: [], // 👈 nuevo
    name: 'Jugador',
    age: 25,
    title: 'Aprendiz',
    updatedAt: new Date().toISOString()
  });

  const [state, setState] = useState<UserState>(getInitialState());

  // 📥 Cargar desde localStorage
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState({
          ...getInitialState(),
          ...parsed,
          habits: mergeHabits(parsed.habits || [], DEFAULT_HABITS),
          attributes: { ...getInitialState().attributes, ...parsed.attributes },
          inventory: parsed.inventory || [], // 👈 nuevo
        });
      } else {
        setState(getInitialState());
      }
    } catch (e) {
      console.warn('Failed to parse state', e);
      setState(getInitialState());
    }
  };

  // 📥 Cargar desde Firestore
  const loadFromFirestore = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as UserState;
        // 👇 Fusionar con defaults para nuevos campos
        setState({
          ...getInitialState(),
          ...data,
          habits: mergeHabits(data.habits || [], DEFAULT_HABITS),
          attributes: { ...getInitialState().attributes, ...data.attributes },
          inventory: data.inventory || [], // 👈 nuevo
        });
      } else {
        setState(getInitialState());
      }
    } catch (e) {
      console.error('Firestore load failed', e);
      loadFromLocalStorage();
    }
  };

  // 🔁 Cargar datos al iniciar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        loadFromLocalStorage();
      } else {
        await loadFromFirestore(user.uid);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // 💾 Guardar estado
  const saveState = async (newState: UserState) => {
    const now = new Date().toISOString();
    const updatedState = { ...newState, updatedAt: now };
    setState(updatedState);
    
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), updatedState);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
      }
    } catch (e) {
      console.error('Failed to save state', e);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
    }
  };

  // ✅ Marcar hábito (lógica épica)
  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;
    if (habit.lastCompleted === today) return;

    // 📈 Calcular nuevo streak
    const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
    const newStreak = habit.lastCompleted === yesterday ? habit.streak + 1 : 1;

    // 💥 Efecto en energía y salud
    const energyCost = ENERGY_COST[habit.difficulty];
    const healthGain = habit.category === 'health' ? 2 : habit.category === 'exercise' ? 1 : 0;

    // 🧠 Atributo asociado
    const attribute = ATTRIBUTE_BY_CATEGORY[habit.category];
    const xpReward = XP_BY_DIFFICULTY[habit.difficulty];

    // 📊 Nuevo nivel
    const newTotalXP = state.totalXP + xpReward;
    const newLevel = calculateLevel(newTotalXP);
    const levelUp = newLevel > state.level;

    // 🧠 Subir atributo si completas la misión
    let newAttributes = { ...state.attributes };
    if (levelUp) {
      // Solo sube el atributo de la categoría completada HOY
      const completedToday = state.habits
        .filter(h => h.lastCompleted === today && h.category === habit.category)
        .length > 0;
      
      if (completedToday) {
        const currentVal = newAttributes[attribute];
        newAttributes[attribute] = currentVal + 1;
      }
    }

    // 📈 Nuevo estado
    const updatedHabit: Habit = { ...habit, streak: newStreak, lastCompleted: today };
    const newState: UserState = {
      ...state,
      totalXP: newTotalXP,
      level: newLevel,
      habits: [...state.habits.filter(h => h.id !== habitId), updatedHabit],
      attributes: newAttributes,
      energy: Math.max(0, Math.min(100, state.energy - energyCost + (levelUp ? 10 : 0))),
      health: Math.max(0, Math.min(100, state.health + healthGain)),
      status: state.energy < 30 ? 'cansado' : state.energy > 85 ? 'motivado' : 'activo',
    };

    saveState(newState);
  };

  // 🎒 Añadir item al inventario
  const addItem = (item: Omit<InventoryItem, 'id' | 'dateAcquired'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dateAcquired: new Date().toISOString(),
    };

    const newState = {
      ...state,
      inventory: [...state.inventory, newItem],
    };

    saveState(newState);
  };

  // 🗑️ Eliminar item del inventario
  const removeItem = (itemId: string) => {
    const newState = {
      ...state,
      inventory: state.inventory.filter(item => item.id !== itemId),
    };

    saveState(newState);
  };

  // ✏️ Actualizar perfil (nombre, edad, título)
  const updateProfile = (newProfile: { name: string; age: number; title: string }) => {
    const newState = {
      ...state,
      name: newProfile.name,
      age: newProfile.age,
      title: newProfile.title,
    };
    saveState(newState);
  };

  // 📅 Misiones diarias → mínimo 2 por categoría (pendientes > completados)
  const today = new Date().toISOString().split('T')[0];
  const categories: HabitCategory[] = ['exercise', 'mind', 'health', 'productivity'];

  const dailyMissions = categories.reduce((acc, category) => {
    const allHabits = state.habits.filter(h => h.category === category);
    
    // 1. Prioriza pendientes hoy (no completados)
    const pending = allHabits
      .filter(h => h.lastCompleted !== today)
      .sort((a, b) => 
        ({ hard: 3, medium: 2, easy: 1 }[a.difficulty] - 
         { hard: 3, medium: 2, easy: 1 }[b.difficulty])
      );

    // 2. Si hay <2 pendientes, añade completados (como repaso)
    const completed = allHabits
      .filter(h => h.lastCompleted === today)
      .sort((a, b) => 
        ({ hard: 3, medium: 2, easy: 1 }[a.difficulty] - 
         { hard: 3, medium: 2, easy: 1 }[b.difficulty])
      );

    // 3. Toma hasta 2 misiones (prioridad: pendientes > completados)
    const missions = [...pending, ...completed].slice(0, 2);
    
    // 4. Devuelve un array (no un solo hábito)
    acc[category] = missions.length > 0 ? missions : null;
    return acc;
  }, {} as Record<HabitCategory, Habit[] | null>);

  return {
    ...state,
    dailyMissions,
    toggleHabit,
    addItem,          // 👈 nuevo
    removeItem,       // 👈 nuevo
    updateProfile,    // 👈 nuevo
    xpToNextLevel: getXPToReachLevel(state.level + 1) - getXPToReachLevel(state.level),
    xpProgress: state.totalXP - getXPToReachLevel(state.level),
    progressPercent: Math.min(100, Math.round(
      (state.totalXP - getXPToReachLevel(state.level)) / 
      (getXPToReachLevel(state.level + 1) - getXPToReachLevel(state.level)) * 100
    )),
    name: state.name,
    age: state.age,
    title: state.title,
  };
};