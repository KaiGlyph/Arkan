import { useEffect, useState, memo } from 'react';
import SystemLoader from '../components/SystemLoader';
import SessionShutdown from '../components/SessionShutdown';
import { useHabits } from '../hooks/useHabits';
import { useAuth } from '../context/AuthContext';
import { 
  XP_BY_DIFFICULTY, 
  DISPLAY_NAMES, 
  STATUS_TEXT, 
  STATUS_COLORS, 
  EPIC_THEME,
  RARITY_COLORS,
  RARITY_NAMES,
  TITLE_RARITY_COLORS,
  TITLE_RARITY_NAMES,
} from '../constants/constants';
import type { ItemRarity, StatName} from '../types';
import { useShop } from '../hooks/useShop';


// ✅ Contenedor de tarjeta estable
const EpicCard = memo(function EpicCard({ 
  children, 
  style = {}, 
  onClick,
  ...rest 
}: { 
  children: React.ReactNode; 
  style?: React.CSSProperties;
  onClick?: () => void;
  [key: string]: any;
}) {
  return (
    <div
      onClick={onClick}
      {...rest}
      style={{
        backgroundColor: 'rgba(15, 10, 25, 0.8)',
        borderRadius: '0px',
        padding: 'clamp(12px, 3vw, 16px)',
        border: `2px solid ${EPIC_THEME.colors.accent}`,
        boxShadow: `0 0 25px ${EPIC_THEME.colors.accentGlow}, inset 0 0 30px rgba(177, 140, 255, 0.1)`,
        position: 'relative',
        overflow: 'visible',
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'all 0.2s ease' : 'none',
        ...style,
      }}
    >
      {/* Esquinas */}
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
        <div key={i} style={{ position: 'absolute', ...line, background: line.bg, boxShadow: '0 0 8px #B18CFF', zIndex: 15 }} />
      ))}
      {children}
    </div>
  );
});

