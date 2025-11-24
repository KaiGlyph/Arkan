import React from 'react';
import { useHabits } from '../hooks/useHabits';

export default function HUD() {
  const {
    level,
    xpProgress,
    xpNeeded,
    progressPercent,
    habits,
    toggleHabit,
  } = useHabits();

  // Mapeo rápido de dificultad → XP (coherente con useHabits.ts)
  const getXPForHabit = (difficulty: 'easy' | 'medium' | 'hard'): number => {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 25;
      case 'hard': return 50;
      default: return 10;
    }
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
      {/* Logo Placeholder */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#FFFFFF',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          overflow: 'hidden',
        }}>
          <span style={{
            color: '#25153A',
            fontWeight: 'bold',
            fontSize: '24px',
            fontFamily: "'Orbitron', sans-serif",
          }}>▲</span>
        </div>
        <div style={{
          fontWeight: 'bold',
          fontSize: '22px',
          letterSpacing: '1px',
          fontFamily: "'Orbitron', sans-serif",
        }}>ARKAN</div>
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
        Fuerza:    10<br />
        Sabiduría: 8<br />
        Resistencia: 12
      </div>

      {/* Hábitos del día */}
      <div>
        <div style={{ 
          fontWeight: 'bold',
          opacity: 0.8,
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '16px',
        }}>
          ▼ Today’s Axioms
          <span style={{ fontSize: '14px', opacity: 0.9 }}>
            {habits.filter(h => 
              h.lastCompleted === new Date().toISOString().split('T')[0]
            ).length}
            /{habits.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {habits.map((habit) => {
            const today = new Date().toISOString().split('T')[0];
            const completedToday = habit.lastCompleted === today;
            // 👇 ✅ CORRECCIÓN: usar tu función segura (no el objeto inline)
            const xpReward = getXPForHabit(habit.difficulty);

            return (
              <label
                key={habit.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px',
                  backgroundColor: '#33244A',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: `1px solid ${completedToday ? '#B18CFF' : 'transparent'}`,
                  transition: 'border 0.2s',
                }}
              >
                <input
                  type="checkbox"
                  checked={completedToday}
                  onChange={() => toggleHabit(habit.id)}
                  style={{
                    marginRight: '12px',
                    width: '22px',
                    height: '22px',
                    accentColor: '#B18CFF',
                  }}
                />
                <span>{habit.name}</span>
                <span style={{
                  marginLeft: 'auto',
                  color: '#D8B4FE',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily: "'Orbitron', sans-serif",
                }}>
                  +{xpReward} XP
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}