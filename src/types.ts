// src/types.ts
export type HabitCategory = 'exercise' | 'mind' | 'health' | 'productivity';
export type HabitDifficulty = 'easy' | 'medium' | 'hard';
export type HabitFrequency = 'daily' | 'weekly';

export type RealAttribute = 
  | 'condicionFisica'
  | 'movilidad'
  | 'salud'
  | 'conocimiento'
  | 'atencion'
  | 'autocontrol';

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
    attribute: RealAttribute;
    value: number;
    description: string;
  };
}

export interface Illness {
  id: string;
  name: string;
  penalties: Partial<Record<RealAttribute, number>>;
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

export interface UserState {
  totalXP: number;
  habits: Habit[];
  level: number;
  attributes: Record<RealAttribute, number>;
  energy: number;
  health: number;
  status: 'activo' | 'cansado' | 'motivado' | 'estresado';
  illnesses: Illness[];
  inventory: InventoryItem[]; // 👈 Añade esta línea
  name: string;
  age: number;
  title: string;
  updatedAt: string;
}