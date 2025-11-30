// src/constants.ts
import type { 
  HabitDifficulty, 
  HabitCategory, 
  StatName, 
  Habit, 
  ItemRarity, 
  ItemCategory,
  Title,
  TitleRarity
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

// 🧠 Atributo asociado a cada categoría
export const ATTRIBUTE_BY_CATEGORY: Record<HabitCategory, StatName> = {
  exercise: 'fuerza',
  mobility: 'agilidad',
  health: 'vitalidad',
  mind: 'inteligencia',
  productivity: 'percepcion',
  discipline: 'sense',
} as const;

// 🏷️ Nombres amigables para mostrar en UI
export const ATTRIBUTE_NAMES: Record<StatName, string> = {
  fuerza: 'Fuerza',
  agilidad: 'Agilidad',
  vitalidad: 'Vitalidad',
  inteligencia: 'Inteligencia',
  percepcion: 'Percepción',
  sense: 'Sense',
} as const;

export const DISPLAY_NAMES = ATTRIBUTE_NAMES;

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

// 🎯 Hábitos por defecto
export const DEFAULT_HABITS: Habit[] = [
  { id: 'push-ups-50', name: '50 flexiones', category: 'exercise', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'run-3km', name: 'Correr 3 km', category: 'exercise', difficulty: 'hard', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'stretch-15min', name: 'Estiramientos 15 min', category: 'mobility', difficulty: 'easy', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'yoga-20min', name: 'Yoga 20 min', category: 'mobility', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'water-2l', name: 'Beber 2L agua', category: 'health', difficulty: 'easy', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'sleep-7h', name: 'Dormir 7h+', category: 'health', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'read-15min', name: 'Leer 15 min', category: 'mind', difficulty: 'easy', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'learn-skill', name: 'Aprender algo nuevo', category: 'mind', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'plan-day', name: 'Planificar día', category: 'productivity', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'deep-work-1h', name: 'Trabajo profundo 1h', category: 'productivity', difficulty: 'hard', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'meditate-10min', name: 'Meditar 10 min', category: 'discipline', difficulty: 'medium', frequency: 'daily', streak: 0, lastCompleted: null },
  { id: 'digital-detox', name: 'Sin redes 1h', category: 'discipline', difficulty: 'hard', frequency: 'daily', streak: 0, lastCompleted: null },
];

// 🎨 Colores de rareza (ítems)
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

// 🏆 Colores de rareza (títulos)
export const TITLE_RARITY_COLORS: Record<TitleRarity, string> = {
  comun: '#9E9E9E',
  raro: '#2196F3',
  epico: '#9C27B0',
  legendario: '#FFD700',
} as const;

export const TITLE_RARITY_NAMES: Record<TitleRarity, string> = {
  comun: 'Común',
  raro: 'Raro',
  epico: 'Épico',
  legendario: 'Legendario',
};

export const ITEM_CATEGORY_NAMES: Record<ItemCategory, string> = {
  consumible: 'Consumibles',
  especial: 'Especiales',
  equipamiento: 'Equipamiento',
  herramientas: 'Herramientas',
  documentos: 'Documentos',
  personales: 'Personales',
  ropa: 'Ropa',
  libros: 'Libros',
  cursos: 'Cursos',
};

// 🎁 Catálogo de ítems disponibles
export const ITEM_CATALOG = {
  potion_xp_minor: {
    name: '💎 Poción de XP Menor',
    description: 'Un elixir cristalino que despierta tu potencial oculto.',
    category: 'consumible' as ItemCategory,
    rarity: 'normal' as ItemRarity,
    effect: {
      type: 'xp_boost' as const,
      value: 50,
      description: '+50 XP instantáneos'
    },
    consumable: true,
  },
  potion_xp_major: {
    name: '💎 Poción de XP Mayor',
    description: 'Destilado de sabiduría antigua que acelera tu ascensión.',
    category: 'consumible' as ItemCategory,
    rarity: 'raro' as ItemRarity,
    effect: {
      type: 'xp_boost' as const,
      value: 150,
      description: '+150 XP instantáneos'
    },
    consumable: true,
  },
  potion_xp_supreme: {
    name: '💎 Poción de XP Suprema',
    description: 'Esencia pura del conocimiento cósmico. Ilumina tu camino.',
    category: 'consumible' as ItemCategory,
    rarity: 'elite' as ItemRarity,
    effect: {
      type: 'xp_boost' as const,
      value: 300,
      description: '+300 XP instantáneos'
    },
    consumable: true,
  },
  shield_forgiveness: {
    name: '🛡️ Escudo del Perdón',
    description: 'Un escudo etéreo que absorbe el peso de tus errores. Protege tu progreso de una penalización futura.',
    category: 'especial' as ItemCategory,
    rarity: 'legendario' as ItemRarity,
    effect: {
      type: 'shield_penalty' as const,
      description: 'Bloquea 1 penalización'
    },
    consumable: true,
    unique: true,
  },
  time_clock: {
    name: '⏰ Reloj del Tiempo',
    description: 'Un cronómetro arcano que dobla el tejido temporal. Permite reescribir el ayer.',
    category: 'especial' as ItemCategory,
    rarity: 'elite' as ItemRarity,
    effect: {
      type: 'time_rewind' as const,
      description: 'Completa 1 misión de ayer'
    },
    consumable: true,
  },
  duplicate_scroll: {
    name: '📜 Pergamino de Duplicación',
    description: 'Un manuscrito que resuena con energía multiplicadora. Tu próximo logro será el doble de glorioso.',
    category: 'especial' as ItemCategory,
    rarity: 'raro' as ItemRarity,
    effect: {
      type: 'duplicate_reward' as const,
      description: 'Duplica próxima recompensa'
    },
    consumable: true,
  },
  reroll_gem: {
    name: '💎 Gema de Reroll',
    description: 'Un cristal cambiante que altera el destino. Reescribe tus desafíos del día.',
    category: 'especial' as ItemCategory,
    rarity: 'elite' as ItemRarity,
    effect: {
      type: 'reroll_missions' as const,
      description: 'Cambia misiones del día'
    },
    consumable: true,
  },
  streak_crystal: {
    name: '🔥 Cristal de Racha',
    description: 'Un fragmento de voluntad inquebrantable. Cuando todo parece perdido, este cristal preserva tu legado.',
    category: 'especial' as ItemCategory,
    rarity: 'legendario' as ItemRarity,
    effect: {
      type: 'streak_protection' as const,
      description: 'Protege tu racha 1 vez'
    },
    consumable: true,
    unique: true,
  },
} as const;

// 🏆 Catálogo de Títulos
export const TITLE_CATALOG: Title[] = [
  // INICIALES
  {
    id: 'novato',
    name: 'Novato',
    description: 'Todo camino épico comienza con un primer paso.',
    category: 'inicial',
    rarity: 'comun',
    requirement: {
      type: 'initial',
      description: 'Título inicial'
    },
    bonus: {
      description: 'Sin bonus'
    },
    icon: '🌱',
    unlocked: true,
  },
  
  // POR RACHA
  {
    id: 'perseverante',
    name: 'Perseverante',
    description: 'La constancia forja la grandeza.',
    category: 'racha',
    rarity: 'comun',
    requirement: {
      type: 'streak',
      value: 7,
      description: '7 días de racha'
    },
    bonus: {
      xpMultiplier: 1.05,
      description: '+5% XP'
    },
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'inquebrantable',
    name: 'Inquebrantable',
    description: 'Tu voluntad es férrea, tu determinación absoluta.',
    category: 'racha',
    rarity: 'raro',
    requirement: {
      type: 'streak',
      value: 14,
      description: '14 días de racha'
    },
    bonus: {
      xpMultiplier: 1.10,
      energyBoost: 5,
      description: '+10% XP, +5 Energía máx'
    },
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'maestro_habitos',
    name: 'Maestro de Hábitos',
    description: 'Has alcanzado la maestría en el arte de la disciplina.',
    category: 'racha',
    rarity: 'epico',
    requirement: {
      type: 'streak',
      value: 30,
      description: '30 días de racha'
    },
    bonus: {
      xpMultiplier: 1.15,
      energyBoost: 10,
      stats: { vitalidad: 1 },
      description: '+15% XP, +10 Energía máx, +1 Vitalidad'
    },
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'ascendido',
    name: 'Ascendido',
    description: 'Has trascendido las limitaciones humanas.',
    category: 'racha',
    rarity: 'legendario',
    requirement: {
      type: 'streak',
      value: 60,
      description: '60 días de racha'
    },
    bonus: {
      xpMultiplier: 1.25,
      energyBoost: 15,
      stats: { vitalidad: 2, sense: 1 },
      description: '+25% XP, +15 Energía máx, +2 Vitalidad, +1 Sense'
    },
    icon: '🌟',
    unlocked: false,
  },
  {
    id: 'inmortal',
    name: 'Inmortal',
    description: 'Tu legado trasciende el tiempo. Eres leyenda viviente.',
    category: 'racha',
    rarity: 'legendario',
    requirement: {
      type: 'streak',
      value: 100,
      description: '100 días de racha'
    },
    bonus: {
      xpMultiplier: 1.50,
      energyBoost: 25,
      stats: { vitalidad: 3, sense: 2, percepcion: 1 },
      description: '+50% XP, +25 Energía máx, +3 Vitalidad, +2 Sense, +1 Percepción'
    },
    icon: '💫',
    unlocked: false,
  },
  
  // POR NIVEL
  {
    id: 'veterano',
    name: 'Veterano',
    description: 'La experiencia te ha forjado en batalla.',
    category: 'nivel',
    rarity: 'raro',
    requirement: {
      type: 'level',
      value: 10,
      description: 'Alcanzar nivel 10'
    },
    bonus: {
      xpMultiplier: 1.08,
      stats: { fuerza: 1 },
      description: '+8% XP, +1 Fuerza'
    },
    icon: '⚔️',
    unlocked: false,
  },
  {
    id: 'guerrero',
    name: 'Guerrero Élite',
    description: 'Tu poder es innegable, tu reputación precede tu nombre.',
    category: 'nivel',
    rarity: 'epico',
    requirement: {
      type: 'level',
      value: 25,
      description: 'Alcanzar nivel 25'
    },
    bonus: {
      xpMultiplier: 1.12,
      stats: { fuerza: 2, agilidad: 1 },
      description: '+12% XP, +2 Fuerza, +1 Agilidad'
    },
    icon: '🗡️',
    unlocked: false,
  },
  {
    id: 'leyenda',
    name: 'Leyenda Viviente',
    description: 'Tu nombre será recordado en los anales de la historia.',
    category: 'nivel',
    rarity: 'legendario',
    requirement: {
      type: 'level',
      value: 50,
      description: 'Alcanzar nivel 50'
    },
    bonus: {
      xpMultiplier: 1.20,
      energyBoost: 10,
      stats: { fuerza: 3, agilidad: 2, inteligencia: 1 },
      description: '+20% XP, +10 Energía máx, +3 Fuerza, +2 Agilidad, +1 Inteligencia'
    },
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'dios_viviente',
    name: 'Dios Viviente',
    description: 'Has alcanzado el pináculo de la evolución humana.',
    category: 'nivel',
    rarity: 'legendario',
    requirement: {
      type: 'level',
      value: 100,
      description: 'Alcanzar nivel 100'
    },
    bonus: {
      xpMultiplier: 2.0,
      energyBoost: 30,
      stats: { fuerza: 5, agilidad: 4, vitalidad: 3, inteligencia: 3, percepcion: 2, sense: 2 },
      description: '+100% XP, +30 Energía máx, +5 Fuerza, +4 Agilidad, +3 Vitalidad, +3 Int, +2 Percep, +2 Sense'
    },
    icon: '☀️',
    unlocked: false,
  },
  // 🌕 Favor del Sistema — Misión oculta
  {
    id: 'favor_del_sistema',
    name: 'Favor del Sistema',
    description: 'El Sistema te ha elegido. Tu camino ya no es casualidad.',
    category: 'especial',
    rarity: 'legendario',
    requirement: {
      type: 'special',
      description: 'Abrir el buzón el 1 de enero entre 00:00 y 00:05'
    },
    bonus: {
      xpMultiplier: 1.25,
      energyBoost: 20,
      stats: { sense: 2 },
      description: '+25% XP, +20 MP máx, +2 Sense'
    },
    icon: '⚙️',
    unlocked: false,
  },
];

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

// 🎨 Colores de categorías
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