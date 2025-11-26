import { useEffect } from 'react';
import { useHabits } from '../hooks/useHabits';
import type { HabitCategory } from '../types';

export default function HUD() {
  const {
    level,
    xpProgress,
    xpNeeded,
    progressPercent,
    habits,
    dailyMissions, 
    toggleHabit,
  } = useHabits();

  const today = new Date().toISOString().split('T')[0];

  // Mapeo rápido de dificultad → XP (coherente con useHabits.ts)
  const getXPForHabit = (difficulty: 'easy' | 'medium' | 'hard'): number => {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 25;
      case 'hard': return 50;
      default: return 10;
    }
  };

  // ✅ Notificaciones (recordatorio + permiso)
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
      const pending = habits.filter(
        (h) => !h.lastCompleted || h.lastCompleted !== today
      );
      if (pending.length > 0) {
        sendNotification('⚔️ Arkan Protocol', `Tienes ${pending.length} hábito(s) pendientes`);
      }
    };

    requestPermission();
    const interval = setInterval(checkPending, 60000); // cada minuto
    return () => clearInterval(interval);
  }, [habits, today]);

  // Nombres amigables por categoría
  const categoryNameMap: Record<HabitCategory, string> = {
    exercise: 'Ejercicio',
    mind: 'Mente',
    health: 'Salud',
    productivity: 'Productividad',
  };

  return (
    <div style={{
      backgroundColor: '#25153A',
      color: '#FFFFFF',
      fontFamily: "'Inter', sans-serif",
      padding: '16px',
      minHeight: '100vh',
      boxSizing: 'border-box',
      fontSize: '16px',
      lineHeight: 1.5,
    }}>
      {/* Logo Arkan */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img 
            src="Arkan-Logo.png" 
            alt="Arkan Protocol" 
            style={{ 
              width: '100%', 
              height: 'auto',
              maxWidth: '64px',
              filter: 'drop-shadow(0 0 8px rgba(177, 140, 255, 0.4))',
            }} 
          />
        </div>
        <div style={{
          fontWeight: 'bold',
          fontSize: '22px',
          letterSpacing: '1px',
          fontFamily: "'Orbitron', sans-serif",
          color: '#D8B4FE',
        }}>
          ARKAN
        </div>
      </div>

      {/* Nivel y XP */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontWeight: 'bold' }}>LEVEL {level}</div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          XP: {xpProgress} / {xpNeeded}
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#4A3A6B',
          borderRadius: '4px',
          marginTop: '6px',
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: '#B18CFF',
            borderRadius: '4px',
            transition: 'width 0.3s ease',
          }}></div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ 
        textAlign: 'right', 
        marginBottom: '20px',
        fontWeight: 'bold',
        fontSize: '15px',
      }}>
        Fuerza:    {level * 2}<br />
        Sabiduría: {Math.floor(level * 1.5)}<br />
        Resistencia: {level + 5}
      </div>

      {/* 🎯 Misiones por categoría */}
      {(['exercise', 'mind', 'health', 'productivity'] as const).map(category => {
        const mission = dailyMissions[category];
        const categoryHabits = habits.filter(h => h.category === category);
        const completedCount = categoryHabits.filter(h => 
          h.lastCompleted === today
        ).length;

        // Solo mostrar categoría si tiene hábitos
        if (categoryHabits.length === 0) return null;

        return (
          <div key={category} style={{ marginBottom: '24px' }}>
            <div style={{
              fontWeight: 'bold',
              fontSize: '18px',
              color: mission ? '#B18CFF' : '#888',
              marginBottom: '12px',
            }}>
              {categoryNameMap[category]} 
              <span style={{ fontSize: '14px', fontWeight: 'normal', opacity: 0.7 }}>
                {' '}({completedCount}/{categoryHabits.length})
              </span>
            </div>

            {/* Misión diaria (si existe) */}
            {mission && (
              <div style={{
                marginBottom: '12px',
                padding: '14px',
                backgroundColor: '#33244A',
                borderRadius: '10px',
                border: '1px solid #B18CFF',
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  opacity: 0.8,
                  marginBottom: '6px',
                }}>
                 Misión diaria
                </div>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={mission.lastCompleted === today}
                    onChange={() => toggleHabit(mission.id)}
                    style={{
                      marginRight: '12px',
                      width: '22px',
                      height: '22px',
                      accentColor: '#B18CFF',
                    }}
                  />
                  <span style={{ fontWeight: 'bold' }}>{mission.name}</span>
                  <span style={{
                    marginLeft: 'auto',
                    color: '#D8B4FE',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    fontFamily: "'Orbitron', sans-serif",
                  }}>
                    +{getXPForHabit(mission.difficulty)} XP
                  </span>
                </label>
              </div>
            )}

            {/* Otros hábitos de la categoría (no misiones) */}
            {categoryHabits
              .filter(h => h.id !== mission?.id)
              .map(habit => {
                const completedToday = habit.lastCompleted === today;
                return (
                  <label
                    key={habit.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#2B1E3A',
                      borderRadius: '8px',
                      marginBottom: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={completedToday}
                      onChange={() => toggleHabit(habit.id)}
                      style={{
                        marginRight: '10px',
                        width: '20px',
                        height: '20px',
                        accentColor: '#6A558C',
                      }}
                    />
                    <span>{habit.name}</span>
                    <span style={{
                      marginLeft: 'auto',
                      color: '#8A7DBF',
                      fontSize: '13px',
                    }}>
                      +{getXPForHabit(habit.difficulty)} XP
                    </span>
                  </label>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}