// ✅ Contenedor de modal estable
const EpicModalFrame = memo(function EpicModalFrame({ children, title, onClose }: { 
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(5, 2, 12, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(12px)'
    }}>
      <div style={{ 
        position: 'relative', 
        width: 'min(96%, 800px)', 
        height: 'clamp(70vh, 85vh, 90vh)', 
        margin: '0 clamp(8px, 2vw, 12px)', 
        overflow: 'visible' 
      }}>
        <div style={{ 
          position: 'relative', 
          backgroundColor: 'rgba(15, 10, 25, 0.8)', 
          border: `2px solid ${EPIC_THEME.colors.accent}`, 
          boxShadow: `0 0 25px ${EPIC_THEME.colors.accentGlow}, inset 0 0 30px rgba(177, 140, 255, 0.1)`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
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
            <div key={i} style={{ position: 'absolute', ...line, background: line.bg, boxShadow: '0 0 8px #B18CFF', zIndex: 15 }} />
          ))}
          <button onClick={onClose} aria-label="Cerrar" style={{ position: 'absolute', right: 14, top: 14, background: 'rgba(177, 140, 255, 0.15)', border: '2px solid #B18CFF', color: '#D8B4FE', fontSize: 20, fontWeight: 'bold', cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, padding: 0 }}>×</button>
          <div style={{ padding: '36px 28px 20px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', width: '100%', height: 2, background: `linear-gradient(90deg, transparent 0%, ${EPIC_THEME.colors.accent} 25%, ${EPIC_THEME.colors.accent} 75%, transparent 100%)`, top: '50%', left: 0 }} />
              <div style={{ position: 'relative', backgroundColor: 'rgba(20, 10, 35, 0.8)', padding: '8px 40px', border: `2px solid ${EPIC_THEME.colors.accent}`, boxShadow: `0 0 20px ${EPIC_THEME.colors.accentGlow}, inset 0 0 20px rgba(177, 140, 255, 0.1)` }}>
                <h2 style={{ fontFamily: EPIC_THEME.typography.heading, margin: 0, fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 800, letterSpacing: 'clamp(4px, 1.2vw, 8px)', color: EPIC_THEME.colors.accentLight, textShadow: `0 0 8px ${EPIC_THEME.colors.accentLight}, 0 0 16px ${EPIC_THEME.colors.accentGlow}`, textAlign: 'center' }}>{title}</h2>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 28px 36px 28px', minHeight: 0 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

// ✅ Modal de Perfil — actualizado para usar títulos dinámicos
const ProfileModal = memo(function ProfileModal({
  initial,
  onClose,
  onSave,
  stats,
  titles,
}: {
  initial: { name: string; age: number; title: string; bio: string };
  onClose: () => void;
  onSave: (v: { name: string; age: number; title: string; bio: string }) => void;
  stats: { streak: number; successRate: number; fractal: number; xyn: number };
  titles: { id: string; name: string }[];
}) {
  const [local, setLocal] = useState(initial);
  useEffect(() => { setLocal(initial); }, [initial]);

  return (
    <EpicModalFrame title="PERFIL" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: 12, 
          marginBottom: 12,
          padding: '16px',
          backgroundColor: 'rgba(177, 140, 255, 0.05)',
          border: `1px solid ${EPIC_THEME.colors.accent}`,
          borderRadius: 8
        }}>
          {/* Racha */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', opacity: 0.7, marginBottom: 4, fontFamily: EPIC_THEME.typography.subtitle }}>RACHA</div>
            <div style={{ fontSize: 'clamp(20px, 4.5vw, 24px)', fontWeight: 'bold', color: EPIC_THEME.colors.accent, fontFamily: EPIC_THEME.typography.heading }}>
              {stats.streak}
            </div>
            <div style={{ fontSize: 'clamp(10px, 2vw, 11px)', opacity: 0.6, fontFamily: EPIC_THEME.typography.subtitle }}>días</div>
          </div>
          {/* Tasa Cumplimiento */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(12px, 2.4vw, 14px)', opacity: 0.7, marginBottom: 4, fontFamily: EPIC_THEME.typography.subtitle }}>ÉXITO</div>
            <div style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 'bold', color: stats.successRate >= 80 ? '#4CAF50' : stats.successRate >= 50 ? '#FF9800' : '#FF5252', fontFamily: EPIC_THEME.typography.heading }}>
              {stats.successRate}%
            </div>
            <div style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', opacity: 0.6, fontFamily: EPIC_THEME.typography.subtitle }}>tasa de cumplimiento</div>
          </div>
          
          {/* Fractal */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', opacity: 0.7, marginBottom: 4, fontFamily: EPIC_THEME.typography.subtitle }}>FRACTAL</div>
            <div style={{ fontSize: 'clamp(20px, 4.5vw, 24px)', fontWeight: 'bold', color: '#64B5F6', fontFamily: EPIC_THEME.typography.heading }}>
              {stats.fractal}
            </div>
            <div style={{ fontSize: 'clamp(10px, 2vw, 11px)', opacity: 0.6, fontFamily: EPIC_THEME.typography.subtitle }}>TRGL</div>
          </div>
          
          {/* Xyn */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', opacity: 0.7, marginBottom: 4, fontFamily: EPIC_THEME.typography.subtitle }}>Xyn</div>
            <div style={{ fontSize: 'clamp(20px, 4.5vw, 24px)', fontWeight: 'bold', color: '#FFD700', fontFamily: EPIC_THEME.typography.heading, textShadow: '0 0 8px rgba(255, 215, 0, 0.7)' }}>
              {stats.xyn}
            </div>
            <div style={{ fontSize: 'clamp(10px, 2vw, 11px)', opacity: 0.6, fontFamily: EPIC_THEME.typography.subtitle }}>XYN</div>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 'clamp(13px, 2.6vw, 15px)', opacity: 0.9, fontFamily: EPIC_THEME.typography.subtitle }}>Nombre</label>
          <input
            type="text"
            value={local.name}
            onChange={(e) => setLocal(prev => ({ ...prev, name: e.target.value }))}
            style={{ width: '100%', padding: '10px 12px', margin: 0, boxSizing: 'border-box', backgroundColor: EPIC_THEME.colors.bgPrimary, border: `1px solid ${EPIC_THEME.colors.accent}`, borderRadius: 8, color: 'white', fontSize: 'clamp(14px, 2.8vw, 16px)', fontFamily: EPIC_THEME.typography.body }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 'clamp(13px, 2.6vw, 15px)', opacity: 0.9, fontFamily: EPIC_THEME.typography.subtitle }}>Edad</label>
          <input
            type="number"
            min="0"
            max="140"
            value={Number.isFinite(local.age) ? local.age : 0}
            onChange={(e) => {
              const v = e.target.value;
              let n = v === '' ? 0 : parseInt(v) || 0;
              if (n < 0) n = 0;
              if (n > 140) n = 140;
              setLocal(prev => ({ ...prev, age: n }));
            }}
            style={{ width: '100%', padding: '10px 12px', margin: 0, boxSizing: 'border-box', backgroundColor: EPIC_THEME.colors.bgPrimary, border: `1px solid ${EPIC_THEME.colors.accent}`, borderRadius: 8, color: 'white', fontSize: 'clamp(14px, 2.8vw, 16px)', fontFamily: EPIC_THEME.typography.body }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 'clamp(13px, 2.6vw, 15px)', opacity: 0.9, fontFamily: EPIC_THEME.typography.subtitle }}>Título</label>
          <select
            value={local.title}
            onChange={(e) => setLocal(prev => ({ ...prev, title: e.target.value }))}
            style={{ width: '100%', padding: '10px 12px', backgroundColor: EPIC_THEME.colors.bgPrimary, border: `1px solid ${EPIC_THEME.colors.accent}`, borderRadius: 8, color: 'white', fontSize: 'clamp(14px, 2.8vw, 16px)', fontFamily: EPIC_THEME.typography.body, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23B18CFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 30 }}
          >
            <option value="">Seleccionar...</option>
            {titles.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 'clamp(13px, 2.6vw, 15px)', opacity: 0.9, fontFamily: EPIC_THEME.typography.subtitle }}>Biografía</label>
          <textarea
            value={local.bio}
            onChange={(e) => setLocal(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Escribe tu historia, objetivos o motivación..."
            maxLength={300}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              margin: 0, 
              boxSizing: 'border-box', 
              backgroundColor: EPIC_THEME.colors.bgPrimary, 
              border: `1px solid ${EPIC_THEME.colors.accent}`, 
              borderRadius: 8, 
              color: 'white', 
              fontSize: 'clamp(14px, 2.8vw, 16px)', 
              fontFamily: EPIC_THEME.typography.body,
              minHeight: 100,
              resize: 'vertical'
            }}
          />
          <div style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', opacity: 0.6, marginTop: 4, textAlign: 'right' }}>
            {local.bio.length}/300
          </div>
        </div>
        <button onClick={() => onSave(local)} style={{ padding: '10px 16px', fontWeight: 700, cursor: 'pointer', background: EPIC_THEME.colors.accent, color: '#0F071A', border: 'none' }}>GUARDAR</button>
      </div>
    </EpicModalFrame>
  );
});

