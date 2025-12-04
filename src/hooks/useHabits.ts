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
//  ENERGY_COST,
  ATTRIBUTE_BY_CATEGORY,
  DEFAULT_HABITS,
  calculateLevel,
  getXPToReachLevel,
  mergeHabits,
  ITEM_CATALOG,
  TITLE_CATALOG,
  INITIAL_FRACTAL, 
  INITIAL_XYN,
//  FRACTAL_BY_DIFFICULTY,
} from '../constants/constants';

// 🎁 Recompensas especiales para títulos únicos
const SPECIAL_TITLE_REWARDS: Record<string, Omit<InventoryItem, 'id' | 'dateAcquired'>> = {
  favor_del_sistema: ITEM_CATALOG.potion_xp_supreme,
};

// ✅ Función para verificar si todas las misiones están completadas HOY
//const areAllMissionsCompletedToday = (habits: Habit[]): boolean => {
//  const today = new Date().toISOString().split('T')[0];
//  const allCategories = Object.keys(ATTRIBUTE_BY_CATEGORY) as HabitCategory[];
//  const now = new Date();
//  const startOfYear = new Date(now.getFullYear(), 0, 0);
//  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
//
//  return allCategories.every(cat => {
//    const allHabits = habits.filter(h => h.category === cat);
//    if (allHabits.length === 0) return false;
//    const missionIndex = dayOfYear % allHabits.length;
//    const selectedHabit = allHabits[missionIndex];
//    return selectedHabit.lastCompleted === today;
//  });
//};

// Función auxiliar para calcular racha desde historial
const calculateCurrentStreak = (history: string[]): number => {
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  let streak = 0;
  let checkDate = new Date();
  
  for (let i = 0; i < sortedHistory.length; i++) {
    const historyDate = sortedHistory[i];
    const expectedDate = new Date(checkDate);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (historyDate === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

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
    title: 'none',
    bio: '',
    streakHistory: [],
    updatedAt: new Date().toISOString(),
    unclaimedRewards: [],
    titles: TITLE_CATALOG.map(t => ({ ...t })),
    activeTitle: null,
    fractal: INITIAL_FRACTAL,
    xyn: INITIAL_XYN,  
  });

  const [state, setState] = useState<UserState>(getInitialState());
  const storageKey = (uid?: string | null) => (uid ? `arkan_user_v1_${uid}` : 'arkan_user_v1_guest');

  const loadFromStorage = useCallback(async () => {
    try {
      const user = auth.currentUser;
      const localRaw = localStorage.getItem(storageKey(user?.uid || null));
      const localParsed: Partial<UserState> | null = localRaw ? JSON.parse(localRaw) : null;

      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const remote = docSnap.data() as UserState;
          const localIsNewer = !!(localParsed?.updatedAt && remote.updatedAt && (new Date(localParsed.updatedAt) > new Date(remote.updatedAt)));
          
          if (localParsed && localIsNewer) {
            const candidate: UserState = {
              ...getInitialState(),
              ...localParsed,
              habits: mergeHabits((localParsed.habits as any[]) || [], DEFAULT_HABITS),
              attributes: { ...getInitialState().attributes, ...(localParsed.attributes || {}) },
              unclaimedRewards: (localParsed.unclaimedRewards as any[]) || [],
              inventory: (localParsed.inventory as any[]) || [],
              titles: (localParsed.titles as any[]) || TITLE_CATALOG.map(t => ({ ...t })),
              activeTitle: localParsed.activeTitle || null,
              updatedAt: localParsed.updatedAt!,
            } as UserState;
            try {
              await setDoc(docRef, candidate);
            } catch {}
            setState(candidate);
            localStorage.setItem(storageKey(user.uid), JSON.stringify(candidate));
            return;
          }

          const mergedRemote: UserState = {
            ...getInitialState(),
            ...remote,
            habits: mergeHabits(remote.habits || [], DEFAULT_HABITS),
            attributes: { ...getInitialState().attributes, ...remote.attributes },
            unclaimedRewards: remote.unclaimedRewards || [],
            inventory: remote.inventory || [],
            titles: remote.titles || TITLE_CATALOG.map(t => ({ ...t })),
            activeTitle: remote.activeTitle || null,
          };
          setState(mergedRemote);
          localStorage.setItem(storageKey(user.uid), JSON.stringify(mergedRemote));
          return;
        } else {
          const candidate: UserState = {
            ...getInitialState(),
            ...(localParsed || {}),
            habits: mergeHabits((localParsed?.habits as any[]) || [], DEFAULT_HABITS),
            attributes: { ...getInitialState().attributes, ...(localParsed?.attributes || {}) },
            unclaimedRewards: (localParsed?.unclaimedRewards as any[]) || [],
            inventory: (localParsed?.inventory as any[]) || [],
            titles: (localParsed?.titles as any[]) || TITLE_CATALOG.map(t => ({ ...t })),
            activeTitle: localParsed?.activeTitle || null,
            updatedAt: localParsed?.updatedAt || new Date().toISOString(),
          } as UserState;
          try {
            await setDoc(docRef, candidate);
          } catch {}
          setState(candidate);
          localStorage.setItem(storageKey(user.uid), JSON.stringify(candidate));
          return;
        }
      }

      if (localParsed) {
        const mergedLocal: UserState = {
          ...getInitialState(),
          ...localParsed,
          habits: mergeHabits((localParsed.habits as any[]) || [], DEFAULT_HABITS),
          attributes: { ...getInitialState().attributes, ...(localParsed.attributes || {}) },
          unclaimedRewards: (localParsed.unclaimedRewards as any[]) || [],
          inventory: (localParsed.inventory as any[]) || [],
          titles: (localParsed.titles as any[]) || TITLE_CATALOG.map(t => ({ ...t })),
          activeTitle: localParsed.activeTitle || null,
        } as UserState;
        setState(mergedLocal);
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
      }
    } catch (e) {
      console.error('Failed to save state', e);
    } finally {
      try {
        const current = auth.currentUser;
        localStorage.setItem(storageKey(current?.uid || null), JSON.stringify(updatedState));
      } catch {}
    }
  }, []);

  // 🏆 Aplicar bonus del título activo
