// src/hooks/useHabits.ts
import { useState, useEffect, useCallback } from 'react';
import type { 
  Habit, 
  UserState, 
  HabitCategory,
  InventoryItem,
  StatName,
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
  const getInitialState = (): UserState => ({
    totalXP: 0,
    habits: DEFAULT_HABITS,
    level: 1,
    attributes: {
      fuerza: 1,
      agilidad: 1,
      vitalidad: 1,
      inteligencia: 1,
      percepcion: 1,
      sense: 1,
    },
    energy: 85,
    health: 95,
    status: 'activo',
    illnesses: [],
    inventory: [],
    name: 'Jugador',
    age: 25,
    title: 'Aprendiz',
    updatedAt: new Date().toISOString(),
    unclaimedRewards: [],
  });

  const [state, setState] = useState<UserState>(getInitialState());

  const loadFromStorage = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserState;
          setState({
            ...getInitialState(),
            ...data,
            habits: mergeHabits(data.habits || [], DEFAULT_HABITS),
            attributes: { ...getInitialState().attributes, ...data.attributes },
            unclaimedRewards: data.unclaimedRewards || [],
            inventory: data.inventory || [],
          });
          return;
        }
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState({
          ...getInitialState(),
          ...parsed,
          habits: mergeHabits(parsed.habits || [], DEFAULT_HABITS),
          attributes: { ...getInitialState().attributes, ...parsed.attributes },
          unclaimedRewards: parsed.unclaimedRewards || [],
          inventory: parsed.inventory || [],
        });
      } else {
        setState(getInitialState());
      }
    } catch (e) {
      console.warn('Failed to load state', e);
      setState(getInitialState());
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, loadFromStorage);
    return () => unsubscribe();
  }, [loadFromStorage]);

  const saveState = useCallback(async (newState: UserState) => {
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
  }, []);

  // ✅ Nueva función: reclamar recompensa (puntos asignables o automáticos)
  const claimReward = useCallback((rewardId: string, assignedStats?: Partial<Record<StatName, number>>) => {
    const reward = state.unclaimedRewards.find(r => r.id === rewardId);
    if (!reward) return;

    let newAttributes = { ...state.attributes };
    let newUnclaimedRewards = state.unclaimedRewards.filter(r => r.id !== rewardId);

    if (reward.type === 'dailyMissions' && reward.stats.points) {
      // ✅ Asignar puntos manualmente (3 puntos libres)
      if (assignedStats) {
        (Object.keys(assignedStats) as StatName[]).forEach(stat => {
          newAttributes[stat] += assignedStats[stat] || 0;
        });
        // Registrar asignación
        newUnclaimedRewards.push({
          ...reward,
          claimedAt: new Date().toISOString(),
          stats: assignedStats,
        });
      }
    } else {
      // ✅ Aplicar stats directos (level up, quests)
      (Object.keys(reward.stats) as (StatName | 'points')[]).forEach(stat => {
        if (stat !== 'points') { // ✅ Ahora TypeScript entiende que `stat` puede ser 'points'
          newAttributes[stat as StatName] += reward.stats[stat] || 0;
        }
      });
      newUnclaimedRewards.push({
        ...reward,
        claimedAt: new Date().toISOString(),
      });
    }

    saveState({ ...state, attributes: newAttributes, unclaimedRewards: newUnclaimedRewards });
  }, [state, saveState]);

  // ✅ toggleHabit actualizado con sistema épico
  const toggleHabit = useCallback((habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit || habit.lastCompleted === today) return;

    const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
    const newStreak = habit.lastCompleted === yesterday ? habit.streak + 1 : 1;
    const energyCost = ENERGY_COST[habit.difficulty];
    const healthGain = habit.category === 'health' ? 2 : 
                      habit.category === 'exercise' || habit.category === 'mobility' ? 1 : 0;

    const xpReward = XP_BY_DIFFICULTY[habit.difficulty];
    const newTotalXP = state.totalXP + xpReward;
    const newLevel = calculateLevel(newTotalXP);
    const levelUp = newLevel > state.level;

    const updatedHabit: Habit = { ...habit, streak: newStreak, lastCompleted: today };
    const newHabits = state.habits.map(h => h.id === habitId ? updatedHabit : h);

    let newAttributes = { ...state.attributes };
    let newUnclaimedRewards = [...state.unclaimedRewards];

    // ✅ Subir nivel → +1 en TODAS las stats
    if (levelUp) {
      Object.keys(newAttributes).forEach(stat => {
        newAttributes[stat as StatName] += 1;
      });
      // Añadir recompensa (ya aplicada, pero registrada)
      newUnclaimedRewards.push({
        id: `levelup-${newLevel}`,
        type: 'levelUp',
        description: `¡Nivel ${newLevel}! +1 en todas las estadísticas`,
        stats: {
          fuerza: 1, agilidad: 1, vitalidad: 1,
          inteligencia: 1, percepcion: 1, sense: 1
        },
        createdAt: new Date().toISOString(),
        claimedAt: new Date().toISOString(),
      });
    }

    // ✅ Verificar si completó TODAS las misiones diarias
    const allCategories = Object.keys(ATTRIBUTE_BY_CATEGORY) as HabitCategory[];
    const allCompleted = allCategories.every(cat => 
      state.habits
        .filter(h => h.category === cat)
        .every(h => h.lastCompleted === today)
    );

    // ✅ Si completó todas: +3 puntos asignables (solo una vez al día)
    if (allCompleted && !newUnclaimedRewards.some(r => 
      r.type === 'dailyMissions' && 
      r.createdAt.split('T')[0] === today
    )) {
      newUnclaimedRewards.push({
        id: `daily-${today}`,
        type: 'dailyMissions',
        description: '✅ Misiones diarias completas',
        stats: { points: 3 },
        createdAt: new Date().toISOString(),
      });
    }

    const newState: UserState = {
      ...state,
      totalXP: newTotalXP,
      level: newLevel,
      habits: newHabits,
      attributes: newAttributes,
      unclaimedRewards: newUnclaimedRewards,
      energy: Math.max(0, Math.min(100, state.energy - energyCost)),
      health: Math.max(0, Math.min(100, state.health + healthGain)),
      status: state.energy < 30 ? 'cansado' : state.energy > 85 ? 'motivado' : 'activo',
    };

    saveState(newState);
  }, [state, saveState]);

  // 🎒 Inventario
  const addItem = useCallback((item: Omit<InventoryItem, 'id' | 'dateAcquired'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dateAcquired: new Date().toISOString(),
    };
    saveState({ ...state, inventory: [...state.inventory, newItem] });
  }, [state, saveState]);

  const removeItem = useCallback((itemId: string) => {
    saveState({ ...state, inventory: state.inventory.filter(i => i.id !== itemId) });
  }, [state, saveState]);

  // ✏️ Perfil
  const updateProfile = useCallback((newProfile: { name: string; age: number; title: string }) => {
    saveState({ ...state, ...newProfile });
  }, [state, saveState]);

  // 📅 Misiones diarias — 2 por categoría (ahora 6 categorías)
  const today = new Date().toISOString().split('T')[0];
  const allCategories = Object.keys(ATTRIBUTE_BY_CATEGORY) as HabitCategory[];

  const dailyMissions = allCategories.reduce((acc, category) => {
    const allHabits = state.habits.filter(h => h.category === category);
    const pending = allHabits.filter(h => h.lastCompleted !== today);
    const completed = allHabits.filter(h => h.lastCompleted === today);
    const missions = [...pending, ...completed].slice(0, 2);
    acc[category] = missions.length > 0 ? missions : null;
    return acc;
  }, {} as Record<HabitCategory, Habit[] | null>);

  // 📬 Recompensas pendientes
  const pendingRewards = state.unclaimedRewards.filter(r => !r.claimedAt);

  return {
    ...state,
    dailyMissions,
    pendingRewards,
    toggleHabit,
    claimReward,
    addItem,
    removeItem,
    updateProfile,
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