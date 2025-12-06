import { useState, useEffect } from 'react';
import { EpicModalFrame, EpicCard, EpicButton } from '../ui';
import { EPIC_THEME, RARITY_COLORS, RARITY_NAMES } from '../../constants/constants';
import type { ItemRarity } from '../../types';
import type { ShopItem } from '../../constants/shopItems';

interface ShopModalProps {
  shop: {
    catalog: ShopItem[];
    fractal: number;
    xyn: number;
    canAfford: (item: ShopItem) => boolean;
    buyItem: (itemId: string) => { success: boolean; message?: string };
  };
  onClose: () => void;
}

type ShopFilter = {
  currency: 'all' | 'fractal' | 'xyn';
  type: 'all' | 'item' | 'title';
  rarity: 'all' | ItemRarity;
};

export function ShopModal({ shop, onClose }: ShopModalProps) {
  const [shopFilter, setShopFilter] = useState<ShopFilter>({
    currency: 'all',
    type: 'all',
    rarity: 'all',
  });
  const [selectedShopItem, setSelectedShopItem] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<{ show: boolean; message: string; success: boolean }>({
    show: false,
    message: '',
    success: false,
  });

  useEffect(() => {
    if (purchaseStatus.show) {
      const timer = setTimeout(() => {
        setPurchaseStatus({ show: false, message: '', success: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [purchaseStatus.show]);

  const filteredItems = shop.catalog.filter(item => {
    const matchesCurrency = shopFilter.currency === 'all' || item.currency === shopFilter.currency;
    const itemType = item.effect.type === 'unlock_title' ? 'title' : 'item';
    const matchesType = shopFilter.type === 'all' || shopFilter.type === itemType;
    const matchesRarity = shopFilter.rarity === 'all' || item.rarity === shopFilter.rarity;
    return matchesCurrency && matchesType && matchesRarity;
  });

  const handleClose = () => {
    setSelectedShopItem(null);
    setPurchaseStatus({ show: false, message: '', success: false });
    onClose();
  };

  return (
    <>
      <EpicModalFrame title="TIENDA ARKAN" onClose={handleClose}>
        {/* Notificación de compra */}
        {purchaseStatus.show && (
          <div style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            padding: '16px 24px',
            backgroundColor: purchaseStatus.success ? 'rgba(76, 175, 80, 0.95)' : 'rgba(244, 67, 54, 0.95)',
            border: `2px solid ${purchaseStatus.success ? '#4CAF50' : '#F44336'}`,
            borderRadius: 8,
            boxShadow: `0 0 30px ${purchaseStatus.success ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)'}`,
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{
              fontSize: 'clamp(14px, 2.8vw, 16px)',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              fontFamily: EPIC_THEME.typography.heading,
            }}>
              {purchaseStatus.message}
            </div>
          </div>
        )}

        {/* Balance */}
        <div style={{
          display: 'flex',
          gap: 16,
          marginBottom: 24,
          padding: 16,
          backgroundColor: 'rgba(177, 140, 255, 0.05)',
          border: `1px solid ${EPIC_THEME.colors.accent}`,
          borderRadius: 8,
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', opacity: 0.7, marginBottom: 4 }}>FRACTAL</div>
            <div style={{
              fontSize: 'clamp(20px, 4.5vw, 24px)',
              fontWeight: 'bold',
              color: '#64B5F6',
              fontFamily: EPIC_THEME.typography.heading,
            }}>
              {shop.fractal}
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', opacity: 0.7, marginBottom: 4 }}>XYN</div>
            <div style={{
              fontSize: 'clamp(20px, 4.5vw, 24px)',
              fontWeight: 'bold',
              color: '#FFD700',
              fontFamily: EPIC_THEME.typography.heading,
              textShadow: '0 0 8px rgba(255, 215, 0, 0.7)',
            }}>
              {shop.xyn}
            </div>
          </div>
        </div>

        {/* Filtros: Moneda | Tipo | Rareza */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 10,
          marginBottom: 24,
          padding: '0 12px',
        }}>
          {/* Moneda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{
              fontSize: 'clamp(12px, 2.4vw, 13px)',
              opacity: 0.8,
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              Moneda
            </label>
            <select
              value={shopFilter.currency}
              onChange={e => setShopFilter(f => ({ ...f, currency: e.target.value as any }))}
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
              <option value="fractal">Fractal</option>
              <option value="xyn">Xyn</option>
            </select>
          </div>

          {/* Tipo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{
              fontSize: 'clamp(12px, 2.4vw, 13px)',
              opacity: 0.8,
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              Tipo
            </label>
            <select
              value={shopFilter.type}
              onChange={e => setShopFilter(f => ({ ...f, type: e.target.value as any }))}
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
              <option value="all">Todos</option>
              <option value="item">Ítems</option>
              <option value="title">Títulos</option>
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
              value={shopFilter.rarity}
              onChange={e => setShopFilter(f => ({ ...f, rarity: e.target.value as any }))}
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(160px, 40vw, 200px), 1fr))',
          gap: 16,
        }}>
          {filteredItems.map(item => {
            const canBuy = shop.canAfford(item);
            const currencyColor = item.currency === 'fractal' ? '#64B5F6' : '#FFD700';

            return (
              <EpicCard
                key={item.id}
                onClick={() => canBuy && setSelectedShopItem(item.id)}
                style={{
                  padding: '16px',
                  cursor: canBuy ? 'pointer' : 'not-allowed',
                  opacity: canBuy ? 1 : 0.5,
                  border: `2px solid ${RARITY_COLORS[item.rarity]}`,
                  boxShadow: `0 0 20px ${RARITY_COLORS[item.rarity]}40`,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <div style={{
                    fontSize: 'clamp(15px, 3.4vw, 18px)',
                    fontWeight: 'bold',
                    color: RARITY_COLORS[item.rarity],
                    fontFamily: EPIC_THEME.typography.heading,
                    marginBottom: 4,
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontSize: 'clamp(10px, 2vw, 11px)',
                    opacity: 0.7,
                    marginBottom: 8,
                  }}>
                    {RARITY_NAMES[item.rarity]}
                  </div>
                </div>

                <div style={{
                  fontSize: 'clamp(12px, 2.4vw, 13px)',
                  lineHeight: 1.5,
                  marginBottom: 12,
                  minHeight: 60,
                  opacity: 0.9,
                }}>
                  {item.description}
                </div>

                <div style={{
                  padding: '10px 14px',
                  backgroundColor: canBuy ? `${currencyColor}20` : 'rgba(120, 120, 120, 0.2)',
                  border: `2px solid ${canBuy ? currencyColor : '#666'}`,
                  borderRadius: 8,
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: 'clamp(18px, 4vw, 22px)',
                    fontWeight: 'bold',
                    color: canBuy ? currencyColor : '#888',
                    fontFamily: EPIC_THEME.typography.heading,
                  }}>
                    {item.price} {item.currency === 'fractal' ? 'FRACTAL' : 'XYN'}
                  </div>
                </div>

                {!canBuy && (
                  <div style={{
                    marginTop: 8,
                    fontSize: 'clamp(11px, 2.2vw, 12px)',
                    color: '#FF5252',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                    Fondos insuficientes
                  </div>
                )}
              </EpicCard>
            );
          })}
        </div>

        {/* Mensaje vacío */}
        {filteredItems.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 16px',
            color: EPIC_THEME.colors.accentLight,
            fontSize: 'clamp(16px, 3.6vw, 18px)',
            opacity: 0.7,
          }}>
            No hay ítems disponibles en esta categoría.
          </div>
        )}
      </EpicModalFrame>

      {/* Modal de confirmación */}
      {selectedShopItem && (() => {
        const item = shop.catalog.find(i => i.id === selectedShopItem);
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
              zIndex: 1002,
              backdropFilter: 'blur(12px)',
            }}
            onClick={() => setSelectedShopItem(null)}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(90%, 420px)', margin: '0 12px' }}>
              <EpicCard style={{
                border: `2px solid ${RARITY_COLORS[item.rarity]}`,
                boxShadow: `0 0 40px ${RARITY_COLORS[item.rarity]}60`,
              }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{
                    fontSize: 'clamp(20px, 4.8vw, 26px)',
                    fontWeight: 'bold',
                    color: RARITY_COLORS[item.rarity],
                    fontFamily: EPIC_THEME.typography.heading,
                    marginBottom: 8,
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontSize: 'clamp(12px, 2.4vw, 14px)',
                    opacity: 0.7,
                    marginBottom: 12,
                  }}>
                    {RARITY_NAMES[item.rarity]}
                  </div>
                </div>

                <div style={{
                  fontSize: 'clamp(14px, 2.8vw, 16px)',
                  lineHeight: 1.6,
                  marginBottom: 20,
                  opacity: 0.9,
                }}>
                  {item.description}
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: 'rgba(177, 140, 255, 0.05)',
                  border: `1px solid ${EPIC_THEME.colors.accent}`,
                  borderRadius: 8,
                  marginBottom: 20,
                }}>
                  <div style={{
                    fontSize: 'clamp(13px, 2.6vw, 15px)',
                    opacity: 0.7,
                    marginBottom: 8,
                    textAlign: 'center',
                  }}>
                    PRECIO
                  </div>
                  <div style={{
                    fontSize: 'clamp(26px, 6vw, 32px)',
                    fontWeight: 'bold',
                    color: item.currency === 'fractal' ? '#64B5F6' : '#FFD700',
                    fontFamily: EPIC_THEME.typography.heading,
                    textAlign: 'center',
                    textShadow: item.currency === 'xyn' ? '0 0 10px rgba(255, 215, 0, 0.6)' : 'none',
                  }}>
                    {item.price} {item.currency === 'fractal' ? 'TRGL' : 'XYN'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <EpicButton
                    onClick={() => {
                      const result = shop.buyItem(item.id);
                      setPurchaseStatus({
                        show: true,
                        message: result.message || (result.success ? '¡Compra exitosa!' : 'Error en la compra'),
                        success: result.success,
                      });
                      setSelectedShopItem(null);
                    }}
                    variant="primary"
                    disabled={!shop.canAfford(item)}
                    style={{ flex: 1, padding: 14 }}
                  >
                    {shop.canAfford(item) ? 'COMPRAR' : 'FONDOS INSUFICIENTES'}
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