//  const applyTitleBonus = useCallback((baseXP: number): number => {
//    const activeTitle = state.titles.find(t => t.id === state.activeTitle);
//    if (!activeTitle || !activeTitle.bonus.xpMultiplier) return baseXP;
//    return Math.round(baseXP * activeTitle.bonus.xpMultiplier);
//  }, [state.titles, state.activeTitle]);

  // 🏆 Activar/desactivar título
  const setActiveTitle = useCallback((titleId: string | null) => {
    const title = titleId ? state.titles.find(t => t.id === titleId) : null;
    if (titleId && (!title || !title.unlocked)) return;

    let newAttributes = { ...state.attributes };
    const oldTitle = state.titles.find(t => t.id === state.activeTitle);
    const newTitle = title;

    // Quitar bonus del título anterior
    if (oldTitle && oldTitle.bonus.stats) {
      Object.entries(oldTitle.bonus.stats).forEach(([stat, value]) => {
        newAttributes[stat as StatName] = Math.max(1, newAttributes[stat as StatName] - (value || 0));
      });
    }

    // Aplicar bonus del nuevo título
    if (newTitle && newTitle.bonus.stats) {
      Object.entries(newTitle.bonus.stats).forEach(([stat, value]) => {
        newAttributes[stat as StatName] += value || 0;
      });
    }

    saveState({ 
      ...state, 
      activeTitle: titleId, 
      attributes: newAttributes 
    });
  }, [state, saveState]);

  // ✅ 1. addItem debe ir PRIMERO (usado por grantRandomItem y checkSpecialTitles)
  const addItem = useCallback((item: Omit<InventoryItem, 'id' | 'dateAcquired'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dateAcquired: new Date().toISOString(),
      quantity: item.quantity || 1,
    };
    
    if (item.consumable && !item.unique) {
      const existing = state.inventory.find(i => 
        i.name === item.name && i.consumable && !i.unique
      );
      
      if (existing) {
        const updatedInventory = state.inventory.map(i => 
          i.id === existing.id 
            ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) }
            : i
        );
        saveState({ ...state, inventory: updatedInventory });
        return;
      }
    }
    
    if (item.unique) {
      const hasUnique = state.inventory.some(i => i.name === item.name && i.unique);
      if (hasUnique) return;
    }
    
    saveState({ ...state, inventory: [...state.inventory, newItem] });
  }, [state, saveState]);

  // ✅ 2. grantRandomItem debe ir DESPUÉS de addItem (usa addItem)
  const grantRandomItem = useCallback(() => {
    const roll = Math.random() * 100;
    let itemKey: keyof typeof ITEM_CATALOG;
    
    if (roll < 2) {
      itemKey = Math.random() < 0.5 ? 'shield_forgiveness' : 'streak_crystal';
    } else if (roll < 10) {
      const epics = ['potion_xp_supreme', 'time_clock', 'reroll_gem'] as const;
      itemKey = epics[Math.floor(Math.random() * epics.length)];
    } else if (roll < 30) {
      const rares = ['potion_xp_major', 'duplicate_scroll'] as const;
      itemKey = rares[Math.floor(Math.random() * rares.length)];
    } else {
      itemKey = 'potion_xp_minor';
    }
    
    const itemTemplate = ITEM_CATALOG[itemKey];
    addItem(itemTemplate);
    
    return itemTemplate.name;
  }, [addItem]);

  // ✅ 3. checkSpecialTitles va DESPUÉS de addItem y grantRandomItem
  const checkSpecialTitles = useCallback((newState: UserState): UserState => {
    let updatedTitles = [...newState.titles];
    let hasNewUnlocks = false;

    const unlockTitle = (id: string) => {
      const idx = updatedTitles.findIndex(t => t.id === id);
      if (idx !== -1 && !updatedTitles[idx].unlocked) {
        updatedTitles[idx] = {
          ...updatedTitles[idx],
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
        hasNewUnlocks = true;
        // 🎁 Otorgar recompensa automática si existe
        const rewardItem = SPECIAL_TITLE_REWARDS[id];
        if (rewardItem) {
          addItem(rewardItem);
        }
        // 🔔 Notificación push (para móviles)
        if (typeof window !== 'undefined' && Notification.permission === 'granted') {
          new Notification('🎁 ¡EVENTO SECRETO!', {
            body: `¡${updatedTitles[idx].name} desbloqueado! ${updatedTitles[idx].description}`,
            icon: '/Arkan-Logo.png',
          });
        }
      }
    };

    // 🔍 Favor del Sistema: 1 de enero, 00:00–00:05
    const now = new Date();
    const isJan1 = now.getDate() === 1 && now.getMonth() === 0; // Enero = 0
    const hour = now.getHours();
    const minute = now.getMinutes();
    const isMidnightWindow = hour === 0 && minute < 6;

    if (
      isJan1 &&
      isMidnightWindow &&
      !newState.titles.find(t => t.id === 'favor_del_sistema')?.unlocked
    ) {
      unlockTitle('favor_del_sistema');

      // 🎁 Bonus: ítem aleatorio como regalo del Sistema
      const itemName = grantRandomItem();
      console.log(`🎁 ¡El Sistema te ha otorgado: ${itemName}!`);

      if (typeof window !== 'undefined' && Notification.permission === 'granted') {
        new Notification('🎁 ¡Regalo del Sistema!', {
          body: `¡Has recibido: ${itemName}!`,
          icon: '/Arkan-Logo.png',
        });
      }
    }

    return hasNewUnlocks ? { ...newState, titles: updatedTitles } : newState;
  }, [addItem, grantRandomItem]);

  // 🏆 Verificar y desbloquear títulos (por racha/nivel)
//  const checkAndUnlockTitles = useCallback((newState: UserState, currentStreak: number): UserState => {
//    let updatedTitles = [...newState.titles];
//    let hasNewUnlocks = false;
//
//    updatedTitles = updatedTitles.map(title => {
//      if (title.unlocked) return title;
//
//      let shouldUnlock = false;
//
//      switch (title.requirement.type) {
//        case 'initial': shouldUnlock = true; break;
//        case 'streak': shouldUnlock = currentStreak >= (title.requirement.value || 0); break;
//        case 'level': shouldUnlock = newState.level >= (title.requirement.value || 0); break;
//        case 'special': break; // manejado en checkSpecialTitles
//      }
//
//      if (shouldUnlock) {
//        hasNewUnlocks = true;
//        return { ...title, unlocked: true, unlockedAt: new Date().toISOString() };
//      }
//      return title;
//    });
//
//    return hasNewUnlocks ? { ...newState, titles: updatedTitles } : newState;
//  }, []);

  // 4. toggleHabit: ahora llama a grantRandomItem al completar todas las misiones
const toggleHabit = useCallback((habitId: string) => {
  const habit = state.habits.find(h => h.id === habitId);
  if (!habit) return;

  const today = new Date().toISOString().split('T')[0];
  const alreadyCompleted = habit.lastCompleted === today;

  if (alreadyCompleted) return;

  const xpGain = XP_BY_DIFFICULTY[habit.difficulty];
  const newXP = state.totalXP + xpGain;
  
  // Función para calcular nivel
  const calculateLevel = (xp: number) => {
    if (xp <= 0) return 1;
    let level = 1;
    let total = 0;
    while (total + (50 * (level + 1) * level) <= xp) {
      total += 50 * (level + 1) * level;
      level++;
    }
    return level;
  };
  
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > state.level;

  let newAttributes = { ...state.attributes };
  let newUnclaimedRewards = [...state.unclaimedRewards];
  let newFractal = state.fractal || 0; // ✅ Con fallback por si es undefined

  // ✅ Actualizar hábito como completado
  const updatedHabits = state.habits.map(h =>
    h.id === habitId
      ? { ...h, lastCompleted: today, completedCount: (h.completedCount || 0) + 1 }
      : h
  );

  // 🎁 VERIFICAR SI TODAS LAS MISIONES ESTÁN COMPLETAS
  const allMissionsCompleted = updatedHabits.every(h => h.lastCompleted === today);
  
  // ✅ Verificar si ya recibió la recompensa diaria hoy
  const dailyRewardKey = `daily-completion-${today}`;
  const alreadyReceivedDailyReward = state.unclaimedRewards.some(
    r => r.id === dailyRewardKey
  );

  if (allMissionsCompleted && !alreadyReceivedDailyReward) {
    // 🎉 ¡BONUS POR COMPLETAR TODAS LAS MISIONES!
    newFractal += 5;
    
    newUnclaimedRewards.push({
      id: dailyRewardKey,
      type: 'dailyCompletion',
      description: '🎊 ¡Todas las misiones diarias completadas!',
      stats: {},
      createdAt: new Date().toISOString(),
      claimedAt: null,
    });
  }

  // 📈 Subida de nivel
  if (leveledUp) {
    const levelsGained = newLevel - state.level;
    Object.keys(newAttributes).forEach(stat => {
      newAttributes[stat as keyof typeof newAttributes] += levelsGained;
    });

    newUnclaimedRewards.push({
      id: `levelup-${newLevel}-${Date.now()}`,
      type: 'levelUp',
      description: `¡Nivel ${newLevel} alcanzado! +${levelsGained} en todas las estadísticas`,
      stats: {
        fuerza: levelsGained,
        agilidad: levelsGained,
        vitalidad: levelsGained,
        inteligencia: levelsGained,
        percepcion: levelsGained,
        sense: levelsGained,
      },
      createdAt: new Date().toISOString(),
      claimedAt: null,
    });
  }

  // 💾 Guardar estado
  saveState({
    ...state,
    habits: updatedHabits,
    totalXP: newXP,
    level: newLevel,
    attributes: newAttributes,
    unclaimedRewards: newUnclaimedRewards,
    fractal: newFractal, // ✅ Guardar los fractales
  });
}, [state, saveState]);

const claimReward = useCallback((rewardId: string, pointDistribution?: Partial<Record<StatName, number>>) => {
  const reward = state.unclaimedRewards.find(r => r.id === rewardId);
  if (!reward) return;

  let newAttributes = { ...state.attributes };
  let newFractal = state.fractal;

  // ✅ Si es recompensa de completar todas las misiones diarias
  if (reward.type === 'dailyCompletion') {
    // Los fractales ya se agregaron, solo marcar como reclamado
    const updatedRewards = state.unclaimedRewards.filter(r => r.id !== rewardId);
    
    saveState({
      ...state,
      unclaimedRewards: updatedRewards,
    });
    return;
  }

  // Si tiene puntos asignables
  if (reward.stats.points && pointDistribution) {
    const totalAssigned = Object.values(pointDistribution).reduce((sum, v) => sum + (v || 0), 0);
    if (totalAssigned !== reward.stats.points) return;

    Object.entries(pointDistribution).forEach(([stat, value]) => {
      if (value) {
        newAttributes[stat as StatName] += value;
      }
    });
  } else {
    // Aplicar stats automáticamente
    Object.entries(reward.stats).forEach(([stat, value]) => {
      if (stat !== 'points' && value) {
        newAttributes[stat as StatName] += value;
      }
    });
  }

  const updatedRewards = state.unclaimedRewards.filter(r => r.id !== rewardId);

  saveState({
    ...state,
    attributes: newAttributes,
    fractal: newFractal,
    unclaimedRewards: updatedRewards,
  });
}, [state, saveState]);

  const removeItem = useCallback((itemId: string, quantity = 1) => {
    const item = state.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    if (item.quantity && item.quantity > quantity) {
      const updatedInventory = state.inventory.map(i =>
        i.id === itemId ? { ...i, quantity: (i.quantity || 1) - quantity } : i
      );
      saveState({ ...state, inventory: updatedInventory });
    } else {
      saveState({ ...state, inventory: state.inventory.filter(i => i.id !== itemId) });
    }
  }, [state, saveState]);

  const useItem = useCallback((itemId: string) => {
    const item = state.inventory.find(i => i.id === itemId);
    if (!item || !item.effect) return;

    let newState = { ...state };
    
    switch (item.effect.type) {
      case 'xp_boost':
        const xpValue = item.effect.value || 0;
        const newTotalXP = state.totalXP + xpValue;
        const newLevel = calculateLevel(newTotalXP);
        const levelUp = newLevel > state.level;
        
        newState.totalXP = newTotalXP;
        newState.level = newLevel;
        
        if (levelUp) {
          Object.keys(newState.attributes).forEach(stat => {
            newState.attributes[stat as StatName] += 1;
          });
          newState.unclaimedRewards.push({
            id: `levelup-${newLevel}`,
            type: 'levelUp',
            description: `¡Nivel ${newLevel}! +1 en todas las estadísticas`,
            stats: { fuerza: 1, agilidad: 1, vitalidad: 1, inteligencia: 1, percepcion: 1, sense: 1 },
            createdAt: new Date().toISOString(),
            claimedAt: new Date().toISOString(),
          });
        }
        break;
        
      default:
        console.log('Efecto no implementado aún:', item.effect.type);
        return;
    }
    
    if (item.consumable) {
      if (item.quantity && item.quantity > 1) {
        newState.inventory = newState.inventory.map(i =>
          i.id === itemId ? { ...i, quantity: (i.quantity || 1) - 1 } : i
        );
      } else {
        newState.inventory = newState.inventory.filter(i => i.id !== itemId);
      }
    }
    
    saveState(newState);
  }, [state, saveState]);

  const updateProfile = useCallback((newProfile: { name: string; age: number; title: string; bio: string }) => {
    saveState({ ...state, ...newProfile });
  }, [state, saveState]);

  const calculateSuccessRate = useCallback(() => {
    const last30Days: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last30Days.push(date.toISOString().split('T')[0]);
    }
    
    const completedDays = last30Days.filter(date => 
      (state.streakHistory || []).includes(date)
    ).length;
    
    return Math.round((completedDays / 30) * 100);
  }, [state.streakHistory]);

  const currentStreak = calculateCurrentStreak(state.streakHistory);
  const successRate = calculateSuccessRate();

  const allCategories = Object.keys(ATTRIBUTE_BY_CATEGORY) as HabitCategory[];
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);

  const dailyMissions = allCategories.reduce((acc, category) => {
    const allHabits = state.habits.filter(h => h.category === category);
    if (allHabits.length === 0) {
      acc[category] = null;
      return acc;
    }
    
    const missionIndex = dayOfYear % allHabits.length;
    const selectedHabit = allHabits[missionIndex];
    
    acc[category] = [selectedHabit];
    return acc;
  }, {} as Record<HabitCategory, Habit[] | null>);

  const pendingRewards = state.unclaimedRewards.filter(r => !r.claimedAt);

  return {
    ...state,
    dailyMissions,
    pendingRewards,
    toggleHabit,
    claimReward,
    addItem,
    removeItem,
    useItem,
    updateProfile,
    currentStreak,
    successRate,
    xpToNextLevel: getXPToReachLevel(state.level + 1) - getXPToReachLevel(state.level),
    xpProgress: state.totalXP - getXPToReachLevel(state.level),
    progressPercent: Math.min(100, Math.round(
      (state.totalXP - getXPToReachLevel(state.level)) / 
      (getXPToReachLevel(state.level + 1) - getXPToReachLevel(state.level)) * 100
    )),
    name: state.name,
    age: state.age,
    title: state.title,
    bio: state.bio || '',
    setActiveTitle,
    activeTitleData: state.titles.find(t => t.id === state.activeTitle) || null,
    checkSpecialTitles,
    state,
    saveState,
  };
};