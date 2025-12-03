// src/components/SessionShutdown.tsx
import { useEffect, useState, memo } from 'react';
import { EPIC_THEME } from '../constants';

const SessionShutdown = memo(({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [showScanLine, setShowScanLine] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [fadeState, setFadeState] = useState<'in' | 'hold' | 'out'>('in');

  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(() => onComplete(), 300);
      return () => clearTimeout(timer);
    }

    const sequence = [
      () => setFadeState('hold'),
      () => setLines(['> CERRANDO SESIÓN...']),
      () => setLines(['> CERRANDO SESIÓN...', '> TERMINANDO PROCESOS...']),
      () => setLines(['> CERRANDO SESIÓN...', '> TERMINANDO PROCESOS...', '> LIBERANDO RECURSOS...']),
      () => setLines(['> CERRANDO SESIÓN...', '> TERMINANDO PROCESOS...', '> LIBERANDO RECURSOS...', '> SESIÓN FINALIZADA']),
      () => setShowScanLine(true),
      () => setShowGlitch(true),
      () => setFadeState('out'),
      () => onComplete(),
    ];

    const delays = [
      400,
      500,
      600,
      700,
      600,
      400,
      300,
      500,
      300,
    ];

    let i = 0;
    const execute = () => {
      if (i < sequence.length) {
        sequence[i]();
        i++;
        if (i < sequence.length) setTimeout(execute, delays[i - 1]);
      }
    };

    const timer = setTimeout(execute, delays[0]);
    return () => clearTimeout(timer);
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  // ✅ Usa colores del tema EPIC, pero más oscuros
  const alertColor = EPIC_THEME.colors.systemAlert || '#FF5252';
  // 🔻 Luminosidad reducida: glow más tenue y opaco
  const alertGlow = 'rgba(255, 82, 82, 0.25)'; // era 0.6 → ahora 0.25
  const alertLineCore = 'rgba(255, 82, 82, 0.15)'; // núcleo aún más sutil

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#030108', // más oscuro que #05020C
      zIndex: 2500,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      color: alertColor,
      fontSize: 'clamp(14px, 2.8vw, 16px)',
      overflow: 'hidden',
      opacity: fadeState === 'in' ? 0 : fadeState === 'out' ? 0 : 1,
      transition: 'opacity 0.6s cubic-bezier(0.2, 0, 0.8, 1)',
      // 🔻 Glitch más suave: menos saturación, menos contraste
      filter: showGlitch 
        ? 'hue-rotate(8deg) saturate(1.1) contrast(1.05) brightness(0.95)' 
        : 'brightness(0.98)',
    }}>
      {fadeState === 'hold' && (
        <>
          <div style={{ 
            marginBottom: 40,
            textAlign: 'left',
            whiteSpace: 'pre',
            lineHeight: 1.6,
            // 🔻 Sombra de texto más tenue
            textShadow: `0 0 4px ${alertColor}40, 0 0 8px ${alertColor}20`,
            letterSpacing: 1,
            opacity: 0.95,
          }}>
            {lines.map((line, idx) => (
              <div 
                key={idx} 
                style={{
                  opacity: 0,
                  transform: 'translateY(10px)',
                  animation: `fadeInUp 0.4s ${idx * 0.15 + 0.2}s forwards`,
                  // 🔻 Texto ligeramente menos brillante
                  color: `${alertColor}CC`, // ~80% alpha
                }}
              >
                {line}
              </div>
            ))}
            {lines.length >= 4 && (
              <span 
                style={{
                  opacity: 0,
                  animation: 'blinkRed 0.8s infinite step-start 1.6s',
                  color: `${alertColor}BB`, // menos intenso
                }}
              >
                █
              </span>
            )}
          </div>

          {showScanLine && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              // 🔻 Escaneo más sutil: brillo reducido
              background: `linear-gradient(
                to bottom,
                transparent 0%,
                ${alertGlow} 48%,
                ${alertLineCore} 50%,
                ${alertGlow} 52%,
                transparent 100%
              )`,
              animation: 'scanDownRed 1.0s ease-out 0.3s forwards',
            }} />
          )}
        </>
      )}

      <style>{`
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blinkRed {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 0.15; }
        }
        @keyframes scanDownRed {
          0% { top: -100%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
});

export default SessionShutdown;