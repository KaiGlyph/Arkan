// src/constants/shopItems.ts
import type { ItemRarity, ItemCategory } from '../types';

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'fractal' | 'xyn';
  rarity: Extract<ItemRarity, 'normal' | 'raro' | 'elite' | 'legendario'>;
  category: Extract<ItemCategory, 'consumible' | 'especial'>;
  effect: {
    type: 
      | 'give_item'            // Da un ítem de ITEM_CATALOG
      | 'unlock_title'         // Desbloquea un título (por ID)
      | 'streak_shield_x'      // Protege racha N veces
      | 'xp_boost';            // +XP inmediato
    value?: number;   // para xp_boost o streak_shield_x
    target?: string;  // para give_item (clave en ITEM_CATALOG) o unlock_title (id título)
  };
};

export const SHOP_ITEMS: ShopItem[] = [
  // 🟦 CON FRACTAL (moneda de juego)
  {
    id: 'buy_potion_xp_minor',
    name: 'Poción XP Menor',
    description: 'Un elixir cristalino que despierta tu potencial oculto.',
    price: 50,
    currency: 'fractal',
    rarity: 'normal',
    category: 'consumible',
    effect: { type: 'give_item', target: 'potion_xp_minor' },
  },
  {
    id: 'buy_potion_xp_major',
    name: 'Poción XP Mayor',
    description: 'Destilado de sabiduría antigua que acelera tu ascensión.',
    price: 150,
    currency: 'fractal',
    rarity: 'raro',
    category: 'consumible',
    effect: { type: 'give_item', target: 'potion_xp_major' },
  },
  {
    id: 'buy_reroll_gem',
    name: 'Gema de Reroll',
    description: 'Un cristal cambiante que altera el destino. Reescribe tus desafíos del día.',
    price: 200,
    currency: 'fractal',
    rarity: 'elite',
    category: 'especial',
    effect: { type: 'give_item', target: 'reroll_gem' },
  },
  {
    id: 'buy_streak_crystal',
    name: 'Cristal de Racha',
    description: 'Un fragmento de voluntad inquebrantable. Protege tu racha una vez.',
    price: 400,
    currency: 'fractal',
    rarity: 'legendario',
    category: 'especial',
    effect: { type: 'give_item', target: 'streak_crystal' },
  },

  // 🟨 CON XYN (premium)
  {
    id: 'buy_title_ascendido',
    name: 'Ascendido',
    description: 'Título legendario: +25% XP, +20 Energía máx, +2 Sense. Activa tu potencial máximo.',
    price: 1000,
    currency: 'xyn',
    rarity: 'legendario',
    category: 'especial',
    effect: { type: 'unlock_title', target: 'ascendido' },
  },
  {
    id: 'buy_potion_xp_godly',
    name: 'Poción XP Divina',
    description: 'Destilado del núcleo estelar. Otorga 5000 XP instantáneos.',
    price: 300,
    currency: 'xyn',
    rarity: 'legendario',
    category: 'consumible',
    effect: { type: 'xp_boost', value: 5000 },
  },
  {
    id: 'buy_streak_shield_10x',
    name: 'Escudo de Racha ×10',
    description: 'Protege tu racha de penalizaciones hasta 10 veces. No es eterno, pero muy poderoso.',
    price: 400,
    currency: 'xyn',
    rarity: 'legendario',
    category: 'especial',
    effect: { type: 'streak_shield_x', value: 10 },
  },
];