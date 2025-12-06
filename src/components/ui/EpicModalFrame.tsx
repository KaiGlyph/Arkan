import { memo } from 'react';
import { EPIC_THEME } from '../../constants/constants';

interface EpicModalFrameProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

export const EpicModalFrame = memo(function EpicModalFrame({ 
  children, 
  title, 
  onClose 
}: EpicModalFrameProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(5, 2, 12, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Contenedor principal con altura fija */}
      <div style={{
        position: 'relative',
        width: 'min(94%, 800px)',
        height: '85vh',
        margin: '0 12px',
        borderRadius: '0px',
      }}>
        {/* 🔷 DECORACIONES EXTERIORES - Sistema Solo Leveling */}
        
        {/* Líneas exteriores horizontales superiores */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '60px',
          right: '60px',
          height: '2px',
          background: `linear-gradient(90deg, transparent 0%, ${EPIC_THEME.colors.accent} 10%, ${EPIC_THEME.colors.accent} 90%, transparent 100%)`,
          boxShadow: `0 0 8px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '-28px',
          left: '100px',
          right: '100px',
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${EPIC_THEME.colors.accent} 20%, ${EPIC_THEME.colors.accent} 80%, transparent 100%)`,
          opacity: 0.5,
        }}></div>

        {/* Líneas exteriores horizontales inferiores */}
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '60px',
          right: '60px',
          height: '2px',
          background: `linear-gradient(90deg, transparent 0%, ${EPIC_THEME.colors.accent} 10%, ${EPIC_THEME.colors.accent} 90%, transparent 100%)`,
          boxShadow: `0 0 8px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '-28px',
          left: '100px',
          right: '100px',
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${EPIC_THEME.colors.accent} 20%, ${EPIC_THEME.colors.accent} 80%, transparent 100%)`,
          opacity: 0.5,
        }}></div>

        {/* Líneas exteriores verticales izquierdas */}
        <div style={{
          position: 'absolute',
          left: '-20px',
          top: '60px',
          bottom: '60px',
          width: '2px',
          background: `linear-gradient(180deg, transparent 0%, ${EPIC_THEME.colors.accent} 10%, ${EPIC_THEME.colors.accent} 90%, transparent 100%)`,
          boxShadow: `0 0 8px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>
        
        <div style={{
          position: 'absolute',
          left: '-28px',
          top: '100px',
          bottom: '100px',
          width: '1px',
          background: `linear-gradient(180deg, transparent 0%, ${EPIC_THEME.colors.accent} 20%, ${EPIC_THEME.colors.accent} 80%, transparent 100%)`,
          opacity: 0.5,
        }}></div>

        {/* Líneas exteriores verticales derechas */}
        <div style={{
          position: 'absolute',
          right: '-20px',
          top: '60px',
          bottom: '60px',
          width: '2px',
          background: `linear-gradient(180deg, transparent 0%, ${EPIC_THEME.colors.accent} 10%, ${EPIC_THEME.colors.accent} 90%, transparent 100%)`,
          boxShadow: `0 0 8px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>
        
        <div style={{
          position: 'absolute',
          right: '-28px',
          top: '100px',
          bottom: '100px',
          width: '1px',
          background: `linear-gradient(180deg, transparent 0%, ${EPIC_THEME.colors.accent} 20%, ${EPIC_THEME.colors.accent} 80%, transparent 100%)`,
          opacity: 0.5,
        }}></div>

        {/* 🔷 Esquinas exteriores decorativas grandes */}
        {/* Esquina superior izquierda */}
        <div style={{
          position: 'absolute',
          top: '-32px',
          left: '-32px',
          width: '50px',
          height: '50px',
          borderTop: `3px solid ${EPIC_THEME.colors.accent}`,
          borderLeft: `3px solid ${EPIC_THEME.colors.accent}`,
          boxShadow: `0 0 12px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>

        {/* Esquina superior derecha */}
        <div style={{
          position: 'absolute',
          top: '-32px',
          right: '-32px',
          width: '50px',
          height: '50px',
          borderTop: `3px solid ${EPIC_THEME.colors.accent}`,
          borderRight: `3px solid ${EPIC_THEME.colors.accent}`,
          boxShadow: `0 0 12px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>

        {/* Esquina inferior izquierda */}
        <div style={{
          position: 'absolute',
          bottom: '-32px',
          left: '-32px',
          width: '50px',
          height: '50px',
          borderBottom: `3px solid ${EPIC_THEME.colors.accent}`,
          borderLeft: `3px solid ${EPIC_THEME.colors.accent}`,
          boxShadow: `0 0 12px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>

        {/* Esquina inferior derecha */}
        <div style={{
          position: 'absolute',
          bottom: '-32px',
          right: '-32px',
          width: '50px',
          height: '50px',
          borderBottom: `3px solid ${EPIC_THEME.colors.accent}`,
          borderRight: `3px solid ${EPIC_THEME.colors.accent}`,
          boxShadow: `0 0 12px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>

        {/* 🔷 Decoraciones adicionales en las esquinas */}
        {/* Mini líneas diagonales superiores */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '30px',
          width: '20px',
          height: '2px',
          background: EPIC_THEME.colors.accent,
          transform: 'rotate(-45deg)',
          boxShadow: `0 0 6px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '-12px',
          right: '30px',
          width: '20px',
          height: '2px',
          background: EPIC_THEME.colors.accent,
          transform: 'rotate(45deg)',
          boxShadow: `0 0 6px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>

        {/* Mini líneas diagonales inferiores */}
        <div style={{
          position: 'absolute',
          bottom: '-12px',
          left: '30px',
          width: '20px',
          height: '2px',
          background: EPIC_THEME.colors.accent,
          transform: 'rotate(45deg)',
          boxShadow: `0 0 6px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '-12px',
          right: '30px',
          width: '20px',
          height: '2px',
          background: EPIC_THEME.colors.accent,
          transform: 'rotate(-45deg)',
          boxShadow: `0 0 6px ${EPIC_THEME.colors.accentGlow}`,
        }}></div>

        {/* 🔷 Esquinas angulares INTERNAS del modal */}
        {[
          { top: '-4px', left: '-4px', width: '24px', height: '3px', bg: '#B18CFF' },
          { top: '-4px', left: '-4px', width: '3px', height: '24px', bg: '#B18CFF' },
          { top: '-4px', right: '-4px', width: '24px', height: '3px', bg: '#B18CFF' },
          { top: '-4px', right: '-4px', width: '3px', height: '24px', bg: '#B18CFF' },
          { bottom: '-4px', left: '-4px', width: '24px', height: '3px', bg: '#B18CFF' },
          { bottom: '-4px', left: '-4px', width: '3px', height: '24px', bg: '#B18CFF' },
          { bottom: '-4px', right: '-4px', width: '24px', height: '3px', bg: '#B18CFF' },
          { bottom: '-4px', right: '-4px', width: '3px', height: '24px', bg: '#B18CFF' },
        ].map((line, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...line,
              background: line.bg,
              boxShadow: '0 0 8px #B18CFF',
              zIndex: 15,
            }}
          />
        ))}

        {/* Contenedor interno con flex column */}
        <div style={{
          position: 'relative',
          backgroundColor: 'rgba(15, 10, 25, 0.8)',
          borderRadius: '0px',
          border: `2px solid ${EPIC_THEME.colors.accent}`,
          boxShadow: `0 0 25px ${EPIC_THEME.colors.accentGlow}, inset 0 0 30px rgba(177, 140, 255, 0.1)`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          
          {/* Botón cerrar - FIJO arriba */}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              position: 'absolute',
              right: '14px',
              top: '14px',
              background: 'rgba(177, 140, 255, 0.15)',
              border: '2px solid #B18CFF',
              color: '#D8B4FE',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              padding: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(177, 140, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 0 12px #B18CFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(177, 140, 255, 0.15)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ×
          </button>

          {/* Header con título - FIJO arriba */}
          <div style={{
            flexShrink: 0,
            padding: '36px 28px 24px 28px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
              {/* Línea decorativa */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                background: `linear-gradient(90deg, transparent 0%, ${EPIC_THEME.colors.accent} 25%, ${EPIC_THEME.colors.accent} 75%, transparent 100%)`,
                top: '50%',
                left: '0',
              }}></div>
              
              {/* Contenedor del título */}
              <div style={{
                position: 'relative',
                backgroundColor: 'rgba(20, 10, 35, 0.8)',
                padding: '8px 40px',
                borderRadius: '8px',
                border: `2px solid ${EPIC_THEME.colors.accent}`,
                boxShadow: `0 0 20px ${EPIC_THEME.colors.accentGlow}, inset 0 0 20px rgba(177, 140, 255, 0.1)`,
              }}>
                <h2 style={{
                  fontFamily: EPIC_THEME.typography.heading,
                  margin: 0,
                  fontSize: 'clamp(24px, 6vw, 32px)',
                  fontWeight: '800',
                  letterSpacing: 'clamp(4px, 1.2vw, 8px)',
                  color: EPIC_THEME.colors.accentLight,
                  textShadow: `0 0 8px ${EPIC_THEME.colors.accentLight}, 0 0 16px ${EPIC_THEME.colors.accentGlow}`,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}>
                  {title === 'MISIONES' ? 'MISIONES DIARIAS' : title}
                </h2>
              </div>
            </div>
          </div>

          {/* Contenedor de contenido con SCROLL */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '0 28px 36px 28px',
            scrollbarWidth: 'thin',
            scrollbarColor: `${EPIC_THEME.colors.accent} rgba(15, 10, 25, 0.6)`,
          }}>
            <style>{`
              /* Estilos del scrollbar */
              div::-webkit-scrollbar {
                width: 10px;
              }
              div::-webkit-scrollbar-track {
                background: rgba(15, 10, 25, 0.6);
                border: 1px solid rgba(177, 140, 255, 0.2);
              }
              div::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #8A2BE2, #B18CFF);
                border-radius: 2px;
                border: 1px solid rgba(177, 140, 255, 0.3);
                box-shadow: 0 0 8px rgba(177, 140, 255, 0.4);
              }
              div::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #9D3EF5, #C9A5FF);
                box-shadow: 0 0 12px rgba(177, 140, 255, 0.6);
              }
              
              /* Animación shimmer para misiones completadas */
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              
              /* Animación fade in */
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});