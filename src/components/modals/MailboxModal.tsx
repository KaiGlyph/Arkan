import { useState } from 'react';
import { EpicModalFrame, EpicCard, EpicButton } from '../ui';
import { EPIC_THEME, DISPLAY_NAMES } from '../../constants/constants';
import type { StatReward, StatName } from '../../types';

interface MailboxModalProps {
  pendingRewards: StatReward[];
  onClaimReward: (rewardId: string, assignedStats?: Partial<Record<StatName, number>>) => void;
  onClose: () => void;
}


export function MailboxModal({ pendingRewards, onClaimReward, onClose }: MailboxModalProps) {
  const [assigningPoints, setAssigningPoints] = useState<{ rewardId: string; points: number } | null>(null);
  const [pointAssignment, setPointAssignment] = useState<Partial<Record<StatName, number>>>({});

  const handleClose = () => {
    setAssigningPoints(null);
    setPointAssignment({});
    onClose();
  };

  return (
    <EpicModalFrame title="BUZÓN" onClose={handleClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {pendingRewards.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 16px',
            color: EPIC_THEME.colors.accentLight,
            fontSize: 'clamp(16px, 3.6vw, 18px)',
            opacity: 0.7,
            fontFamily: EPIC_THEME.typography.subtitle,
          }}>
            No tienes recompensas pendientes.
          </div>
        ) : (
          pendingRewards.map(reward => {
            const isPointsReward = reward.type === 'dailyMissions' && reward.stats.points;
            const isAssigning = assigningPoints?.rewardId === reward.id;
            return (
              <EpicCard key={reward.id} style={{ border: `2px solid ${isPointsReward ? '#FFD700' : EPIC_THEME.colors.accent}` }}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: 'clamp(18px, 4.2vw, 22px)',
                    color: EPIC_THEME.colors.accentLight,
                    marginBottom: '8px',
                    fontFamily: EPIC_THEME.typography.heading,
                  }}>
                    {reward.description}
                  </div>
                  <div style={{
                    fontSize: 'clamp(13px, 2.6vw, 15px)',
                    color: '#D8B4FE',
                    opacity: 0.8,
                    fontFamily: EPIC_THEME.typography.subtitle,
                  }}>
                    {isPointsReward
                      ? `Recompensa: ${reward.stats.points} puntos asignables`
                      : Object.entries(reward.stats)
                          .filter(([key]) => key !== 'points')
                          .map(([stat, value]) => `${DISPLAY_NAMES[stat as StatName]}: +${value}`)
                          .join(', ')}
                  </div>
                </div>
                
                {isPointsReward && !isAssigning && (
                  <EpicButton
                    onClick={() => {
                      setAssigningPoints({ rewardId: reward.id, points: reward.stats.points || 0 });
                      setPointAssignment({});
                    }}
                    variant="primary"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    ASIGNAR PUNTOS
                  </EpicButton>
                )}
                
                {isPointsReward && isAssigning && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                      fontSize: 'clamp(13px, 2.6vw, 15px)',
                      color: EPIC_THEME.colors.accentLight,
                      fontFamily: EPIC_THEME.typography.subtitle,
                      textAlign: 'center',
                      padding: '8px 12px',
                      borderRadius: '8px',
                    }}>
                      Asigna {reward.stats.points} puntos a las estadísticas que desees:
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '16px',
                      alignItems: 'start',
                    }}>
                      {(['fuerza', 'agilidad', 'vitalidad', 'inteligencia', 'percepcion', 'sense'] as StatName[]).map(stat => (
                        <div key={stat} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{
                            fontSize: 'clamp(12px, 2.4vw, 14px)',
                            color: EPIC_THEME.colors.accentLight,
                            fontFamily: EPIC_THEME.typography.subtitle,
                            fontWeight: 600,
                            paddingLeft: '4px',
                          }}>
                            {DISPLAY_NAMES[stat]}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={reward.stats.points || 0}
                            value={pointAssignment[stat] || 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const currentTotal = Object.values(pointAssignment).reduce((sum, v) => sum + (v || 0), 0);
                              const remaining = (reward.stats.points || 0) - currentTotal + (pointAssignment[stat] || 0);
                              if (val <= remaining && val >= 0) {
                                setPointAssignment({ ...pointAssignment, [stat]: val });
                              }
                            }}
                            style={{
                              width: '100%',
                              padding: '12px',
                              backgroundColor: EPIC_THEME.colors.bgPrimary,
                              border: `2px solid ${EPIC_THEME.colors.accent}`,
                              borderRadius: '8px',
                              color: 'white',
                              fontSize: 'clamp(16px, 3.2vw, 18px)',
                              fontFamily: EPIC_THEME.typography.body,
                              fontWeight: 'bold',
                              textAlign: 'center',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{
                      fontSize: 'clamp(14px, 2.8vw, 16px)',
                      color: EPIC_THEME.colors.accent,
                      textAlign: 'center',
                      fontFamily: EPIC_THEME.typography.heading,
                      fontWeight: 'bold',
                      padding: '12px',
                      borderRadius: '8px',
                    }}>
                      Puntos restantes: {(reward.stats.points || 0) - Object.values(pointAssignment).reduce((sum, v) => sum + (v || 0), 0)}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <EpicButton
                        onClick={() => {
                          const total = Object.values(pointAssignment).reduce((sum, v) => sum + (v || 0), 0);
                          if (total === (reward.stats.points || 0)) {
                            onClaimReward(reward.id, pointAssignment);
                            setAssigningPoints(null);
                            setPointAssignment({});
                          }
                        }}
                        variant="primary"
                        style={{ flex: 1, padding: '14px' }}
                        disabled={Object.values(pointAssignment).reduce((sum, v) => sum + (v || 0), 0) !== (reward.stats.points || 0)}
                      >
                        CONFIRMAR
                      </EpicButton>
                      <EpicButton
                        onClick={() => {
                          setAssigningPoints(null);
                          setPointAssignment({});
                        }}
                        variant="secondary"
                        style={{ flex: 1, padding: '14px' }}
                      >
                        CANCELAR
                      </EpicButton>
                    </div>
                  </div>
                )}
                
                {!isPointsReward && (
                  <EpicButton
                    onClick={() => onClaimReward(reward.id)}
                    variant="primary"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    RECLAMAR
                  </EpicButton>
                )}
              </EpicCard>
            );
          })
        )}
      </div>
    </EpicModalFrame>
  );
}

