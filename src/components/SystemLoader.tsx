// src/components/SystemLoader.tsx
import { useEffect, useState, memo } from 'react';
import { EPIC_THEME } from '../constants/constants';

const SystemLoader = memo(({ onReady }: { onReady: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [showScanLine, setShowScanLine] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [fadeState, setFadeState] = useState<'in' | 'hold' | 'out'>('in');

  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(() => onReady(), 300);
      return () => clearTimeout(timer);
    }

    // 🎬 Secuencia alargada y con pausas épicas
    const sequence = [
      () => setFadeState('hold'), // ✅ Fade-in completado
      () => setLines(['> SYSTEM INITIALIZING...']),
      () => setLines(['> SYSTEM INITIALIZING...', '> LOADING CORE MODULES...']),
      () => setLines(['> SYSTEM INITIALIZING...', '> LOADING CORE MODULES...', '> VERIFYING USER: ██████']),
      () => setLines(['> SYSTEM INITIALIZING...', '> LOADING CORE MODULES...', '> VERIFYING USER: ██████', '> AUTHENTICATION: GRANTED']),
      () => setShowScanLine(true),
      () => setShowLogo(true),
      () => setFadeState('out'), // ✅ Inicia fade-out
      () => onReady(),
    ];

    const delays = [
      800,   // fade-in (0.8s)
      600,   // línea 1
      700,   // línea 2
      800,   // línea 3
      900,   // línea 4
      600,   // scan line
      1000,  // logo aparece
      800,   // fade-out comienza
      400,   // fade-out termina → onReady
    ];

    let i = 0;
    const executeStep = () => {
      if (i < sequence.length) {
        sequence[i]();
        i++;
        if (i < sequence.length) {
          setTimeout(executeStep, delays[i - 1]);
        }
      }
    };

    const timer = setTimeout(executeStep, delays[0]);
    return () => clearTimeout(timer);
  }, [onReady, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#05020C',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      color: EPIC_THEME.colors.accentLight,
      fontSize: 'clamp(14px, 2.8vw, 16px)',
      overflow: 'hidden',
      // ✅ Fade-in/out controlado por estado
      opacity: fadeState === 'in' ? 0 : fadeState === 'out' ? 0 : 1,
      transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {/* Contenido principal — solo visible durante "hold" */}
      {fadeState === 'hold' && (
        <>
          <div style={{ 
            marginBottom: 40,
            textAlign: 'left',
            whiteSpace: 'pre',
            lineHeight: 1.6,
            textShadow: `0 0 6px ${EPIC_THEME.colors.accentGlow}`,
            letterSpacing: 1,
          }}>
            {lines.map((line, idx) => (
              <div 
                key={idx} 
                style={{
                  opacity: 0,
                  transform: 'translateY(10px)',
                  animation: `fadeInUp 0.5s ${idx * 0.2 + 0.3}s forwards`
                }}
              >
                {line}
              </div>
            ))}
            {lines.length >= 4 && <span style={{ opacity: 0, animation: 'blink 1s infinite step-start 1.8s' }}>_</span>}
          </div>

          {showScanLine && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              background: `linear-gradient(to bottom, transparent 0%, rgba(177, 140, 255, 0.1) 48%, rgba(177, 140, 255, 0.3) 50%, rgba(177, 140, 255, 0.1) 52%, transparent 100%)`,
              animation: 'scanDown 1.4s ease-in-out 0.4s forwards',
            }} />
          )}

          {showLogo && (
            <div style={{
              opacity: 0,
              transform: 'scale(0.8) rotate(-5deg)',
              animation: 'logoPop 1.0s 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            }}>
              <div style={{
                width: 'clamp(80px, 20vw, 120px)',
                height: 'clamp(80px, 20vw, 120px)',
                position: 'relative',
                filter: `drop-shadow(0 0 25px ${EPIC_THEME.colors.accentGlow})`,
              }}>
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: `radial-gradient(circle at 40% 40%, ${EPIC_THEME.colors.accent}30, transparent 70%)`,
                  borderRadius: '50%',
                  opacity: 0.6,
                  animation: 'pulseGlow 3s infinite 1.0s',
                }} />
                <img 
                  src="/Arkan-Logo.png" 
                  alt="Arkan Protocol" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'brightness(1.2)',
                  }} 
                />
              </div>
              <div style={{
                marginTop: 16,
                fontSize: 'clamp(16px, 4vw, 20px)',
                fontWeight: 'bold',
                letterSpacing: 2,
                color: EPIC_THEME.colors.accentLight,
                textShadow: `0 0 10px ${EPIC_THEME.colors.accentGlow}`,
                fontFamily: EPIC_THEME.typography.heading,
                opacity: 0,
                animation: 'fadeIn 0.8s 1.4s forwards',
              }}>
                ARKAN PROTOCOL
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scanDown {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        @keyframes logoPop {
          0% { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          70% { transform: scale(1.05) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 25px ${EPIC_THEME.colors.accentGlow}; }
          50% { box-shadow: 0 0 50px ${EPIC_THEME.colors.accentGlow}, 0 0 70px ${EPIC_THEME.colors.accentGlow}70; }
        }
      `}</style>
    </div>
  );
});

export default SystemLoader;