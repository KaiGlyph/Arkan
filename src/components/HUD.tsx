import { useEffect, useState } from 'react';
import SystemLoader from './SystemLoader';
import SessionShutdown from './SessionShutdown';
import { useHabits } from '../hooks/useHabits';
import { useAuth } from '../context/AuthContext';
import { 
  DISPLAY_NAMES, 
  STATUS_TEXT, 
  STATUS_COLORS, 
  EPIC_THEME,
} from '../constants/constants';
import { useShop } from '../hooks/useShop';
import { EpicCard, EpicButton } from './ui';
import { ProfileModal, MissionsModal, MailboxModal, InventoryModal, ShopModal, TitlesModal } from './modals';

function HUD() {
  const [loaded, setLoaded] = useState(false);
  const { signOut } = useAuth();
  const {
    level, xpProgress, xpToNextLevel, progressPercent,
    attributes, energy, health, status, habits,
    dailyMissions, toggleHabit,
    name, age, bio,
    updateProfile,
    pendingRewards, claimReward,
    currentStreak, successRate,
    inventory, useItem,
    titles, activeTitle, setActiveTitle,
    fractal,
    xyn, 
  } = useHabits();

  const [modal, setModal] = useState<null | 'missions' | 'inventory' | 'titles' | 'pets' | 'profile' | 'shop' | 'mailbox'>(null);
  const [sessionShutdownVisible, setSessionShutdownVisible] = useState(false);

  const shop = useShop();

  // ✅ Notificaciones
  useEffect(() => {
    if (modal === 'profile') return;
    const requestPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };
    const sendNotification = (title: string, body: string) => {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/Arkan-Logo.png', badge: '/Arkan-Logo.png' });
      }
    };
    const checkPending = () => {
      const today = new Date().toISOString().split('T')[0];
      const pending = habits.filter(h => !h.lastCompleted || h.lastCompleted !== today);
      if (pending.length > 0) sendNotification('Arkan Protocol', `Tienes ${pending.length} hábito(s) pendientes`);
    };
    requestPermission();
    const interval = setInterval(checkPending, 60000);
    return () => clearInterval(interval);
  }, [habits, modal]);

  const handleToggleHabit = (habitId: string) => {
    toggleHabit(habitId);
  };

  const handleSaveProfile = (vals: { name: string; age: number; title: string; bio: string }) => {
    updateProfile(vals);
    setModal(null);
  };

  // ✅ Obtiene el nombre del título activo dinámicamente
  const getTitleName = (id: string) => {
    const title = titles.find(t => t.id === id);
    return title ? title.name : 'Sin título';
  };

  // ✅ Títulos disponibles para el perfil (solo desbloqueados)
  const unlockedTitleOptions = [
    { id: '', name: 'Sin título' },
    ...titles.filter(t => t.unlocked).map(t => ({ id: t.id, name: t.name })),
  ];

  if (!loaded) {
    return <SystemLoader onReady={() => setLoaded(true)} />;
  }

  return (
    <div style={{ 
      backgroundColor: '#0A0514', 
      color: '#FFFFFF', 
      fontFamily: EPIC_THEME.typography.body, 
      minHeight: '100vh', 
      boxSizing: 'border-box', 
      fontSize: 'clamp(14px, 2.8vw, 16px)', 
      lineHeight: 1.5, 
      padding: 'clamp(12px, 3vw, 24px)', 
      position: 'relative', 
      overflowX: 'hidden',
    }}>
  <style>{`
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: rgba(15, 10, 25, 0.6); border: 1px solid rgba(177, 140, 255, 0.2); }
    ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #8A2BE2, #B18CFF); border-radius: 2px; border: 1px solid rgba(177, 140, 255, 0.3); box-shadow: 0 0 8px rgba(177, 140, 255, 0.4); }
    ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #9D3EF5, #C9A5FF); box-shadow: 0 0 12px rgba(177, 140, 255, 0.6); }
    * { scrollbar-width: thin; scrollbar-color: #B18CFF rgba(15, 10, 25, 0.6); }
    @media (max-width: 768px) {
      button, input {
        min-height: 44px;
      }
      .arkancard-container {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: clamp(12px, 3vw, 24px) !important;
        /* Ocultar todas las decoraciones Sistema en móvil */
      }
      .arkancard-container > div[style*="position: absolute"] {
        display: none !important;
      }
    }
    @media (min-width: 1920px) {
      body {
        background: linear-gradient(135deg, #0A0514 0%, #1a0a2e 100%);
      }
    }
    @keyframes mailboxPulse {
      0%, 100% { 
        transform: scale(1);
        box-shadow: 0 0 25px rgba(177, 140, 255, 0.4), inset 0 0 30px rgba(177, 140, 255, 0.1);
      }
      50% { 
        transform: scale(1.02);
        box-shadow: 0 0 35px rgba(255, 215, 0, 0.8), inset 0 0 40px rgba(255, 215, 0, 0.2);
      }
    }
    @keyframes badgeBounce {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.2) rotate(-5deg); }
      75% { transform: scale(1.2) rotate(5deg); }
    }
    @keyframes glow {
      0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.6)); }
      50% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 1)); }
    }
  `}</style>

  {/* ✅ Contenedor centralizado para PC/Tablet con decoraciones Sistema */}
  <div className="arkancard-container" style={{ 
    width: '100%', 
    maxWidth: '1200px',
    margin: '50px auto 6px auto', // ✅ Más espacio arriba
    position: 'relative',
    padding: '40px 20px 20px 20px',
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

    {/* 🔷 Puntos decorativos laterales */}
    {/* Izquierda */}
    <div style={{
      position: 'absolute',
      left: '-8px',
      top: '25%',
      width: '4px',
      height: '4px',
      backgroundColor: EPIC_THEME.colors.accent,
      boxShadow: `0 0 6px ${EPIC_THEME.colors.accentGlow}`,
      opacity: 0.6,
    }}></div>
    <div style={{
      position: 'absolute',
      left: '-8px',
      top: '50%',
      width: '4px',
      height: '4px',
      backgroundColor: EPIC_THEME.colors.accent,
      boxShadow: `0 0 6px ${EPIC_THEME.colors.accentGlow}`,
      opacity: 0.6,
    }}></div>
    <div style={{
      position: 'absolute',
      left: '-8px',
      top: '75%',
      width: '4px',
      height: '4px',
      backgroundColor: EPIC_THEME.colors.accent,
      boxShadow: `0 0 6px ${EPIC_THEME.colors.accentGlow}`,
      opacity: 0.6,
    }}></div>
    
    {/* Derecha */}
    <div style={{
      position: 'absolute',
      right: '-8px',
      top: '25%',
      width: '4px',
      height: '4px',
      backgroundColor: EPIC_THEME.colors.accent,
      boxShadow: `0 0 6px ${EPIC_THEME.colors.accentGlow}`,
      opacity: 0.6,
    }}></div>
    <div style={{
      position: 'absolute',
      right: '-8px',
      top: '50%',
      width: '4px',
      height: '4px',
      backgroundColor: EPIC_THEME.colors.accent,
      boxShadow: `0 0 6px ${EPIC_THEME.colors.accentGlow}`,
      opacity: 0.6,
    }}></div>
    <div style={{
      position: 'absolute',
      right: '-8px',
      top: '75%',
      width: '4px',
      height: '4px',
      backgroundColor: EPIC_THEME.colors.accent,
      boxShadow: `0 0 6px ${EPIC_THEME.colors.accentGlow}`,
      opacity: 0.6,
    }}></div>

  {/* Header */}
  <div
    style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
      padding: "0 6px",
    }}
  >
    {/* 🔹 Zona Izquierda */}
    <div
      style={{
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
    
    </div>

    {/* 🔸 Zona Derecha: Monedas con tamaño responsivo (clamp) y mejor alineado */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        justifyContent: "flex-end",
      }}
    >
      {/* Fractales */}
      <div
        className="coin-box"
        style={{
          width: "clamp(86px, 24vw, 110px)",
          height: "clamp(32px, 6.8vw, 36px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "clamp(6px, 1.5vw, 8px)",
          padding: "0 10px",
          borderRadius: "8px",
          background: "linear-gradient(180deg, rgba(100,80,200,0.14), rgba(100,80,200,0.08))",
          border: "1px solid rgba(177,140,255,0.28)",
          boxShadow: "0 0 6px rgba(177,140,255,0.28)",
          overflow: "hidden",
        }}
      >
        <img src="/icon-fractal.png" style={{ width: "18px", height: "18px", flex: "0 0 auto" }} />
        <span
          style={{
            marginLeft: 6,
            fontSize: "clamp(13px, 3.2vw, 15px)",
            fontWeight: 600,
            color: EPIC_THEME.colors.accentLight,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "right",
            flex: 1,
          }}
        >
          {fractal}
        </span>
      </div>
      {/* Xyn */}
      <div
        className="coin-box"
        style={{
          width: "clamp(86px, 24vw, 110px)",
          height: "clamp(32px, 6.8vw, 36px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "clamp(6px, 1.5vw, 8px)",
          padding: "0 10px",
          borderRadius: "8px",
          background: "linear-gradient(180deg, rgba(240,210,80,0.14), rgba(240,210,80,0.08))",
          border: "1px solid rgba(240,210,80,0.28)",
          boxShadow: "0 0 6px rgba(240,210,80,0.28)",
          overflow: "hidden",
        }}
      >
        <img src="/icon-xyn.png" style={{ width: "18px", height: "18px", flex: "0 0 auto" }} />
        <span
          style={{
            marginLeft: 6,
            fontSize: "clamp(13px, 3.2vw, 15px)",
            fontWeight: 600,
            color: "#f5e1a0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "right",
            flex: 1,
          }}
        >
          {xyn}
        </span>
      </div>
  </div>
</div>


    {/* Perfil */}
    <EpicCard style={{ 
      marginBottom: 20, 
      textAlign: 'center', 
      position: 'relative'
    }}>
        {!sessionShutdownVisible && (
      <button
        onClick={() => setSessionShutdownVisible(true)}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          filter: "drop-shadow(0 0 6px rgba(255, 107, 107, 0.7))",
        }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#FF6B6B" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    )}
      {/* Botón Configuración — Engranaje del Sistema */}
      <button
        onClick={() => setModal('profile')}
        aria-label="Configuración"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          filter: 'drop-shadow(0 0 8px rgba(177, 140, 255, 0.6))',
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#B18CFF" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 12a7 7 0 0 1 11.7-5.3" stroke="#B18CFF" opacity="0.6" strokeLinecap="round" />
        </svg>
      </button>
      <div style={{ fontWeight: 'bold', fontSize: 'clamp(20px, 5vw, 24px)', color: EPIC_THEME.colors.accentLight, marginBottom: 6, fontFamily: EPIC_THEME.typography.heading, letterSpacing: 1 }}>{name}</div>
      <div style={{ fontSize: 'clamp(13px, 2.6vw, 15px)', opacity: 0.8, marginBottom: 6, fontFamily: EPIC_THEME.typography.subtitle }}>{age} años</div>
      <div style={{ fontSize: 'clamp(14px, 2.8vw, 16px)', color: EPIC_THEME.colors.accent, fontFamily: EPIC_THEME.typography.heading, letterSpacing: 'clamp(0.5px, 0.2vw, 1px)' }}>
        {getTitleName(activeTitle || '')}
      </div>
    </EpicCard>
    {/* Estado */}
    <EpicCard style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 'clamp(12px, 2.4vw, 14px)', opacity: 0.7, fontFamily: EPIC_THEME.typography.subtitle }}>NIVEL</div>
          <div style={{ fontWeight: 'bold', fontSize: 'clamp(20px, 4.5vw, 26px)', fontFamily: EPIC_THEME.typography.heading, letterSpacing: 1 }}>Lvl <span style={{ color: EPIC_THEME.colors.accent }}>{level}</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 'clamp(12px, 2.4vw, 14px)', opacity: 0.7, fontFamily: EPIC_THEME.typography.subtitle }}>ESTADO</div>
          <div style={{ fontWeight: 'bold', color: STATUS_COLORS[status], fontFamily: EPIC_THEME.typography.heading, fontSize: 'clamp(16px, 3.6vw, 18px)' }}>{STATUS_TEXT[status]}</div>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 'clamp(12px, 2.4vw, 13px)', opacity: 0.9, marginBottom: 6, fontFamily: EPIC_THEME.typography.subtitle, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <span>XP</span><span>{xpProgress} / {xpToNextLevel}</span>
        </div>
        <div style={{ width: '100%', height: 6, backgroundColor: 'rgba(100, 80, 130, 0.4)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: `linear-gradient(90deg, #8A2BE2, ${EPIC_THEME.colors.accent})`, borderRadius: 3, transition: 'width 0.5s cubic-bezier(0.2, 0.8, 0.4, 1)', position: 'relative', zIndex: 1 }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'HP', value: health, max: 100, color: health < 50 ? '#FF5252' : '#4CAF50' },
          { label: 'MP', value: energy, max: 100, color: energy < 30 ? '#FF9800' : '#2196F3' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', opacity: 0.8, marginBottom: 4, fontFamily: EPIC_THEME.typography.subtitle }}>{stat.label}</div>
            <div style={{ fontWeight: 'bold', fontSize: 'clamp(18px, 4vw, 20px)', color: stat.color, fontFamily: EPIC_THEME.typography.heading }}>{stat.value}<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(14px, 2.8vw, 16px)' }}>/{stat.max}</span></div>
          </div>
        ))}
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
        gap: 12, 
        fontSize: 14 
      }}>
        {(['fuerza','agilidad','vitalidad','inteligencia','percepcion','sense'] as const).map(attr => (
          <div key={attr} style={{ textAlign: 'center', padding: '10px 4px', borderRadius: 8, backgroundColor: 'rgba(50, 40, 70, 0.3)' }}>
            <div style={{ opacity: 0.8, fontSize: 12, fontFamily: EPIC_THEME.typography.subtitle, letterSpacing: 0.5 }}>{DISPLAY_NAMES[attr]}</div>
            <div style={{ fontWeight: 'bold', fontSize: 22, color: EPIC_THEME.colors.accent, fontFamily: EPIC_THEME.typography.heading, marginTop: 4 }}>{attributes[attr]}</div>
          </div>
        ))}
      </div>
    </EpicCard>
    <style>{`
      @keyframes mailboxPulse {
        0%, 100% { 
          transform: scale(1);
          box-shadow: 0 0 25px rgba(177, 140, 255, 0.4), inset 0 0 30px rgba(177, 140, 255, 0.1);
        }
        50% { 
          transform: scale(1.02);
          box-shadow: 0 0 35px rgba(255, 215, 0, 0.8), inset 0 0 40px rgba(255, 215, 0, 0.2);
        }
      }
      @keyframes badgeBounce {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.2) rotate(-5deg); }
        75% { transform: scale(1.2) rotate(5deg); }
      }
      @keyframes glow {
        0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.6)); }
        50% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 1)); }
      }
    `}</style>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(140px, 22vw, 200px), 1fr))', 
      gap: 'clamp(12px, 2vw, 16px)', 
      marginBottom: 24
    }}>
      {[
        { key: 'missions', label: 'MISIONES' },
        { key: 'titles', label: 'TÍTULOS' },
        { key: 'inventory', label: 'INVENTARIO' },
        { key: 'shop', label: 'TIENDA' },
        { key: 'pets', label: 'MASCOTAS' },
        { key: 'mailbox', label: 'BUZÓN', badge: pendingRewards.length > 0 ? pendingRewards.length : undefined },
      ].map(btn => {
        const hasNotifications = btn.key === 'mailbox' && btn.badge && btn.badge > 0;
        return (
          <EpicButton 
            key={btn.key} 
            onClick={() => setModal(btn.key as any)} 
            variant="default" 
            style={{ 
              padding: 'clamp(12px, 2vw, 14px)', 
              minHeight: 'clamp(56px, 12vw, 64px)',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 4, 
              position: 'relative',
              ...(hasNotifications && {
                animation: 'mailboxPulse 2s ease-in-out infinite',
                border: `2px solid #FFD700`,
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.15)',
              })
            }}
          >
            <span style={hasNotifications ? { animation: 'glow 1.5s ease-in-out infinite' } : {}}>{btn.label}</span>
          </EpicButton>
        );
      })}
    </div>
    {/* Modal Perfil */}
    {modal === 'profile' && (
      <ProfileModal
        initial={{ name, age, title: activeTitle || '', bio: bio || '' }}
        stats={{ streak: currentStreak, successRate, fractal, xyn }}
        onClose={() => setModal(null)}
        onSave={handleSaveProfile}
        titles={unlockedTitleOptions}
      />
    )}

    {/* Modal Misiones */}
    {modal === 'missions' && (
      <MissionsModal
        dailyMissions={dailyMissions}
        onToggleHabit={handleToggleHabit}
        onClose={() => setModal(null)}
      />
    )}

    {/* Modal Buzón */}
    {modal === 'mailbox' && (
      <MailboxModal
        pendingRewards={pendingRewards}
        onClaimReward={claimReward}
        onClose={() => setModal(null)}
      />
    )}

    {/* Modal Inventario */}
    {modal === 'inventory' && (
      <InventoryModal
        inventory={inventory}
        onUseItem={useItem}
        onClose={() => { setModal(null); }}
      />
    )}

    {/* Modal Tienda */}
    {modal === 'shop' && (
      <ShopModal
        shop={shop}
        onClose={() => {
          setModal(null);
        }}
      />
    )}

    {/* Modal Títulos */}
    {modal === 'titles' && (
      <TitlesModal
        titles={titles}
        activeTitle={activeTitle}
        onSetActiveTitle={setActiveTitle}
        onClose={() => setModal(null)}
      />
    )}

    {/* Modal de cierre de sesión */}
    {sessionShutdownVisible && (
      <SessionShutdown 
        onComplete={() => {
          setSessionShutdownVisible(false);
          signOut();
        }} 
      />
    )}

  </div>
</div>
  );
}

export default HUD;