import { useState } from 'react';
import { EpicModalFrame, EpicCard } from '../ui';
import { EPIC_THEME, TITLE_RARITY_COLORS, TITLE_RARITY_NAMES } from '../../constants/constants';
import type { Title } from '../../types';

interface TitlesModalProps {
  titles: Title[];
  activeTitle: string | null;
  onSetActiveTitle: (titleId: string | null) => void;
  onClose: () => void;
}

type TitleFilter = 'all' | 'inicial' | 'racha' | 'nivel' | 'especial' | 'legendario';

export function TitlesModal({ titles, activeTitle, onSetActiveTitle, onClose }: TitlesModalProps) {
  const [titleFilter, setTitleFilter] = useState<TitleFilter>('all');

  const filteredTitles = titles.filter(title =>
    titleFilter === 'all' || title.category === titleFilter
  );

  return (
    <EpicModalFrame title="TÍTULOS" onClose={onClose}>
      {/* Filtros */}
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
            value={titleFilter}
            onChange={e => setTitleFilter(e.target.value as TitleFilter)}
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
            <option value="inicial">Inicial</option>
            <option value="racha">Racha</option>
            <option value="nivel">Nivel</option>
            <option value="especial">Especial</option>
            <option value="legendario">Legendario</option>
          </select>
        </div>
      </div>

      {/* Grid de títulos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 35vw, 180px), 1fr))',
        gap: 16,
      }}>
        {filteredTitles.map(title => {
          const isActive = activeTitle === title.id;
          const rarityColor = TITLE_RARITY_COLORS[title.rarity];
          return (
            <EpicCard
              key={title.id}
              style={{
                padding: '16px 12px',
                border: `2px solid ${isActive ? '#FFD700' : title.unlocked ? rarityColor : '#444'}`,
                boxShadow: `0 0 20px ${isActive ? 'rgba(255, 215, 0, 0.4)' : title.unlocked ? `${rarityColor}40` : 'rgba(68,68,68,0.2)'}`,
                opacity: !title.unlocked ? 0.6 : 1,
                cursor: title.unlocked ? 'pointer' : 'not-allowed',
                position: 'relative',
              }}
              onClick={() => title.unlocked && onSetActiveTitle(isActive ? null : title.id)}
            >
              {/* Icono */}
              <div style={{
                fontSize: 'clamp(28px, 7vw, 36px)',
                textAlign: 'center',
                marginBottom: 8,
                textShadow: `0 0 8px ${rarityColor}`,
              }}>
                {title.icon}
              </div>
              {/* Nombre */}
              <div style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 'clamp(14px, 3vw, 16px)',
                color: rarityColor,
                fontFamily: EPIC_THEME.typography.heading,
                marginBottom: 4,
                letterSpacing: 0.5,
              }}>
                {title.name}
              </div>
              {/* Rareza */}
              <div style={{
                textAlign: 'center',
                fontSize: 'clamp(10px, 2.2vw, 11px)',
                opacity: 0.7,
                marginBottom: 8,
                fontFamily: EPIC_THEME.typography.subtitle,
              }}>
                {TITLE_RARITY_NAMES[title.rarity]}
              </div>
              {/* Requisito */}
              <div style={{
                fontSize: 'clamp(11px, 2.4vw, 12px)',
                opacity: 0.85,
                marginBottom: 8,
                lineHeight: 1.4,
                fontFamily: EPIC_THEME.typography.body,
              }}>
                {title.requirement.description}
              </div>
              {/* Bonus */}
              <div style={{
                fontSize: 'clamp(12px, 2.5vw, 13px)',
                fontWeight: 'bold',
                color: EPIC_THEME.colors.accent,
                fontFamily: EPIC_THEME.typography.subtitle,
                textAlign: 'center',
                marginTop: 'auto',
                paddingTop: 8,
                borderTop: title.unlocked ? `1px solid ${rarityColor}30` : 'none',
              }}>
                {title.bonus.description || 'Sin bonus'}
              </div>
              {/* Locked overlay */}
              {!title.unlocked && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 0,
                  zIndex: 2,
                }}>
                  <div style={{
                    color: '#888',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: EPIC_THEME.typography.heading,
                  }}>
                  </div>
                </div>
              )}
              {/* Badge activo */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: '#FFD700',
                  color: '#0F071A',
                  borderRadius: '50%',
                  width: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 'bold',
                  boxShadow: '0 0 8px rgba(255,215,0,0.8)',
                  zIndex: 3,
                }}>
                  ★
                </div>
              )}
            </EpicCard>
          );
        })}
      </div>

      {/* Mensaje vacío */}
      {filteredTitles.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 16px',
          color: EPIC_THEME.colors.accentLight,
          fontSize: 'clamp(16px, 3.6vw, 18px)',
          opacity: 0.7,
          fontFamily: EPIC_THEME.typography.subtitle,
        }}>
          {titleFilter === 'all'
            ? 'No tienes títulos aún. ¡Completa misiones y sube de nivel!'
            : `No hay títulos en la categoría "${titleFilter}".`
          }
        </div>
      )}
    </EpicModalFrame>
  );
}

