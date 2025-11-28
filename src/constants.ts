// src/constants.ts
import type { 
  HabitDifficulty, 
  HabitCategory, 
  StatName, 
  Habit, 
  ItemRarity, 
  ItemCategory 
} from './types';

// 📊 XP por dificultad
export const XP_BY_DIFFICULTY: Record<HabitDifficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
} as const;

// 💥 Costo de energía por dificultad
export const ENERGY_COST: Record<HabitDifficulty, number> = {
  easy: 3,
  medium: 6,
  hard: 10,
} as const;

// 🧠 Atributo asociado a cada categoría — ✅ ahora 1:1 con stats
export const ATTRIBUTE_BY_CATEGORY: Record<HabitCategory, StatName> = {
  exercise: 'fuerza',      // flexiones, correr
  mobility: 'agilidad',    // estiramientos, yoga
  health: 'vitalidad',     // agua, sueño
  mind: 'inteligencia',    // leer, aprender
  productivity: 'percepcion', // planificar, foco
  discipline: 'sense',     // meditar, ayunar
} as const;

// 🏷️ Nombres amigables para mostrar en UI (versión corta)
export const ATTRIBUTE_NAMES: Record<StatName, string> = {
  fuerza: 'Fuerza',
  agilidad: 'Agilidad',
  vitalidad: 'Vitalidad',
  inteligencia: 'Inteligencia',
  percepcion: 'Percepción',
  sense: 'Sense',
} as const;

// 🎮 Nombres de display — ✅ ya usabas estos nombres en HUD; ahora el tipo coincide
export const DISPLAY_NAMES = ATTRIBUTE_NAMES; // ✅ alias directo

// 📈 Funciones de cálculo de nivel
export const calculateLevel = (xp: number): number => {
  if (xp <= 0) return 1;
  let level = 1;
  while (getXPToReachLevel(level + 1) <= xp) level++;
  return level;
};

export const getXPToReachLevel = (level: number): number => {
  if (level <= 1) return 0;
  let total = 0;
  for (let l = 2; l <= level; l++) {
    total += 50 * l * (l - 1);
  }
  return total;
};

// 🔀 Fusión segura de hábitos
export const mergeHabits = (saved: Habit[], defaults: Habit[]): Habit[] => {
  const merged = [...saved];
  defaults.forEach(def => {
    if (!merged.some(h => h.id === def.id)) {
      merged.push(def);
    }
  });
  return merged;
};

// 🎯 Hábitos por defecto — ✅ 2 por categoría (12 misiones)
export const DEFAULT_HABITS: Habit[] = [
  // 💪 Fuerza
  { id: 'push-ups-50', name: '50 flexiones', category: 'exercise', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'run-3km', name: 'Correr 3 km', category: 'exercise', difficulty: 'hard', frequency: 'daily', streak: 0, lastCompleted: null },

  // 🧘 Agilidad
  { id: 'stretch-15min', name: 'Estiramientos 15 min', category: 'mobility', difficulty: 'easy', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'yoga-20min', name: 'Yoga 20 min', category: 'mobility', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },

  // ❤️ Vitalidad
  { id: 'water-2l', name: 'Beber 2L agua', category: 'health', difficulty: 'easy', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'sleep-7h', name: 'Dormir 7h+', category: 'health', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },

  // 🧠 Inteligencia
  { id: 'read-15min', name: 'Leer 15 min', category: 'mind', difficulty: 'easy', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'learn-skill', name: 'Aprender algo nuevo', category: 'mind', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },

  // 👁️ Percepción
  { id: 'plan-day', name: 'Planificar día', category: 'productivity', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'deep-work-1h', name: 'Trabajo profundo 1h', category: 'productivity', difficulty: 'hard', frequency: 'daily', streak: 0, lastCompleted: null },

  // 🧘 Sense
  { id: 'meditate-10min', name: 'Meditar 10 min', category: 'discipline', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'digital-detox', name: 'Sin redes 1h', category: 'discipline', difficulty: 'hard', frequency: 'daily', streak: 0, lastCompleted: null },
];

// 🎨 Colores de rareza
export const RARITY_COLORS: Record<ItemRarity, string> = {
  normal: '#9E9E9E',
  raro: '#2196F3',
  elite: '#9C27B0',
  legendario: '#FF9800',
} as const;

export const RARITY_NAMES: Record<ItemRarity, string> = {
  normal: 'Normal',
  raro: 'Raro',
  elite: 'Élite',
  legendario: 'Legendario',
};

export const ITEM_CATEGORY_NAMES: Record<ItemCategory, string> = {
  herramientas: 'Herramientas',
  documentos: 'Documentos',
  personales: 'Personales',
  ropa: 'Ropa',
  libros: 'Libros',
  cursos: 'Cursos',
};

// 💾 Clave de localStorage
export const STORAGE_KEY = 'arkan_user_v1';

// 🎨 Colores de estado
export const STATUS_COLORS = {
  activo: '#4CAF50',
  cansado: '#FF9800',
  motivado: '#2196F3',
  estresado: '#F44336',
} as const;

export const STATUS_TEXT = {
  activo: 'Activo',
  cansado: 'Cansado',
  motivado: 'Motivado',
  estresado: 'Estresado',
} as const;

// 🎨 Colores de categorías (para bordes de misiones)
export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  exercise: '#FF6B6B',
  mobility: '#4CAF50',
  health: '#00D2D3',
  mind: '#6C5CE7',
  productivity: '#FFA502',
  discipline: '#9C27B0',
} as const;

// 🎨 Tema visual épico
export const EPIC_THEME = {
  colors: {
    bgPrimary: '#25153A',
    bgSecondary: '#33244A',
    bgCard: 'rgba(40, 30, 60, 0.6)',
    bgModal: 'rgba(25, 15, 40, 0.95)',
    accent: '#B18CFF',
    accentLight: '#D8B4FE',
    accentGlow: 'rgba(177, 140, 255, 0.4)',
    rarity: RARITY_COLORS,
    status: STATUS_COLORS,
  },
  typography: {
    heading: "'Orbitron', sans-serif",
    subtitle: "'Rajdhani', sans-serif",
    body: "'Inter', sans-serif",
  },
  shadows: {
    modal: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 60px rgba(100, 50, 150, 0.05)',
    border: 'inset 0 0 20px rgba(177, 140, 255, 0.1)',
    glow: '0 0 20px rgba(177, 140, 255, 0.5)',
    card: '0 2px 8px rgba(0, 0, 0, 0.3)',
    cardActive: '0 0 15px rgba(177, 140, 255, 0.3)',
  },
  borderRadius: {
    card: '10px',
    modal: '16px',
    button: '8px',
    corner: '20px',
  },
  animations: {
    shimmer: `@keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }`,
  },
} as const;