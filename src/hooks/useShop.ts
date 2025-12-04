// src/hooks/useShop.ts
import { useCallback } from 'react';
import { useHabits } from './useHabits';
import { SHOP_ITEMS, type ShopItem } from '../constants/shopItems';
import { ITEM_CATALOG } from '../constants/constants';

export const useShop = () => {
  const habits = useHabits();
  const {
    fractal,
    xyn,
    state,
    saveState,
    addItem,
  } = habits;

  const buyItem = useCallback((itemId: string): { success: boolean; message?: string } => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false, message: 'Ítem no encontrado' };

    // 🔑 Validar saldo
    const canAfford = item.currency === 'fractal' 
      ? fractal >= item.price 
      : xyn >= item.price;
    
    if (!canAfford) {
      return { 
        success: false, 
        message: `Fondos insuficientes (necesitas ${item.price} ${item.currency.toUpperCase()})` 
      };
    }

    try {
      const newFractal = item.currency === 'fractal' ? fractal - item.price : fractal;
      const newXyn = item.currency === 'xyn' ? xyn - item.price : xyn;

      switch (item.effect.type) {
        case 'give_item': {
          if (!item.effect.target) {
            return { success: false, message: 'Configuración de ítem inválida' };
          }
          
          const template = ITEM_CATALOG[item.effect.target as keyof typeof ITEM_CATALOG];
          if (!template) {
            return { success: false, message: 'Ítem no encontrado en catálogo' };
          }

          // ✅ Usa addItem → maneja stacking, persistencia y UI update
          addItem(template);

          // ✅ Actualiza solo el saldo
          saveState({
            ...state,
            fractal: newFractal,
            xyn: newXyn,
          });

          return { 
            success: true, 
            message: `¡${item.name} comprado con éxito!` 
          };
        }

        case 'unlock_title': {
          if (!item.effect.target) {
            return { success: false, message: 'ID de título inválido' };
          }
          
          const titleId = item.effect.target;
          const existingTitle = state.titles.find(t => t.id === titleId);
          
          if (!existingTitle) {
            return { success: false, message: 'Título no encontrado' };
          }
          
          if (existingTitle.unlocked) {
            return { success: false, message: 'Ya tienes este título desbloqueado' };
          }
          
          const updatedTitles = state.titles.map(t =>
            t.id === titleId 
              ? { ...t, unlocked: true, unlockedAt: new Date().toISOString() } 
              : t
          );

          saveState({
            ...state,
            fractal: newFractal,
            xyn: newXyn,
            titles: updatedTitles,
          });

          return { 
            success: true, 
            message: `¡Título "${existingTitle.name}" desbloqueado!` 
          };
        }

        case 'xp_boost': {
          if (!item.effect.value || item.effect.value <= 0) {
            return { success: false, message: 'Valor de XP inválido' };
          }
          
          const newXP = state.totalXP + item.effect.value;
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
          const oldLevel = state.level;

          let newAttributes = { ...state.attributes };
          let newUnclaimedRewards = [...state.unclaimedRewards];

          if (newLevel > oldLevel) {
            const levelsGained = newLevel - oldLevel;
            Object.keys(newAttributes).forEach(stat => {
              newAttributes[stat as keyof typeof newAttributes] += levelsGained;
            });
            
            newUnclaimedRewards.push({
              id: `shop-levelup-${newLevel}`,
              type: 'levelUp',
              description: `¡${levelsGained} nivel(es) alcanzado(s) por ítem! +${levelsGained} en todas las estadísticas`,
              stats: { 
                fuerza: levelsGained, 
                agilidad: levelsGained, 
                vitalidad: levelsGained, 
                inteligencia: levelsGained, 
                percepcion: levelsGained, 
                sense: levelsGained 
              },
              createdAt: new Date().toISOString(),
              claimedAt: new Date().toISOString(),
            });
          }

          saveState({
            ...state,
            fractal: newFractal,
            xyn: newXyn,
            totalXP: newXP,
            level: newLevel,
            attributes: newAttributes,
            unclaimedRewards: newUnclaimedRewards,
          });

          return { 
            success: true, 
            message: `¡+${item.effect.value} XP! ${newLevel > oldLevel ? `¡Nivel ${newLevel}!` : ''}` 
          };
        }

        case 'streak_shield_x': {
          if (!item.effect.value || item.effect.value <= 0) {
            return { success: false, message: 'Valor de protección inválido' };
          }
          
          const newShieldUses = (state.streakShieldUses || 0) + item.effect.value;

          saveState({
            ...state,
            fractal: newFractal,
            xyn: newXyn,
            streakShieldUses: newShieldUses,
          });

          return { 
            success: true, 
            message: `¡Escudo de racha aumentado en ${item.effect.value} usos!` 
          };
        }

        default:
          return { success: false, message: 'Tipo de efecto no soportado' };
      }

    } catch (e) {
      console.error('Error al comprar ítem:', e);
      return { success: false, message: 'Error inesperado al procesar la compra' };
    }
  }, [fractal, xyn, state, saveState, addItem]);

  const canAfford = useCallback(
    (item: ShopItem) => 
      item.currency === 'fractal' 
        ? fractal >= item.price 
        : xyn >= item.price,
    [fractal, xyn]
  );

  return {
    fractal,
    xyn,
    catalog: SHOP_ITEMS,
    buyItem,
    canAfford,
  };
};