// ✅ Componente principal
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
  const [assigningPoints, setAssigningPoints] = useState<{ rewardId: string; points: number } | null>(null);
  const [pointAssignment, setPointAssignment] = useState<Partial<Record<StatName, number>>>({});


  type InventoryFilter = {
    category: 'all' | 'consumible' | 'especial';
    rarity: 'all' | ItemRarity;
  };
  const [inventoryFilter, setInventoryFilter] = useState<InventoryFilter>({ 
    category: 'all',
    rarity: 'all' 
  });

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  type ModalFilter = 'all' | 'comun' | 'raro' | 'epico' | 'legendario';
  const [_modalFilter, _setModalFilter] = useState<ModalFilter>('all');
  
  const [titleFilter, setTitleFilter] = useState<'all' | 'inicial' | 'racha' | 'nivel' | 'especial' | 'legendario'>('all');
  const shop = useShop();
  type ShopFilter = {
    currency: 'all' | 'fractal' | 'xyn';
    type: 'all' | 'item' | 'title';
    rarity: 'all' | ItemRarity;
  };

  const [shopFilter, setShopFilter] = useState<ShopFilter>({ 
    currency: 'all', 
    type: 'all',
    rarity: 'all',
  });
  const [selectedShopItem, setSelectedShopItem] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<{ show: boolean; message: string; success: boolean }>({ 
    show: false, 
    message: '', 
    success: false 
  });

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

  // ✅ Botón reutilizable
  const EpicButton = ({ children, onClick, variant = 'default' as const, style: customStyle = {}, ...props }: any) => {
    const baseStyle: React.CSSProperties = {
      padding: '10px 16px', borderRadius: 0, border: 'none', fontWeight: 'bold', cursor: 'pointer', fontFamily: EPIC_THEME.typography.heading,
      fontSize: 'clamp(14px, 3.2vw, 15px)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      whiteSpace: 'nowrap', position: 'relative', overflow: 'visible',
    };
    const variants: Record<string, React.CSSProperties> = {
      default: { backgroundColor: 'rgba(15, 10, 25, 0.9)', color: EPIC_THEME.colors.accentLight, border: `2px solid ${EPIC_THEME.colors.accent}`, boxShadow: `0 0 15px ${EPIC_THEME.colors.accentGlow}, inset 0 0 20px rgba(177, 140, 255, 0.1)` },
      primary: { backgroundColor: EPIC_THEME.colors.accent, color: '#0F071A', border: `2px solid ${EPIC_THEME.colors.accent}`, boxShadow: `0 0 20px ${EPIC_THEME.colors.accentGlow}, inset 0 0 25px rgba(177, 140, 255, 0.3)` },
      secondary: { backgroundColor: 'transparent', color: EPIC_THEME.colors.accentLight, border: `2px solid ${EPIC_THEME.colors.accent}`, boxShadow: `0 0 10px ${EPIC_THEME.colors.accentGlow}` },
      danger: { backgroundColor: 'rgba(244, 67, 54, 0.2)', color: '#FF5252', border: '2px solid rgba(244, 67, 54, 0.7)', boxShadow: '0 0 15px rgba(244, 67, 54, 0.5)' },
    };
    return (
      <button onClick={onClick} style={{ ...baseStyle, ...variants[variant], ...customStyle }} {...props}>
        <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
      </button>
    );
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
      }
    }
    @media (min-width: 1920px) {
      body {
        background: linear-gradient(135deg, #0A0514 0%, #1a0a2e 100%);
      }
    }
  `}</style>

  {/* ✅ Contenedor centralizado para PC/Tablet */}
  <div className="arkancard-container" style={{ 
    width: '100%', 
    maxWidth: '1200px',
    margin: '6px auto',
  }}>
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
          // fallback inline styles (keeps sane defaults if CSS not loaded)
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
          {/* Círculo exterior completo */}
          <circle cx="12" cy="12" r="9" />
          {/* Círculo interior sólido */}
          <circle cx="12" cy="12" r="3" />
          {/* Dientes del engranaje (8) */}
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" strokeLinejoin="round" />
          {/* Conexión circular (opcional) */}
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
      <EpicModalFrame title="MISIONES DIARIAS" onClose={() => setModal(null)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(['exercise', 'mobility', 'health', 'mind', 'productivity', 'discipline'] as const).map(category => {
            const missions = dailyMissions[category];
            if (!missions || missions.length === 0) return null;
            return missions.map((habit) => {
              const today = new Date().toISOString().split('T')[0];
              const isCompleted = habit.lastCompleted === today;
              return (
                <div key={habit.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', backgroundColor: 'rgba(15, 10, 25, 0.8)', borderRadius: 0, border: `2px solid ${isCompleted ? 'rgba(76, 175, 80, 0.6)' : EPIC_THEME.colors.accent}`, boxShadow: isCompleted ? '0 0 16px rgba(76, 175, 80, 0.4), inset 0 0 12px rgba(76, 175, 80, 0.1)' : `0 0 25px ${EPIC_THEME.colors.accentGlow}, inset 0 0 30px rgba(177, 140, 255, 0.1)` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: EPIC_THEME.typography.subtitle, fontWeight: 700, fontSize: 'clamp(18px, 4.2vw, 22px)', marginBottom: 6, color: isCompleted ? 'rgba(200, 200, 200, 0.6)' : '#FFFFFF', letterSpacing: 0.8, textDecoration: isCompleted ? 'line-through' : 'none' }}>{habit.name}</div>
                    <div style={{ fontSize: 'clamp(13px, 2.6vw, 15px)', color: isCompleted ? 'rgba(76, 175, 80, 0.7)' : '#D8B4FE', fontWeight: 600, fontFamily: EPIC_THEME.typography.subtitle, letterSpacing: 1.2 }}>[{XP_BY_DIFFICULTY[habit.difficulty]} XP]</div>
                  </div>
                  <button onClick={() => handleToggleHabit(habit.id)} disabled={isCompleted} style={{ width: 40, height: 40, borderRadius: 6, border: `2px solid ${isCompleted ? '#4CAF50' : 'rgba(120, 100, 150, 0.6)'}`, backgroundColor: isCompleted ? 'rgba(76, 175, 80, 0.35)' : 'rgba(40, 30, 60, 0.7)', cursor: isCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isCompleted ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)', fontSize: 20, fontWeight: 'bold' }}>{isCompleted ? '✓' : '○'}</button>
                </div>
              );
            });
          })}
          <div style={{ 
            padding: '16px 20px', 
            backgroundColor: 'rgba(255, 67, 67, 0.15)', 
            border: '2px solid rgba(255, 67, 67, 0.7)', 
            borderRadius: 0,
            boxShadow: '0 0 20px rgba(255, 67, 67, 0.4)',
            marginBottom: 8
          }}>
            <div style={{ 
              fontFamily: EPIC_THEME.typography.heading, 
              fontWeight: 700, 
              fontSize: 'clamp(16px, 3.6vw, 18px)', 
              color: '#FF5252',
              marginBottom: 8,
              letterSpacing: 1
            }}>
              ADVERTENCIA
            </div>
            <div style={{ 
              fontSize: 'clamp(13px, 2.6vw, 15px)', 
              color: '#FFB3B3', 
              fontFamily: EPIC_THEME.typography.subtitle,
              lineHeight: 1.6
            }}>
              Es OBLIGATORIO completar todas las misiones diarias. Si fallas en cumplir con tus objetivos, se aplicarán penalizaciones severas de XP y estadísticas. Completar todas las misiones te otorgará recompensas especiales en el buzón.
            </div>
          </div>
        </div>
      </EpicModalFrame>
    )}

    {/* Modal Buzón */}
    {modal === 'mailbox' && (
      <EpicModalFrame title="BUZÓN" onClose={() => { setModal(null); setAssigningPoints(null); setPointAssignment({}); }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pendingRewards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: EPIC_THEME.colors.accentLight, fontSize: 'clamp(16px, 3.6vw, 18px)', opacity: 0.7, fontFamily: EPIC_THEME.typography.subtitle }}>No tienes recompensas pendientes.</div>
          ) : (
            pendingRewards.map(reward => {
              const isPointsReward = reward.type === 'dailyMissions' && reward.stats.points;
              const isAssigning = assigningPoints?.rewardId === reward.id;
              return (
                <EpicCard key={reward.id} style={{ border: `2px solid ${isPointsReward ? '#FFD700' : EPIC_THEME.colors.accent}` }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(18px, 4.2vw, 22px)', color: EPIC_THEME.colors.accentLight, marginBottom: 8, fontFamily: EPIC_THEME.typography.heading }}>{reward.description}</div>
                    <div style={{ fontSize: 'clamp(13px, 2.6vw, 15px)', color: '#D8B4FE', opacity: 0.8, fontFamily: EPIC_THEME.typography.subtitle }}>
                      {isPointsReward ? `Recompensa: ${reward.stats.points} puntos asignables` : Object.entries(reward.stats).filter(([key]) => key !== 'points').map(([stat, value]) => `${DISPLAY_NAMES[stat as StatName]}: +${value}`).join(', ')}
                    </div>
                  </div>
                  {isPointsReward && !isAssigning && (
                    <EpicButton onClick={() => { setAssigningPoints({ rewardId: reward.id, points: reward.stats.points || 0 }); setPointAssignment({}); }} variant="primary" style={{ width: '100%', padding: 12 }}>ASIGNAR PUNTOS</EpicButton>
                  )}
                  {isPointsReward && isAssigning && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ fontSize: 'clamp(13px, 2.6vw, 15px)', color: EPIC_THEME.colors.accentLight, fontFamily: EPIC_THEME.typography.subtitle, textAlign: 'center', padding: '8px 12px', borderRadius: 8 }}>
                        Asigna {reward.stats.points} puntos a las estadísticas que desees:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, alignItems: 'start' }}>
                        {(['fuerza', 'agilidad', 'vitalidad', 'inteligencia', 'percepcion', 'sense'] as StatName[]).map(stat => (
                          <div key={stat} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontSize: 'clamp(12px, 2.4vw, 14px)', color: EPIC_THEME.colors.accentLight, fontFamily: EPIC_THEME.typography.subtitle, fontWeight: 600, paddingLeft: 4 }}>{DISPLAY_NAMES[stat]}</label>
                            <input type="number" min="0" max={reward.stats.points || 0} value={pointAssignment[stat] || 0} onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const currentTotal = Object.values(pointAssignment).reduce((sum, v) => sum + (v || 0), 0);
                              const remaining = (reward.stats.points || 0) - currentTotal + (pointAssignment[stat] || 0);
                              if (val <= remaining && val >= 0) setPointAssignment({ ...pointAssignment, [stat]: val });
                            }} style={{ width: '100%', padding: '12px', backgroundColor: EPIC_THEME.colors.bgPrimary, border: `2px solid ${EPIC_THEME.colors.accent}`, borderRadius: 8, color: 'white', fontSize: 'clamp(16px, 3.2vw, 18px)', fontFamily: EPIC_THEME.typography.body, fontWeight: 'bold', textAlign: 'center', boxSizing: 'border-box' }} />
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 'clamp(14px, 2.8vw, 16px)', color: EPIC_THEME.colors.accent, textAlign: 'center', fontFamily: EPIC_THEME.typography.heading, fontWeight: 'bold', padding: '12px', borderRadius: 8, }}>
                        Puntos restantes: {(reward.stats.points || 0) - Object.values(pointAssignment).reduce((sum, v) => sum + (v || 0), 0)}
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <EpicButton onClick={() => {
                          const total = Object.values(pointAssignment).reduce((sum, v) => sum + (v || 0), 0);
                          if (total === (reward.stats.points || 0)) { claimReward(reward.id, pointAssignment); setAssigningPoints(null); setPointAssignment({}); }
                        }} variant="primary" style={{ flex: 1, padding: 14 }} disabled={Object.values(pointAssignment).reduce((sum, v) => sum + (v || 0), 0) !== (reward.stats.points || 0)}>CONFIRMAR</EpicButton>
                        <EpicButton onClick={() => { setAssigningPoints(null); setPointAssignment({}); }} variant="secondary" style={{ flex: 1, padding: 14 }}>CANCELAR</EpicButton>
                      </div>
                    </div>
                  )}
                  {!isPointsReward && (
                    <EpicButton onClick={() => claimReward(reward.id)} variant="primary" style={{ width: '100%', padding: 12 }}>RECLAMAR</EpicButton>
                  )}
                </EpicCard>
              );
            })
          )}
        </div>
      </EpicModalFrame>
    )}

    {/* Modal Inventario */}
    {modal === 'inventory' && (
      <EpicModalFrame title="INVENTARIO" onClose={() => { setModal(null); setSelectedItem(null); }}>
        {/* 🔧 Filtros: Categoría | Rareza */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: 10, 
          marginBottom: 24,
          padding: '0 12px'
        }}>
          {/* Categoría */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ 
              fontSize: 'clamp(12px, 2.4vw, 13px)', 
              opacity: 0.8, 
              fontFamily: EPIC_THEME.typography.subtitle 
            }}>Categoría</label>
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
              fontFamily: EPIC_THEME.typography.subtitle 
            }}>Rareza</label>
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
          gap: 14 
        }}>
          {inventory
            .filter(item => {
              const matchesCategory = inventoryFilter.category === 'all' || item.category === inventoryFilter.category;
              const matchesRarity = inventoryFilter.rarity === 'all' || item.rarity === inventoryFilter.rarity;
              return matchesCategory && matchesRarity;
            })
            .map(item => (
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
                  <div style={{ fontSize: 'clamp(32px, 8vw, 40px)', marginBottom: 8 }}>{item.name.split(' ')[0]}</div>
                  <div style={{ fontSize: 'clamp(12px, 2.4vw, 13px)', fontWeight: 'bold', marginBottom: 4, color: RARITY_COLORS[item.rarity], fontFamily: EPIC_THEME.typography.subtitle, letterSpacing: 0.5 }}>
                    {item.name.split(' ').slice(1).join(' ')}
                  </div>
                  <div style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', opacity: 0.6, marginBottom: 6, fontFamily: EPIC_THEME.typography.subtitle }}>
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
                      fontWeight: 'bold' 
                    }}>
                      {item.quantity}
                    </div>
                  )}
                </div>
              </EpicCard>
            ))}
        </div>

        {/* Mensaje vacío */}
        {inventory
          .filter(item => {
            const matchesCategory = inventoryFilter.category === 'all' || item.category === inventoryFilter.category;
            const matchesRarity = inventoryFilter.rarity === 'all' || item.rarity === inventoryFilter.rarity;
            return matchesCategory && matchesRarity;
          })
          .length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 16px', 
              color: EPIC_THEME.colors.accentLight, 
              fontSize: 'clamp(16px, 3.6vw, 18px)', 
              opacity: 0.7, 
              fontFamily: EPIC_THEME.typography.subtitle 
            }}>
              Tu inventario está vacío<br />
              o no hay ítems que coincidan con los filtros.
            </div>
          )}

        {/* Modal de detalle de ítem — sin cambios */}
        {selectedItem && (() => {
          const item = inventory.find(i => i.id === selectedItem);
          if (!item) return null;
          return (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(5, 2, 12, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, backdropFilter: 'blur(12px)'
            }} onClick={() => setSelectedItem(null)}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(90%, 400px)', margin: '0 12px' }}>
                <EpicCard style={{ border: `2px solid ${RARITY_COLORS[item.rarity]}`, boxShadow: `0 0 30px ${RARITY_COLORS[item.rarity]}60` }}>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 'clamp(48px, 12vw, 64px)', marginBottom: 12 }}>{item.name.split(' ')[0]}</div>
                    <div style={{ fontSize: 'clamp(18px, 4.2vw, 22px)', fontWeight: 'bold', marginBottom: 8, color: RARITY_COLORS[item.rarity], fontFamily: EPIC_THEME.typography.heading }}>
                      {item.name.split(' ').slice(1).join(' ')}
                    </div>
                    <div style={{ fontSize: 'clamp(13px, 2.6vw, 15px)', opacity: 0.8, marginBottom: 4, fontFamily: EPIC_THEME.typography.subtitle, color: RARITY_COLORS[item.rarity] }}>
                      {RARITY_NAMES[item.rarity]}
                    </div>
                    {item.quantity && item.quantity > 1 && (
                      <div style={{ fontSize: 'clamp(12px, 2.4vw, 14px)', opacity: 0.7, fontFamily: EPIC_THEME.typography.subtitle }}>Cantidad: {item.quantity}</div>
                    )}
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 'clamp(14px, 2.8vw, 16px)', lineHeight: 1.6, marginBottom: 16, opacity: 0.9, fontFamily: EPIC_THEME.typography.body, fontStyle: 'italic' }}>
                      {item.description}
                    </div>
                    {item.effect && (
                      <div style={{ 
                        padding: '12px 16px', 
                        backgroundColor: 'rgba(177, 140, 255, 0.1)', 
                        border: `1px solid ${EPIC_THEME.colors.accent}`, 
                        borderRadius: 8,
                        marginBottom: 16
                      }}>
                        <div style={{ fontSize: 'clamp(12px, 2.4vw, 13px)', opacity: 0.7, marginBottom: 4, fontFamily: EPIC_THEME.typography.subtitle }}>EFECTO</div>
                        <div style={{ fontSize: 'clamp(14px, 2.8vw, 16px)', color: EPIC_THEME.colors.accent, fontWeight: 'bold', fontFamily: EPIC_THEME.typography.heading }}>
                          {item.effect.description}
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {item.consumable && (
                      <EpicButton 
                        onClick={() => { useItem(item.id); setSelectedItem(null); }} 
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
      </EpicModalFrame>
    )}

    {/* Modal Tienda */}
    {modal === 'shop' && (
      <EpicModalFrame title="TIENDA ARKAN" onClose={() => { 
        setModal(null); 
        setSelectedShopItem(null); 
        setPurchaseStatus({ show: false, message: '', success: false });
      }}>
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
              fontFamily: EPIC_THEME.typography.heading 
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
          borderRadius: 8
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', opacity: 0.7, marginBottom: 4 }}>FRACTAL</div>
            <div style={{ 
              fontSize: 'clamp(20px, 4.5vw, 24px)', 
              fontWeight: 'bold', 
              color: '#64B5F6',
              fontFamily: EPIC_THEME.typography.heading 
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
              textShadow: '0 0 8px rgba(255, 215, 0, 0.7)'
            }}>
              {shop.xyn}
            </div>
          </div>
        </div>

      {/* 🔧 Filtros: Moneda | Tipo | Rareza */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: 10, 
        marginBottom: 24,
        padding: '0 12px'
      }}>
        {/* Moneda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ 
            fontSize: 'clamp(12px, 2.4vw, 13px)', 
            opacity: 0.8, 
            fontFamily: EPIC_THEME.typography.subtitle 
          }}>Moneda</label>
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
            fontFamily: EPIC_THEME.typography.subtitle 
          }}>Tipo</label>
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
              fontFamily: EPIC_THEME.typography.subtitle 
            }}>Rareza</label>
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
          gap: 16 
        }}>
        {shop.catalog
          .filter(item => {
            // Filtro por moneda
            const matchesCurrency = shopFilter.currency === 'all' || 
                                    item.currency === shopFilter.currency;
            // Filtro por tipo
            const itemType = item.effect.type === 'unlock_title' ? 'title' : 'item';
            const matchesType = shopFilter.type === 'all' || shopFilter.type === itemType;
            // Filtro por rareza
            const matchesRarity = shopFilter.rarity === 'all' || item.rarity === shopFilter.rarity;

            return matchesCurrency && matchesType && matchesRarity;
          })
          .map(item => {
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
                      marginBottom: 4
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      fontSize: 'clamp(10px, 2vw, 11px)', 
                      opacity: 0.7,
                      marginBottom: 8
                    }}>
                      {RARITY_NAMES[item.rarity]}
                    </div>
                  </div>

                  <div style={{ 
                    fontSize: 'clamp(12px, 2.4vw, 13px)', 
                    lineHeight: 1.5, 
                    marginBottom: 12,
                    minHeight: 60,
                    opacity: 0.9
                  }}>
                    {item.description}
                  </div>

                  <div style={{ 
                    padding: '10px 14px',
                    backgroundColor: canBuy ? `${currencyColor}20` : 'rgba(120, 120, 120, 0.2)',
                    border: `2px solid ${canBuy ? currencyColor : '#666'}`,
                    borderRadius: 8,
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: 'clamp(18px, 4vw, 22px)', 
                      fontWeight: 'bold',
                      color: canBuy ? currencyColor : '#888',
                      fontFamily: EPIC_THEME.typography.heading
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
                      fontWeight: 'bold'
                    }}>
                      Fondos insuficientes
                    </div>
                  )}
                </EpicCard>
              );
            })}
        </div>

        {shop.catalog.filter(item => {
          const matchesCurrency = shopFilter.currency === 'all' || item.currency === shopFilter.currency;
          const matchesType = shopFilter.type === 'all' ||
            (shopFilter.type === 'item' && item.effect.type === 'give_item') ||
            (shopFilter.type === 'title' && item.effect.type === 'unlock_title');
          return matchesCurrency && matchesType;
        }).length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 16px', 
            color: EPIC_THEME.colors.accentLight, 
            fontSize: 'clamp(16px, 3.6vw, 18px)', 
            opacity: 0.7 
          }}>
            No hay ítems disponibles en esta categoría.
          </div>
        )}

        {/* Modal de confirmación */}
        {selectedShopItem && (() => {
          const item = shop.catalog.find(i => i.id === selectedShopItem);
          if (!item) return null;
          
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
              zIndex: 1002, 
              backdropFilter: 'blur(12px)'
            }} onClick={() => setSelectedShopItem(null)}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(90%, 420px)', margin: '0 12px' }}>
                <EpicCard style={{ 
                  border: `2px solid ${RARITY_COLORS[item.rarity]}`, 
                  boxShadow: `0 0 40px ${RARITY_COLORS[item.rarity]}60` 
                }}>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ 
                      fontSize: 'clamp(20px, 4.8vw, 26px)', 
                      fontWeight: 'bold', 
                      color: RARITY_COLORS[item.rarity],
                      fontFamily: EPIC_THEME.typography.heading,
                      marginBottom: 8
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      fontSize: 'clamp(12px, 2.4vw, 14px)', 
                      opacity: 0.7,
                      marginBottom: 12
                    }}>
                      {RARITY_NAMES[item.rarity]}
                    </div>
                  </div>

                  <div style={{ 
                    fontSize: 'clamp(14px, 2.8vw, 16px)', 
                    lineHeight: 1.6, 
                    marginBottom: 20,
                    opacity: 0.9
                  }}>
                    {item.description}
                  </div>

                  <div style={{ 
                    padding: '16px',
                    backgroundColor: 'rgba(177, 140, 255, 0.05)',
                    border: `1px solid ${EPIC_THEME.colors.accent}`,
                    borderRadius: 8,
                    marginBottom: 20
                  }}>
                    <div style={{ 
                      fontSize: 'clamp(13px, 2.6vw, 15px)', 
                      opacity: 0.7, 
                      marginBottom: 8,
                      textAlign: 'center'
                    }}>
                      PRECIO
                    </div>
                    <div style={{ 
                      fontSize: 'clamp(26px, 6vw, 32px)', 
                      fontWeight: 'bold',
                      color: item.currency === 'fractal' ? '#64B5F6' : '#FFD700',
                      fontFamily: EPIC_THEME.typography.heading,
                      textAlign: 'center',
                      textShadow: item.currency === 'xyn' ? '0 0 10px rgba(255, 215, 0, 0.6)' : 'none'
                    }}>
                      {item.price} {item.currency === 'fractal' ? 'TRGL' : 'XYN'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => {
                        const result = shop.buyItem(item.id);
                        setPurchaseStatus({
                          show: true,
                          message: result.message || (result.success ? '¡Compra exitosa!' : 'Error en la compra'),
                          success: result.success
                        });
                        setSelectedShopItem(null);
                        setTimeout(() => {
                          setPurchaseStatus({ show: false, message: '', success: false });
                        }, 3000);
                      }}
                      disabled={!shop.canAfford(item)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        fontSize: 'clamp(16px, 3.5vw, 18px)',
                        fontWeight: 'bold',
                        fontFamily: EPIC_THEME.typography.heading,
                        letterSpacing: '0.5px',
                        textAlign: 'center',
                        backgroundColor: shop.canAfford(item)
                          ? 'linear-gradient(135deg, #8A2BE2, #9370DB)' // Gradiente púrpura
                          : 'rgba(100, 100, 120, 0.5)',
                        color: shop.canAfford(item) ? '#FFFFFF' : '#AAAAAA',
                        border: `2px solid ${shop.canAfford(item) ? '#9370DB' : '#555'}`,
                        borderRadius: 0,
                        boxShadow: shop.canAfford(item)
                          ? '0 0 15px rgba(147, 112, 219, 0.6), inset 0 0 10px rgba(147, 112, 219, 0.3)'
                          : 'none',
                        cursor: shop.canAfford(item) ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease',
                        textShadow: shop.canAfford(item) ? '0 0 8px rgba(255, 255, 255, 0.8)' : 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        // ✅ Efecto hover
                        ...(shop.canAfford(item) && {
                          ':hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 0 25px rgba(147, 112, 219, 0.8), inset 0 0 15px rgba(147, 112, 219, 0.5)',
                            filter: 'brightness(1.1)',
                          },
                        }),
                        // ✅ Efecto de pulsado
                        ...(shop.canAfford(item) && {
                          ':active': {
                            transform: 'scale(0.98)',
                            boxShadow: '0 0 10px rgba(147, 112, 219, 0.5), inset 0 0 5px rgba(147, 112, 219, 0.3)',
                          },
                        }),
                      }}
                    >
                      {shop.canAfford(item) ? 'COMPRAR' : 'FONDOS INSUFICIENTES'}
                    </button>
                  </div>
                </EpicCard>
              </div>
            </div>
          );
        })()}
      </EpicModalFrame>
    )}

{/* Modal Títulos */}
{modal === 'titles' && (
  <EpicModalFrame title="TÍTULOS" onClose={() => setModal(null)}>
    {/* Filtros */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
      gap: 10, 
      marginBottom: 24,
      padding: '0 12px'
    }}>
      {/* Categoría */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ 
          fontSize: 'clamp(12px, 2.4vw, 13px)', 
          opacity: 0.8, 
          fontFamily: EPIC_THEME.typography.subtitle 
        }}>Categoría</label>
        <select
          value={titleFilter}
          onChange={e => setTitleFilter(e.target.value as any)}
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
      gap: 16 
    }}>
      {titles
        .filter(title => titleFilter === 'all' || title.category === titleFilter)
        .map(title => {
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
              onClick={() => title.unlocked && setActiveTitle(isActive ? null : title.id)}
            >
              {/* Icono */}
              <div style={{
                fontSize: 'clamp(28px, 7vw, 36px)',
                textAlign: 'center',
                marginBottom: 8,
                textShadow: `0 0 8px ${rarityColor}`
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
    {titles.filter(title => titleFilter === 'all' || title.category === titleFilter).length === 0 && (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 16px', 
        color: EPIC_THEME.colors.accentLight, 
        fontSize: 'clamp(16px, 3.6vw, 18px)', 
        opacity: 0.7, 
        fontFamily: EPIC_THEME.typography.subtitle 
      }}>
        {titleFilter === 'all'
          ? 'No tienes títulos aún. ¡Completa misiones y sube de nivel!'
          : `No hay títulos en la categoría "${titleFilter}".`
        }
      </div>
    )}
  </EpicModalFrame>
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