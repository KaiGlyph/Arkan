import { useState } from 'react';
import { EpicModalFrame, EpicCard, EpicButton } from '../ui';
import { EPIC_THEME, RARITY_COLORS, RARITY_NAMES } from '../../constants/constants';
import type { InventoryItem, ItemRarity } from '../../types';

interface InventoryModalProps {
  inventory: InventoryItem[];
  onUseItem: (itemId: string) => void;
  onClose: () => void;
}

type InventoryFilter = {
  category: 'all' | 'consumible' | 'especial';
  rarity: 'all' | ItemRarity;
};

export function InventoryModal({ inventory, onUseItem, onClose }: InventoryModalProps) {
  const [inventoryFilter, setInventoryFilter] = useState<InventoryFilter>({
    category: 'all',
    rarity: 'all',
  });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filteredItems = inventory.filter(item => {
    const matchesCategory = inventoryFilter.category === 'all' || item.category === inventoryFilter.category;
    const matchesRarity = inventoryFilter.rarity === 'all' || item.rarity === inventoryFilter.rarity;
    return matchesCategory && matchesRarity;
  });

  const handleClose = () => {
    setSelectedItem(null);
    onClose();
  };

  return (
    <>
      <EpicModalFrame title="INVENTARIO" onClose={handleClose}>
        {/* Filtros: Categoría | Rareza */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 10,
          marginBottom: 24,
          padding: '0 12px',
        }}>
          {/* Categoría */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{
              fontSize: 'clamp(12px, 2.4vw, 13px)',
              opacity: 0.8,
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              Categoría
            </label>
            <select
              value={inventoryFilter.category}
              onChange={e => setInventoryFilter(f => ({ ...f, category: e.target.value as any }))}
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(15, 10, 25, 0.9)',
                border: `2px solid ${EPIC_THEME.colors.accent}`,
                borderRadius: 0,
                color: 'white',
                fontSize: 'clamp(14px, 2.8vw, 15px)',
                fontFamily: EPIC_THEME.typography.body,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23B18CFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                paddingRight: 30,
              }}
            >
              <option value="all">Todas</option>
              <option value="consumible">Consumibles</option>
              <option value="especial">Especiales</option>
            </select>
          </div>

          {/* Rareza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{
              fontSize: 'clamp(12px, 2.4vw, 13px)',
              opacity: 0.8,
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              Rareza
            </label>
            <select
              value={inventoryFilter.rarity}
              onChange={e => setInventoryFilter(f => ({ ...f, rarity: e.target.value as ItemRarity }))}
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(15, 10, 25, 0.9)',
                border: `2px solid ${EPIC_THEME.colors.accent}`,
                borderRadius: 0,
                color: 'white',
                fontSize: 'clamp(14px, 2.8vw, 15px)',
                fontFamily: EPIC_THEME.typography.body,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23B18CFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                paddingRight: 30,
              }}
            >
              <option value="all">Todas</option>
              <option value="normal">Normal</option>
              <option value="raro">Raro</option>
              <option value="elite">Elite</option>
              <option value="legendario">Legendario</option>
            </select>
          </div>
        </div>

        {/* Grid de ítems */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(120px, 30vw, 160px), 1fr))',
          gap: 14,
        }}>
          {filteredItems.map(item => (
            <EpicCard
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              style={{
                padding: '14px',
                cursor: 'pointer',
                border: `2px solid ${RARITY_COLORS[item.rarity]}`,
                boxShadow: `0 0 20px ${RARITY_COLORS[item.rarity]}40, inset 0 0 20px ${RARITY_COLORS[item.rarity]}20`,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(32px, 8vw, 40px)', marginBottom: 8 }}>
                  {item.name.split(' ')[0]}
                </div>
                <div style={{
                  fontSize: 'clamp(12px, 2.4vw, 13px)',
                  fontWeight: 'bold',
                  marginBottom: 4,
                  color: RARITY_COLORS[item.rarity],
                  fontFamily: EPIC_THEME.typography.subtitle,
                  letterSpacing: 0.5,
                }}>
                  {item.name.split(' ').slice(1).join(' ')}
                </div>
                <div style={{
                  fontSize: 'clamp(11px, 2.2vw, 12px)',
                  opacity: 0.6,
                  marginBottom: 6,
                  fontFamily: EPIC_THEME.typography.subtitle,
                }}>
                  {RARITY_NAMES[item.rarity]}
                </div>
                {item.quantity && item.quantity > 1 && (
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: EPIC_THEME.colors.accent,
                    color: '#0F071A',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                    {item.quantity}
                  </div>
                )}
              </div>
            </EpicCard>
          ))}
        </div>

        {/* Mensaje vacío */}
        {filteredItems.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 16px',
            color: EPIC_THEME.colors.accentLight,
            fontSize: 'clamp(16px, 3.6vw, 18px)',
            opacity: 0.7,
            fontFamily: EPIC_THEME.typography.subtitle,
          }}>
            Tu inventario está vacío<br />
            o no hay ítems que coincidan con los filtros.
          </div>
        )}
      </EpicModalFrame>

      {/* Modal de detalle de ítem */}
      {selectedItem && (() => {
        const item = inventory.find(i => i.id === selectedItem);
        if (!item) return null;
        return (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(5, 2, 12, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              backdropFilter: 'blur(12px)',
            }}
            onClick={() => setSelectedItem(null)}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(90%, 400px)', margin: '0 12px' }}>
              <EpicCard style={{
                border: `2px solid ${RARITY_COLORS[item.rarity]}`,
                boxShadow: `0 0 30px ${RARITY_COLORS[item.rarity]}60`,
              }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 'clamp(48px, 12vw, 64px)', marginBottom: 12 }}>
                    {item.name.split(' ')[0]}
                  </div>
                  <div style={{
                    fontSize: 'clamp(18px, 4.2vw, 22px)',
                    fontWeight: 'bold',
                    marginBottom: 8,
                    color: RARITY_COLORS[item.rarity],
                    fontFamily: EPIC_THEME.typography.heading,
                  }}>
                    {item.name.split(' ').slice(1).join(' ')}
                  </div>
                  <div style={{
                    fontSize: 'clamp(13px, 2.6vw, 15px)',
                    opacity: 0.8,
                    marginBottom: 4,
                    fontFamily: EPIC_THEME.typography.subtitle,
                    color: RARITY_COLORS[item.rarity],
                  }}>
                    {RARITY_NAMES[item.rarity]}
                  </div>
                  {item.quantity && item.quantity > 1 && (
                    <div style={{
                      fontSize: 'clamp(12px, 2.4vw, 14px)',
                      opacity: 0.7,
                      fontFamily: EPIC_THEME.typography.subtitle,
                    }}>
                      Cantidad: {item.quantity}
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: 'clamp(14px, 2.8vw, 16px)',
                    lineHeight: 1.6,
                    marginBottom: 16,
                    opacity: 0.9,
                    fontFamily: EPIC_THEME.typography.body,
                    fontStyle: 'italic',
                  }}>
                    {item.description}
                  </div>
                  {item.effect && (
                    <div style={{
                      padding: '12px 16px',
                      backgroundColor: 'rgba(177, 140, 255, 0.1)',
                      border: `1px solid ${EPIC_THEME.colors.accent}`,
                      borderRadius: 8,
                      marginBottom: 16,
                    }}>
                      <div style={{
                        fontSize: 'clamp(12px, 2.4vw, 13px)',
                        opacity: 0.7,
                        marginBottom: 4,
                        fontFamily: EPIC_THEME.typography.subtitle,
                      }}>
                        EFECTO
                      </div>
                      <div style={{
                        fontSize: 'clamp(14px, 2.8vw, 16px)',
                        color: EPIC_THEME.colors.accent,
                        fontWeight: 'bold',
                        fontFamily: EPIC_THEME.typography.heading,
                      }}>
                        {item.effect.description}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {item.consumable && (
                    <EpicButton
                      onClick={() => {
                        onUseItem(item.id);
                        setSelectedItem(null);
                      }}
                      variant="primary"
                      style={{ flex: 1, padding: 12 }}
                    >
                      USAR
                    </EpicButton>
                  )}
                  <EpicButton
                    onClick={() => setSelectedItem(null)}
                    variant="secondary"
                    style={{ flex: item.consumable ? 0 : 1, padding: 12 }}
                  >
                    {item.consumable ? 'CANCELAR' : 'CERRAR'}
                  </EpicButton>
                </div>
              </EpicCard>
            </div>
          </div>
        );
      })()}
    </>
  );
}

