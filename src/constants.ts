// src/constants.ts
import type { HabitDifficulty, HabitCategory, RealAttribute, Habit, ItemRarity, ItemCategory} from './types';

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

// 🧠 Atributo asociado a cada categoría
export const ATTRIBUTE_BY_CATEGORY: Record<HabitCategory, RealAttribute> = {
  exercise: 'condicionFisica',
  mind: 'conocimiento',
  health: 'salud',
  productivity: 'atencion',
} as const;

// 🏷️ Nombres amigables para mostrar en UI (versión corta)
export const ATTRIBUTE_NAMES: Record<RealAttribute, string> = {
  condicionFisica: 'Cond. Física',
  movilidad: 'Movilidad',
  salud: 'Salud',
  conocimiento: 'Conocimiento',
  atencion: 'Atención',
  autocontrol: 'Autocontrol',
} as const;

// 🎮 Nombres de display para UI (versión completa - como en HUD)
export const DISPLAY_NAMES: Record<RealAttribute, string> = {
  condicionFisica: 'Fuerza',
  movilidad: 'Agilidad',
  salud: 'Vitalidad',
  conocimiento: 'Inteligencia',
  atencion: 'Percepción',
  autocontrol: 'Sense',
} as const;

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

// 🔀 Fusión segura de hábitos (evita duplicados)
export const mergeHabits = (saved: Habit[], defaults: Habit[]): Habit[] => {
  const merged = [...saved];
  defaults.forEach(def => {
    if (!merged.some(h => h.id === def.id)) {
      merged.push(def);
    }
  });
  return merged;
};

// 🎯 Hábitos por defecto
export const DEFAULT_HABITS: Habit[] = [
  // Ejercicio
  { id: 'push-ups-100', name: '100 flexiones', category: 'exercise', difficulty: 'hard', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'run-5km', name: 'Correr 5 km', category: 'exercise', difficulty: 'hard', frequency: 'daily', streak: 0, lastCompleted: null },

  // Mente
  { id: 'read-10min', name: 'Leer 10 min', category: 'mind', difficulty: 'easy', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'meditate-5min', name: 'Meditar 5 min', category: 'mind', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },

  // Salud
  { id: 'water-2l', name: 'Beber 2L agua', category: 'health', difficulty: 'easy', frequency: 'daily', streak: 0, lastCompleted: null },

  // Productividad
  { id: 'plan-day', name: 'Planificar día', category: 'productivity', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },
];

// 🎨 Colores de rareza de items
export const RARITY_COLORS: Record<ItemRarity, string> = {
  normal: '#9E9E9E',
  raro: '#2196F3',
  elite: '#9C27B0',
  legendario: '#FF9800',
} as const;

// 📝 Nombres de rareza
export const RARITY_NAMES: Record<ItemRarity, string> = {
  normal: 'Normal',
  raro: 'Raro',
  elite: 'Élite',
  legendario: 'Legendario',
} as const;

// 📦 Nombres de categorías de inventario (sin emojis)
export const ITEM_CATEGORY_NAMES: Record<ItemCategory, string> = {
  herramientas: 'Herramientas',
  documentos: 'Documentos',
  personales: 'Personales',
  ropa: 'Ropa',
  libros: 'Libros',
  cursos: 'Cursos',
} as const;

// 💾 Clave de localStorage
export const STORAGE_KEY = 'arkan_user_v1';

// 🎨 Colores de estado
export const STATUS_COLORS = {
  activo: '#4CAF50',
  cansado: '#FF9800',
  motivado: '#2196F3',
  estresado: '#F44336',
} as const;

// 📝 Textos de estado
export const STATUS_TEXT = {
  activo: 'Activo',
  cansado: 'Cansado',
  motivado: 'Motivado',
  estresado: 'Estresado',
} as const;

// 🎨 Colores de categorías (para bordes de misiones)
export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  exercise: '#FF6B6B',
  mind: '#6C5CE7',
  health: '#00D2D3',
  productivity: '#FFA502',
} as const;