import { EpicModalFrame } from '../ui';
import { EPIC_THEME, XP_BY_DIFFICULTY } from '../../constants/constants';
import type { HabitCategory, Habit } from '../../types';

interface MissionsModalProps {
  dailyMissions: Record<HabitCategory, Habit[] | null>;
  onToggleHabit: (habitId: string) => void;
  onClose: () => void;
}

export function MissionsModal({ dailyMissions, onToggleHabit, onClose }: MissionsModalProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <EpicModalFrame title="MISIONES" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {(['exercise', 'mobility', 'health', 'mind', 'productivity', 'discipline'] as const).map(category => {
          const missions = dailyMissions[category];
          if (!missions || missions.length === 0) return null;
          return missions.map((habit) => {
            const isCompleted = habit.lastCompleted === today;
            return (
              <div key={habit.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                backgroundColor: 'rgba(15, 10, 25, 0.8)',
                borderRadius: '0px',
                border: `2px solid ${isCompleted ? 'rgba(76, 175, 80, 0.6)' : EPIC_THEME.colors.accent}`,
                boxShadow: isCompleted
                  ? '0 0 16px rgba(76, 175, 80, 0.4), inset 0 0 12px rgba(76, 175, 80, 0.1)'
                  : `0 0 25px ${EPIC_THEME.colors.accentGlow}, inset 0 0 30px rgba(177, 140, 255, 0.1)`,
                transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                position: 'relative',
                overflow: 'visible',
              }}>
                {/* Esquinas angulares para cada misión - igual que EpicCard */}
                {[
                  { top: '-4px', left: '-4px', width: '24px', height: '3px', bg: isCompleted ? '#4CAF50' : EPIC_THEME.colors.accent },
                  { top: '-4px', left: '-4px', width: '3px', height: '24px', bg: isCompleted ? '#4CAF50' : EPIC_THEME.colors.accent },
                  { top: '-4px', right: '-4px', width: '24px', height: '3px', bg: isCompleted ? '#4CAF50' : EPIC_THEME.colors.accent },
                  { top: '-4px', right: '-4px', width: '3px', height: '24px', bg: isCompleted ? '#4CAF50' : EPIC_THEME.colors.accent },
                  { bottom: '-4px', left: '-4px', width: '24px', height: '3px', bg: isCompleted ? '#4CAF50' : EPIC_THEME.colors.accent },
                  { bottom: '-4px', left: '-4px', width: '3px', height: '24px', bg: isCompleted ? '#4CAF50' : EPIC_THEME.colors.accent },
                  { bottom: '-4px', right: '-4px', width: '24px', height: '3px', bg: isCompleted ? '#4CAF50' : EPIC_THEME.colors.accent },
                  { bottom: '-4px', right: '-4px', width: '3px', height: '24px', bg: isCompleted ? '#4CAF50' : EPIC_THEME.colors.accent },
                ].map((line, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    ...line,
                    background: line.bg,
                    boxShadow: `0 0 8px ${line.bg}`,
                    zIndex: 10,
                  }}></div>
                ))}
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
                  onClick={() => onToggleHabit(habit.id)}
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
      
      {/* Advertencia con esquinas angulares */}
      <div style={{
        marginTop: '28px',
        padding: '20px 24px',
        fontSize: 'clamp(13px, 2.6vw, 15px)',
        lineHeight: 1.6,
        fontFamily: EPIC_THEME.typography.subtitle,
        letterSpacing: '0.8px',
        textAlign: 'left',
        borderRadius: '0px',
        border: '2px solid rgba(255, 107, 107, 0.7)',
        background: 'rgba(30, 10, 15, 0.8)',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(255, 107, 107, 0.4), inset 0 0 25px rgba(255, 107, 107, 0.1)',
      }}>
        {/* Esquinas angulares tipo Solo Leveling para la advertencia */}
        {[
          { top: '-4px', left: '-4px', width: '24px', height: '3px', bg: '#FF6B6B' },
          { top: '-4px', left: '-4px', width: '3px', height: '24px', bg: '#FF6B6B' },
          { top: '-4px', right: '-4px', width: '24px', height: '3px', bg: '#FF6B6B' },
          { top: '-4px', right: '-4px', width: '3px', height: '24px', bg: '#FF6B6B' },
          { bottom: '-4px', left: '-4px', width: '24px', height: '3px', bg: '#FF6B6B' },
          { bottom: '-4px', left: '-4px', width: '3px', height: '24px', bg: '#FF6B6B' },
          { bottom: '-4px', right: '-4px', width: '24px', height: '3px', bg: '#FF6B6B' },
          { bottom: '-4px', right: '-4px', width: '3px', height: '24px', bg: '#FF6B6B' },
        ].map((line, i) => (
          <div key={i} style={{
            position: 'absolute',
            ...line,
            background: line.bg,
            boxShadow: '0 0 8px #FF6B6B',
            zIndex: 15,
          }}></div>
        ))}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          alignItems: 'baseline',
          position: 'relative',
          zIndex: 2,
        }}>
          <span style={{
            color: '#FF6B6B',
            fontWeight: '800',
            textShadow: `0 0 10px rgba(255, 107, 107, 0.8)`,
            letterSpacing: '1.2px',
            fontFamily: EPIC_THEME.typography.heading,
            whiteSpace: 'nowrap',
          }}>
            ADVERTENCIA:
          </span>
          <span style={{
            color: '#FFB3B3',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            flex: '1',
            minWidth: '200px',
          }}>
            No completar las misiones diarias puede resultar en penalizaciones de XP y estado.
          </span>
        </div>
      </div>
    </EpicModalFrame>
  );
}

