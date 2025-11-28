import { useEffect, useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { 
  XP_BY_DIFFICULTY, 
  DISPLAY_NAMES, 
  STATUS_TEXT, 
  STATUS_COLORS, 
  RARITY_COLORS,
  RARITY_NAMES,
  ITEM_CATEGORY_NAMES,
  EPIC_THEME,
} from '../constants';
import type {ItemCategory, ItemRarity } from '../types';

const AVAILABLE_TITLES = [
  { id: 'none', name: 'Sin título' },
  { id: 'novato', name: 'Novato' },
  { id: 'diligente', name: 'Diligente' },
  { id: 'disciplinado', name: 'Disciplinado' },
  { id: 'maestro', name: 'Maestro de Hábitos' },
  { id: 'legendario', name: 'Ascendido' },
];

export default function HUD() {
  const {
    level,
    xpProgress,
    xpToNextLevel,
    progressPercent,
    attributes,
    energy,
    health,
    status,
    habits,
    dailyMissions,
    toggleHabit,
    name,
    age,
    title: currentTitleId,
    inventory,
    addItem,
    removeItem,
    updateProfile,
  } = useHabits();

  const [modal, setModal] = useState<null | 'missions' | 'inventory' | 'titles' | 'pets' | 'profile'>(null);
  const [editProfile, setEditProfile] = useState({ name: '', age: 0, title: currentTitleId });
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'all'>('all');
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'herramientas' as ItemCategory,
    rarity: 'normal' as ItemRarity,
  });

  useEffect(() => {
    const requestPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };
    const sendNotification = (title: string, body: string) => {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/Arkan-Logo.png',
          badge: '/Arkan-Logo.png',
        });
      }
    };
    const checkPending = () => {
      const today = new Date().toISOString().split('T')[0];
      const pending = habits.filter(h => !h.lastCompleted || h.lastCompleted !== today);
      if (pending.length > 0) {
        sendNotification('Arkan Protocol', `Tienes ${pending.length} hábito(s) pendientes`);
      }
    };
    requestPermission();
    const interval = setInterval(checkPending, 60000);
    return () => clearInterval(interval);
  }, [habits]);

  const handleSaveProfile = () => {
    updateProfile(editProfile);
    setModal(null);
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;
    addItem({
      name: newItem.name,
      description: newItem.description,
      category: newItem.category,
      rarity: newItem.rarity,
    });
    setNewItem({
      name: '',
      description: '',
      category: 'herramientas',
      rarity: 'normal',
    });
    setShowAddItem(false);
  };

  const filteredItems = filterCategory === 'all' 
    ? inventory 
    : inventory.filter(item => item.category === filterCategory);

  // ✅ EpicCard responsive: acepta onClick y props
  const EpicCard = ({ 
    children, 
    style = {}, 
    onClick,
    ...rest 
  }: { 
    children: React.ReactNode; 
    style?: React.CSSProperties;
    onClick?: () => void;
    [key: string]: any;
  }) => (
    <div
      onClick={onClick}
      {...rest}
      style={{
        backgroundColor: EPIC_THEME.colors.bgCard,
        borderRadius: EPIC_THEME.borderRadius.card,
        padding: '16px',
        border: `1px solid ${EPIC_THEME.colors.accentGlow}`,
        boxShadow: `${EPIC_THEME.shadows.card}, 0 0 20px ${EPIC_THEME.colors.accentGlow}`,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'all 0.2s ease' : 'none',
        ...style,
      }}
    >
      {children}
      <div style={{
        position: 'absolute',
        top: '1px',
        left: '1px',
        right: '1px',
        bottom: '1px',
        borderRadius: `calc(${EPIC_THEME.borderRadius.card} - 1px)`,
        border: `1px solid ${EPIC_THEME.colors.accentGlow}`,
        pointerEvents: 'none',
        opacity: 0.3,
      }}></div>
    </div>
  );

  const EpicButton = ({ 
    children, 
    onClick, 
    variant = 'default' as 'default' | 'primary' | 'secondary' | 'danger',
    style: customStyle = {},
    ...props 
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'primary' | 'secondary' | 'danger';
    style?: React.CSSProperties;
    [key: string]: any;
  }) => {
    const baseStyle: React.CSSProperties = {
      padding: '10px 16px',
      borderRadius: EPIC_THEME.borderRadius.button,
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontFamily: EPIC_THEME.typography.heading,
      fontSize: 'clamp(14px, 3.2vw, 15px)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
    };

    const variants: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: EPIC_THEME.colors.bgSecondary,
        color: EPIC_THEME.colors.accentLight,
        border: `1px solid ${EPIC_THEME.colors.accent}`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      },
      primary: {
        backgroundColor: EPIC_THEME.colors.accent,
        color: '#0F071A',
        border: 'none',
        boxShadow: `0 0 15px ${EPIC_THEME.colors.accentGlow}`,
      },
      secondary: {
        backgroundColor: 'transparent',
        color: EPIC_THEME.colors.accentLight,
        border: `1px solid ${EPIC_THEME.colors.accent}`,
      },
      danger: {
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        color: '#FF5252',
        border: '1px solid rgba(244, 67, 54, 0.5)',
      },
    };

    return (
      <button
        onClick={onClick}
        style={{ ...baseStyle, ...variants[variant], ...customStyle }}
        {...props}
      >
        {children}
      </button>
    );
  };

  const EpicModalFrame = ({ children, title, onClose }: { 
    children: React.ReactNode;
    title: string;
    onClose: () => void;
  }) => (
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
      <div style={{
        position: 'relative',
        width: 'min(94%, 800px)',
        maxHeight: '85vh',
        margin: '0 12px',
      }}>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            background: 'rgba(177, 140, 255, 0.15)',
            border: '2px solid #B18CFF',
            color: '#D8B4FE',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            padding: 0,
          }}
        >
          ×
        </button>

        {/* 🔷 Esquinas angulares — responsive */}
        {[
          { top: '-5px', left: '-5px', width: '28px', height: '2px', bg: '#B18CFF' },
          { top: '-5px', left: '-5px', width: '2px', height: '28px', bg: '#B18CFF' },
          { top: '-5px', right: '-5px', width: '28px', height: '2px', bg: '#B18CFF' },
          { top: '-5px', right: '-5px', width: '2px', height: '28px', bg: '#B18CFF' },
          { bottom: '-5px', left: '-5px', width: '28px', height: '2px', bg: '#B18CFF' },
          { bottom: '-5px', left: '-5px', width: '2px', height: '28px', bg: '#B18CFF' },
          { bottom: '-5px', right: '-5px', width: '28px', height: '2px', bg: '#B18CFF' },
          { bottom: '-5px', right: '-5px', width: '2px', height: '28px', bg: '#B18CFF' },
        ].map((line, i) => (
          <div key={i} style={{
            position: 'absolute',
            ...line,
            background: line.bg,
            zIndex: 15,
          }}></div>
        ))}

        <div style={{
          position: 'relative',
          backgroundColor: EPIC_THEME.colors.bgModal,
          borderRadius: EPIC_THEME.borderRadius.modal,
          padding: '32px 24px',
          border: `1px solid ${EPIC_THEME.colors.accentGlow}`,
          boxShadow: EPIC_THEME.shadows.modal,
          maxHeight: '85vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <style>{`
            div::-webkit-scrollbar { display: none; }
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '32px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              background: `linear-gradient(90deg, transparent 0%, ${EPIC_THEME.colors.accent} 25%, ${EPIC_THEME.colors.accent} 75%, transparent 100%)`,
              top: '50%',
              left: '0',
            }}></div>
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
              }}>
                {title === 'MISIONES' ? 'GOAL' : title}
              </h2>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );

  const getTitleName = (id: string) => AVAILABLE_TITLES.find(t => t.id === id)?.name || 'Sin título';

  return (
    <div style={{
      backgroundColor: EPIC_THEME.colors.bgPrimary,
      color: '#FFFFFF',
      fontFamily: EPIC_THEME.typography.body,
      minHeight: '100vh',
      boxSizing: 'border-box',
      fontSize: 'clamp(14px, 2.8vw, 16px)',
      lineHeight: 1.5,
      padding: '16px',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 30% 30%, rgba(177, 140, 255, 0.05) 0%, transparent 40%),
          radial-gradient(circle at 70% 70%, rgba(100, 50, 150, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: -1,
      }}></div>

      {/* Logo — responsive */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        position: 'relative',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <img 
            src="/Arkan-Logo.png" 
            alt="Arkan Protocol" 
            style={{ 
              width: '70%',
              height: 'auto',
              filter: 'drop-shadow(0 0 10px rgba(177, 140, 255, 0.5))',
              zIndex: 2,
            }} 
          />
        </div>
        <div style={{
          fontWeight: 'bold',
          fontSize: 'clamp(22px, 6vw, 28px)',
          letterSpacing: 'clamp(1px, 0.5vw, 2px)',
          fontFamily: EPIC_THEME.typography.heading,
          color: EPIC_THEME.colors.accentLight,
          textShadow: `0 0 8px ${EPIC_THEME.colors.accentGlow}, 0 0 16px rgba(177, 140, 255, 0.3)`,
        }}>
          ARKAN PROTOCOL
        </div>
      </div>

      {/* Perfil — responsive */}
      <EpicCard style={{ marginBottom: '20px', textAlign: 'center', position: 'relative' }}>
        <button
          onClick={() => {
            setEditProfile({ name, age, title: currentTitleId });
            setModal('profile');
          }}
          aria-label="Configuración"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: EPIC_THEME.colors.accent,
            fontSize: '18px',
            cursor: 'pointer',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            padding: 0,
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2) rotate(90deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
        >
          <span role="img" aria-label="configuración">🔧</span>
        </button>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: 'clamp(20px, 5vw, 24px)', 
          color: EPIC_THEME.colors.accentLight,
          marginBottom: '6px',
          fontFamily: EPIC_THEME.typography.heading,
          letterSpacing: '1px',
        }}>
          {name}
        </div>
        <div style={{ 
          fontSize: 'clamp(13px, 2.6vw, 15px)', 
          opacity: 0.8, 
          marginBottom: '6px',
          fontFamily: EPIC_THEME.typography.subtitle,
        }}>
          {age} años
        </div>
        <div style={{ 
          fontSize: 'clamp(14px, 2.8vw, 16px)', 
          color: EPIC_THEME.colors.accent,
          fontFamily: EPIC_THEME.typography.heading,
          letterSpacing: 'clamp(0.5px, 0.2vw, 1px)',
        }}>
          {getTitleName(currentTitleId)}
        </div>
      </EpicCard>

      {/* Estado — responsive */}
      <EpicCard style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: 'clamp(12px, 2.4vw, 14px)', opacity: 0.7, fontFamily: EPIC_THEME.typography.subtitle }}>NIVEL</div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: 'clamp(20px, 4.5vw, 26px)',
              fontFamily: EPIC_THEME.typography.heading,
              letterSpacing: '1px',
            }}>
              Lvl <span style={{ color: EPIC_THEME.colors.accent }}>{level}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'clamp(12px, 2.4vw, 14px)', opacity: 0.7, fontFamily: EPIC_THEME.typography.subtitle }}>ESTADO</div>
            <div style={{ 
              fontWeight: 'bold', 
              color: STATUS_COLORS[status],
              fontFamily: EPIC_THEME.typography.heading,
              fontSize: 'clamp(16px, 3.6vw, 18px)',
            }}>
              {STATUS_TEXT[status]}
            </div>
          </div>
        </div>

        {/* Barra XP */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            fontSize: 'clamp(12px, 2.4vw, 13px)', 
            opacity: 0.9, 
            marginBottom: '6px',
            fontFamily: EPIC_THEME.typography.subtitle,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
            <span>XP</span>
            <span>{xpProgress} / {xpToNextLevel}</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(100, 80, 130, 0.4)',
            borderRadius: '3px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: `linear-gradient(90deg, #8A2BE2, ${EPIC_THEME.colors.accent})`,
              borderRadius: '3px',
              transition: 'width 0.5s cubic-bezier(0.2, 0.8, 0.4, 1)',
              position: 'relative',
              zIndex: 1,
            }}></div>
            {progressPercent > 0 && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${Math.min(progressPercent, 100)}%`,
                borderRadius: '3px',
                overflow: 'hidden',
                pointerEvents: 'none',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer 2s infinite',
                }}></div>
              </div>
            )}
          </div>
        </div>

        {/* HP y MP */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
          gap: '12px', 
          marginBottom: '16px' 
        }}>
          {[
            { label: 'HP', value: health, max: 100, color: health < 50 ? '#FF5252' : '#4CAF50' },
            { label: 'MP', value: energy, max: 100, color: energy < 30 ? '#FF9800' : '#2196F3' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: 'clamp(11px, 2.2vw, 12px)', 
                opacity: 0.8, 
                marginBottom: '4px',
                fontFamily: EPIC_THEME.typography.subtitle,
              }}>
                {stat.label}
              </div>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: 'clamp(18px, 4vw, 20px)',
                color: stat.color,
                fontFamily: EPIC_THEME.typography.heading,
              }}>
                {stat.value}<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(14px, 2.8vw, 16px)' }}>/{stat.max}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Atributos */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '12px',
          fontSize: '14px',
        }}>
          {([
            'fuerza',
            'agilidad',
            'vitalidad',
            'inteligencia',
            'percepcion',
            'sense'
          ] as const).map(attr => (
            <div key={attr} style={{ 
              textAlign: 'center',
              padding: '10px 4px',
              borderRadius: '8px',
              backgroundColor: 'rgba(50, 40, 70, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ 
                opacity: 0.8, 
                fontSize: '12px',
                fontFamily: EPIC_THEME.typography.subtitle,
                letterSpacing: '0.5px',
              }}>
                {DISPLAY_NAMES[attr]}
              </div>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '22px', 
                color: EPIC_THEME.colors.accent,
                fontFamily: EPIC_THEME.typography.heading,
                marginTop: '4px',
              }}>
                {attributes[attr]}
              </div>
            </div>
          ))}
        </div>
      </EpicCard>

      {/* Botones de navegación — responsive: 2×2 → 1 columna en móvil */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '14px',
        marginBottom: '24px',
      }}>
        {[
          { key: 'missions', label: 'MISIONES' },
          { key: 'inventory', label: 'INVENTARIO' },
          { key: 'titles', label: 'TÍTULOS' },
          { key: 'pets', label: 'MASCOTAS' },
        ].map(btn => (
          <EpicButton
            key={btn.key}
            onClick={() => setModal(btn.key as any)}
            variant="default"
            style={{ 
              padding: '14px 12px',
              minHeight: '60px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <span>{btn.label}</span>
          </EpicButton>
        ))}
      </div>

      {/* ===== MODALES — ya responsivos por EpicModalFrame ===== */}
      {modal === 'missions' && (
        <EpicModalFrame title="MISIONES" onClose={() => setModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(['exercise', 'mind', 'health', 'productivity'] as const).map(category => {
              const missions = dailyMissions[category];
              if (!missions || missions.length === 0) return null;
              return missions.map((habit) => {
                const today = new Date().toISOString().split('T')[0];
                const isCompleted = habit.lastCompleted === today;
                return (
                  <div key={habit.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    backgroundColor: EPIC_THEME.colors.bgCard,
                    borderRadius: '10px',
                    border: `1px solid ${isCompleted ? 'rgba(76, 175, 80, 0.4)' : 'rgba(120, 100, 150, 0.3)'}`,
                    boxShadow: isCompleted 
                      ? '0 0 16px rgba(76, 175, 80, 0.4), inset 0 0 12px rgba(76, 175, 80, 0.1)'
                      : EPIC_THEME.shadows.card,
                    transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {isCompleted && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.15), transparent)',
                        animation: 'shimmer 2.5s infinite',
                        zIndex: 0,
                      }}></div>
                    )}
                    <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                      <div style={{ 
                        fontFamily: EPIC_THEME.typography.subtitle,
                        fontWeight: '700', 
                        fontSize: 'clamp(18px, 4.2vw, 22px)',
                        marginBottom: '6px',
                        color: isCompleted ? 'rgba(200, 200, 200, 0.6)' : '#FFFFFF',
                        letterSpacing: '0.8px',
                        textShadow: isCompleted ? 'none' : `0 0 4px ${EPIC_THEME.colors.accentGlow}`,
                        textDecoration: isCompleted ? 'line-through' : 'none',
                      }}>
                        {habit.name}
                      </div>
                      <div style={{ 
                        fontSize: 'clamp(13px, 2.6vw, 15px)', 
                        color: isCompleted ? 'rgba(76, 175, 80, 0.7)' : '#D8B4FE',
                        fontWeight: '600',
                        fontFamily: EPIC_THEME.typography.subtitle,
                        letterSpacing: '1.2px',
                      }}>
                        [{XP_BY_DIFFICULTY[habit.difficulty]} XP]
                      </div>
                    </div>
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      disabled={isCompleted}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        border: `2px solid ${isCompleted ? '#4CAF50' : 'rgba(120, 100, 150, 0.6)'}`,
                        backgroundColor: isCompleted ? 'rgba(76, 175, 80, 0.35)' : 'rgba(40, 30, 60, 0.7)',
                        cursor: isCompleted ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isCompleted ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        boxShadow: isCompleted 
                          ? '0 0 16px rgba(76, 175, 80, 0.7), inset 0 0 10px rgba(76, 175, 80, 0.4)'
                          : '0 2px 6px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      {isCompleted ? '✓' : '○'}
                    </button>
                  </div>
                );
              });
            })}
          </div>
          <div style={{
            marginTop: '28px',
            padding: '14px 20px',
            fontSize: 'clamp(13px, 2.6vw, 15px)',
            lineHeight: 1.5,
            fontFamily: EPIC_THEME.typography.subtitle,
            letterSpacing: '0.8px',
            textAlign: 'left',
            borderRadius: '8px',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            background: 'rgba(30, 15, 25, 0.4)',
          }}>
            <span style={{ 
              color: '#FF6B6B',
              fontWeight: '800',
              textShadow: `0 0 8px rgba(255, 107, 107, 0.7)`,
              letterSpacing: '1.2px',
              fontFamily: EPIC_THEME.typography.heading,
            }}>
              ADVERTENCIA:
            </span>
            <span style={{ 
              color: '#FFB3B3',
              marginLeft: '8px',
            }}>
              No completar las misiones diarias puede resultar en penalizaciones de XP y estado.
            </span>
          </div>
        </EpicModalFrame>
      )}

      {modal === 'inventory' && (
        <EpicModalFrame title="INVENTARIO" onClose={() => setModal(null)}>
          <EpicButton
            onClick={() => setShowAddItem(!showAddItem)}
            variant="primary"
            style={{ width: '100%', marginBottom: '20px', padding: '12px' }}
          >
            {showAddItem ? 'CANCELAR' : 'AÑADIR ITEM'}
          </EpicButton>

          {showAddItem && (
            <EpicCard style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Nombre"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '12px',
                  backgroundColor: EPIC_THEME.colors.bgPrimary,
                  border: `1px solid ${EPIC_THEME.colors.accent}`,
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: 'clamp(14px, 2.8vw, 15px)',
                  fontFamily: EPIC_THEME.typography.body,
                }}
              />
              <textarea
                placeholder="Descripción"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '12px',
                  backgroundColor: EPIC_THEME.colors.bgPrimary,
                  border: `1px solid ${EPIC_THEME.colors.accent}`,
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: 'clamp(13px, 2.6vw, 14px)',
                  minHeight: '50px',
                  fontFamily: EPIC_THEME.typography.body,
                  resize: 'vertical',
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '12px' }}>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value as ItemCategory})}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: EPIC_THEME.colors.bgPrimary,
                    border: `1px solid ${EPIC_THEME.colors.accent}`,
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: 'clamp(13px, 2.6vw, 14px)',
                    fontFamily: EPIC_THEME.typography.body,
                    appearance: 'none',
                  }}
                >
                  {Object.entries(ITEM_CATEGORY_NAMES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <select
                  value={newItem.rarity}
                  onChange={(e) => setNewItem({...newItem, rarity: e.target.value as ItemRarity})}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: EPIC_THEME.colors.bgPrimary,
                    border: `1px solid ${EPIC_THEME.colors.accent}`,
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: 'clamp(13px, 2.6vw, 14px)',
                    fontFamily: EPIC_THEME.typography.body,
                    appearance: 'none',
                  }}
                >
                  {Object.entries(RARITY_NAMES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <EpicButton
                onClick={handleAddItem}
                variant="primary"
                style={{ width: '100%' }}
              >
                GUARDAR
              </EpicButton>
            </EpicCard>
          )}

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px', 
            marginBottom: '20px',
            justifyContent: 'center',
          }}>
            {(['all', ...Object.keys(ITEM_CATEGORY_NAMES)] as const).map(cat => (
              <EpicButton
                key={cat}
                onClick={() => setFilterCategory(cat === 'all' ? 'all' : cat as ItemCategory)}
                variant={filterCategory === cat ? 'primary' : 'secondary'}
                style={{ 
                  padding: '6px 14px', 
                  fontSize: 'clamp(12px, 2.4vw, 13px)',
                  fontFamily: EPIC_THEME.typography.subtitle,
                }}
              >
                {cat === 'all' ? 'TODOS' : ITEM_CATEGORY_NAMES[cat as ItemCategory]}
              </EpicButton>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '30px 16px',
              color: EPIC_THEME.colors.accentLight,
              fontSize: 'clamp(16px, 3.6vw, 18px)',
              opacity: 0.7,
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              Inventario vacío.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredItems.map(item => (
                <EpicCard key={item.id} style={{
                  border: `2px solid ${RARITY_COLORS[item.rarity]}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {item.rarity !== 'normal' && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, transparent, ${RARITY_COLORS[item.rarity]}, transparent)`,
                    }}></div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 'bold',
                        fontSize: 'clamp(16px, 3.6vw, 19px)',
                        color: '#D8B4FE',
                        marginBottom: '6px',
                        fontFamily: EPIC_THEME.typography.heading,
                      }}>
                        {item.name}
                      </div>
                      <div style={{
                        fontSize: 'clamp(12px, 2.4vw, 14px)',
                        color: RARITY_COLORS[item.rarity],
                        marginBottom: '8px',
                        fontFamily: EPIC_THEME.typography.subtitle,
                        letterSpacing: '0.8px',
                      }}>
                        {RARITY_NAMES[item.rarity]} • {ITEM_CATEGORY_NAMES[item.category]}
                      </div>
                      {item.description && (
                        <div style={{
                          fontSize: 'clamp(13px, 2.6vw, 15px)',
                          opacity: 0.88,
                          marginBottom: '10px',
                          lineHeight: 1.5,
                        }}>
                          {item.description}
                        </div>
                      )}
                      <div style={{
                        fontSize: 'clamp(11px, 2.2vw, 12px)',
                        opacity: 0.6,
                        fontFamily: EPIC_THEME.typography.subtitle,
                      }}>
                        {new Date(item.dateAcquired).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <EpicButton
                      onClick={() => removeItem(item.id)}
                      variant="danger"
                      aria-label={`Eliminar ${item.name}`}
                      style={{ 
                        minWidth: '80px',
                        padding: '6px 10px',
                        fontSize: 'clamp(11px, 2.2vw, 12px)',
                      }}
                    >
                      ELIMINAR
                    </EpicButton>
                  </div>
                </EpicCard>
              ))}
            </div>
          )}
        </EpicModalFrame>
      )}

      {modal === 'profile' && (
        <EpicModalFrame title="PERFIL" onClose={() => setModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {[
              { label: 'Nombre', key: 'name', type: 'text' },
              { label: 'Edad', key: 'age', type: 'number' },
              { label: 'Título', key: 'title', type: 'select' },
            ].map(field => (
              <div key={field.key}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: 'clamp(13px, 2.6vw, 15px)',
                  opacity: 0.9,
                  fontFamily: EPIC_THEME.typography.subtitle,
                }}>
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={editProfile.title}
                    onChange={(e) => setEditProfile({ ...editProfile, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: EPIC_THEME.colors.bgPrimary,
                      border: `1px solid ${EPIC_THEME.colors.accent}`,
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: 'clamp(14px, 2.8vw, 16px)',
                      fontFamily: EPIC_THEME.typography.body,
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23B18CFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                      paddingRight: '30px',
                    }}
                  >
                    {AVAILABLE_TITLES.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={editProfile[field.key as keyof typeof editProfile] as string}
                    onChange={(e) => {
                      const val = field.type === 'number' 
                        ? parseInt(e.target.value) || 0 
                        : e.target.value;
                      setEditProfile({ ...editProfile, [field.key]: val });
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: EPIC_THEME.colors.bgPrimary,
                      border: `1px solid ${EPIC_THEME.colors.accent}`,
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: 'clamp(14px, 2.8vw, 16px)',
                      fontFamily: EPIC_THEME.typography.body,
                    }}
                  />
                )}
              </div>
            ))}
            <EpicButton
              onClick={handleSaveProfile}
              variant="primary"
              style={{ width: '100%', padding: '14px', marginTop: '8px' }}
            >
              GUARDAR
            </EpicButton>
          </div>
        </EpicModalFrame>
      )}

      {modal === 'titles' && (
        <EpicModalFrame title="TÍTULOS" onClose={() => setModal(null)}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(16px, 3.6vw, 18px)', opacity: 0.9, marginBottom: '12px' }}>
              Equipa un título para mostrar tu progreso.
            </div>
            <div style={{ 
              backgroundColor: EPIC_THEME.colors.bgCard,
              borderRadius: '8px',
              padding: '14px',
              border: `1px solid ${EPIC_THEME.colors.accentGlow}`,
              display: 'inline-block',
            }}>
              <div style={{ fontSize: 'clamp(12px, 2.4vw, 14px)', opacity: 0.7, marginBottom: '6px' }}>Actual:</div>
              <div style={{ 
                fontSize: 'clamp(20px, 4.5vw, 22px)',
                fontFamily: EPIC_THEME.typography.heading,
                color: EPIC_THEME.colors.accent,
                letterSpacing: '1px',
              }}>
                {getTitleName(currentTitleId)}
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '14px',
          }}>
            {AVAILABLE_TITLES.map(t => (
              <button
                key={t.id}
                onClick={() => updateProfile({ name, age, title: t.id })}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                <EpicCard 
                  style={{
                    border: t.id === currentTitleId 
                      ? `2px solid ${EPIC_THEME.colors.accent}` 
                      : `1px solid rgba(120, 100, 150, 0.4)`,
                    boxShadow: t.id === currentTitleId 
                      ? `0 0 16px ${EPIC_THEME.colors.accentGlow}, ${EPIC_THEME.shadows.card}` 
                      : EPIC_THEME.shadows.card,
                    backgroundColor: t.id === currentTitleId 
                      ? 'rgba(40, 30, 60, 0.8)' 
                      : EPIC_THEME.colors.bgCard,
                  }}
                >
                  <div style={{ 
                    fontWeight: 'bold',
                    fontSize: 'clamp(16px, 3.6vw, 18px)',
                    color: t.id === currentTitleId ? EPIC_THEME.colors.accent : EPIC_THEME.colors.accentLight,
                    marginBottom: '6px',
                    fontFamily: EPIC_THEME.typography.heading,
                  }}>
                    {t.name}
                  </div>
                  <div style={{ 
                    fontSize: 'clamp(11px, 2.2vw, 13px)', 
                    opacity: 0.7, 
                    fontFamily: EPIC_THEME.typography.subtitle,
                  }}>
                    {t.id === 'none' ? '—' : 
                     t.id === 'novato' ? 'Crear cuenta' :
                     t.id === 'diligente' ? '7 días' :
                     t.id === 'disciplinado' ? '30 días' :
                     t.id === 'maestro' ? '100 días' :
                     'Legendario'}
                  </div>
                </EpicCard>
              </button>
            ))}
          </div>
        </EpicModalFrame>
      )}

      {modal === 'pets' && (
        <EpicModalFrame title="MASCOTAS" onClose={() => setModal(null)}>
          <div style={{
            fontSize: 'clamp(16px, 3.6vw, 18px)',
            fontFamily: EPIC_THEME.typography.subtitle,
            opacity: 0.8,
            lineHeight: 1.6,
            textAlign: 'center',
          }}>
            Próximamente: mascotas legendarias que aumentan tus atributos.
            <div style={{ marginTop: '20px', fontStyle: 'italic' }}>
              Sistema en desarrollo. ¡Próxima actualización!
            </div>
          </div>
        </EpicModalFrame>
      )}
    </div>
  );
}