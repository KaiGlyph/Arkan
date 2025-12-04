// src/types.ts
export type HabitDifficulty = 'easy' | 'medium' | 'hard';
export type HabitCategory = 'exercise' | 'mobility' | 'health' | 'mind' | 'productivity' | 'discipline';
export type HabitFrequency = 'daily' | 'weekly' | 'custom';
export type StatName = 'fuerza' | 'agilidad' | 'vitalidad' | 'inteligencia' | 'percepcion' | 'sense';
export type UserStatus = 'activo' | 'cansado' | 'motivado' | 'estresado';
export type ItemRarity = 'normal' | 'raro' | 'elite' | 'legendario';
export type ItemCategory = 'consumible' | 'especial' | 'equipamiento' | 'herramientas' | 'documentos' | 'personales' | 'ropa' | 'libros' | 'cursos';
export type TitleRarity = 'comun' | 'raro' | 'epico' | 'legendario';
export type TitleCategory = 'inicial' | 'racha' | 'nivel' | 'especial' | 'legendario';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  frequency: HabitFrequency;
  streak: number;
  lastCompleted: string | null;
  completedCount?: number; // ✅ Añadido para contar cuántas veces se ha completado
}

export interface Reward {
  id: string;
  type: 'levelUp' | 'dailyMissions' | 'dailyCompletion' | 'quest'; // ✅ Añadido 'dailyCompletion'
  description: string;
  stats: Partial<Record<StatName, number>> & { points?: number };
  createdAt: string;
  claimedAt?: string | null; // ✅ Cambiado a permitir null
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  effect?: {
    type: 'xp_boost' | 'shield_penalty' | 'time_rewind' | 'duplicate_reward' | 'reroll_missions' | 'streak_protection';
    value?: number;
    description: string;
  };
  consumable?: boolean;
  unique?: boolean;
  quantity?: number;
  dateAcquired: string;
}

export interface Title {
  id: string;
  name: string;
  description: string;
  category: TitleCategory;
  rarity: TitleRarity;
  requirement: {
    type: 'streak' | 'level' | 'special' | 'initial';
    value?: number;
    description: string;
  };
  bonus: {
    xpMultiplier?: number;
    energyBoost?: number;
    stats?: Partial<Record<StatName, number>>;
    description: string;
  };
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface CatalogItem {
  readonly name: string;
  readonly description: string;
  readonly category: ItemCategory;
  readonly rarity: ItemRarity;
  readonly effect: {
    readonly type: 'xp_boost' | 'shield_penalty' | 'time_rewind' | 'duplicate_reward' | 'reroll_missions' | 'streak_protection';
    readonly value?: number;
    readonly description: string;
  };
  readonly consumable: boolean;
  readonly unique?: boolean;
}

export interface UserState {
  totalXP: number;
  habits: Habit[];
  level: number;
  attributes: Record<StatName, number>;
  energy: number;
  health: number;
  status: UserStatus;
  illnesses: string[];
  inventory: InventoryItem[];
  name: string;
  age: number;
  title: string;
  bio: string;
  streakHistory: string[];
  updatedAt: string;
  unclaimedRewards: Reward[];
  titles: Title[];
  activeTitle: string | null;
  streakShieldUses?: number;
  fractal: number;
  xyn: number;
}