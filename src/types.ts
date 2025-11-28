// src/types.ts

export type HabitCategory = 
  | 'exercise'      // → Fuerza
  | 'mobility'      // → Agilidad (nuevo)
  | 'health'        // → Vitalidad
  | 'mind'          // → Inteligencia
  | 'productivity'  // → Percepción
  | 'discipline';   // → Sense (nuevo)

export type HabitDifficulty = 'easy' | 'medium' | 'hard';
export type HabitFrequency = 'daily' | 'weekly';

// ✅ Stats reales (renombrados para claridad)
export type StatName = 
  | 'fuerza'
  | 'agilidad'
  | 'vitalidad'
  | 'inteligencia'
  | 'percepcion'
  | 'sense';

// 🔁 Alias para compatibilidad (opcional, pero ayuda en migración)
export type RealAttribute = StatName;

// 👇 Añade estos tipos nuevos
export type ItemRarity = 'normal' | 'raro' | 'elite' | 'legendario';

export type ItemCategory = 
  | 'herramientas'
  | 'documentos'
  | 'personales'
  | 'ropa'
  | 'libros'
  | 'cursos';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  dateAcquired: string;
  bonus?: {
    stat: StatName;      // ✅ stat, no attribute
    value: number;
    description: string;
  };
}

export interface Illness {
  id: string;
  name: string;
  penalties: Partial<Record<StatName, number>>;
}

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  frequency: HabitFrequency;
  streak: number;
  lastCompleted: string | null;
}

// ✅ Recompensa flexible (daily missions, level up, quests)
export interface StatReward {
  id: string;
  type: 'dailyMissions' | 'levelUp' | 'quest';
  description: string;
  stats: Partial<Record<StatName, number>> & { points?: number }; // points = asignables
  createdAt: string;
  claimedAt?: string;
}

export interface UserState {
  totalXP: number;
  habits: Habit[];
  level: number;
  attributes: Record<StatName, number>;
  energy: number;
  health: number;
  status: 'activo' | 'cansado' | 'motivado' | 'estresado';
  illnesses: Illness[];
  inventory: InventoryItem[];
  name: string;
  age: number;
  title: string;
  updatedAt: string;
  unclaimedRewards: StatReward[];
}