import { useState, useEffect, memo } from 'react';
import { EpicModalFrame, EpicButton } from '../ui';
import { EPIC_THEME } from '../../constants/constants';

interface ProfileModalProps {
  initial: { name: string; age: number; title: string; bio: string };
  onClose: () => void;
  onSave: (v: { name: string; age: number; title: string; bio: string }) => void;
  stats: { streak: number; successRate: number; fractal: number; xyn: number };
  titles: { id: string; name: string }[];
}

export const ProfileModal = memo(function ProfileModal({
  initial,
  onClose,
  onSave,
  stats,
  titles,
}: ProfileModalProps) {
  const [local, setLocal] = useState(initial);
  
  useEffect(() => {
    setLocal(initial);
  }, [initial]);

  return (
    <EpicModalFrame title="PERFIL" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '12px',
          padding: '16px',
          backgroundColor: 'rgba(177, 140, 255, 0.05)',
          border: `1px solid ${EPIC_THEME.colors.accent}`,
          borderRadius: '8px',
        }}>
          {/* Racha */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'clamp(11px, 2.2vw, 12px)',
              opacity: 0.7,
              marginBottom: '4px',
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              RACHA
            </div>
            <div style={{
              fontSize: 'clamp(20px, 4.5vw, 24px)',
              fontWeight: 'bold',
              color: EPIC_THEME.colors.accent,
              fontFamily: EPIC_THEME.typography.heading,
            }}>
              {stats.streak}
            </div>
            <div style={{
              fontSize: 'clamp(10px, 2vw, 11px)',
              opacity: 0.6,
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              días
            </div>
          </div>
          
          {/* Tasa Cumplimiento */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'clamp(12px, 2.4vw, 14px)',
              opacity: 0.7,
              marginBottom: '4px',
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              ÉXITO
            </div>
            <div style={{
              fontSize: 'clamp(24px, 5vw, 32px)',
              fontWeight: 'bold',
              color: stats.successRate >= 80 ? '#4CAF50' : stats.successRate >= 50 ? '#FF9800' : '#FF5252',
              fontFamily: EPIC_THEME.typography.heading,
            }}>
              {stats.successRate}%
            </div>
            <div style={{
              fontSize: 'clamp(11px, 2.2vw, 12px)',
              opacity: 0.6,
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              tasa de cumplimiento
            </div>
          </div>
          
          {/* Fractal */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'clamp(11px, 2.2vw, 12px)',
              opacity: 0.7,
              marginBottom: '4px',
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              FRACTAL
            </div>
            <div style={{
              fontSize: 'clamp(20px, 4.5vw, 24px)',
              fontWeight: 'bold',
              color: '#64B5F6',
              fontFamily: EPIC_THEME.typography.heading,
            }}>
              {stats.fractal}
            </div>
            <div style={{
              fontSize: 'clamp(10px, 2vw, 11px)',
              opacity: 0.6,
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              TRGL
            </div>
          </div>
          
          {/* Xyn */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'clamp(11px, 2.2vw, 12px)',
              opacity: 0.7,
              marginBottom: '4px',
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              Xyn
            </div>
            <div style={{
              fontSize: 'clamp(20px, 4.5vw, 24px)',
              fontWeight: 'bold',
              color: '#FFD700',
              fontFamily: EPIC_THEME.typography.heading,
              textShadow: '0 0 8px rgba(255, 215, 0, 0.7)',
            }}>
              {stats.xyn}
            </div>
            <div style={{
              fontSize: 'clamp(10px, 2vw, 11px)',
              opacity: 0.6,
              fontFamily: EPIC_THEME.typography.subtitle,
            }}>
              XYN
            </div>
          </div>
        </div>
        
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: 'clamp(13px, 2.6vw, 15px)',
            opacity: 0.9,
            fontFamily: EPIC_THEME.typography.subtitle,
          }}>
            Nombre
          </label>
          <input
            type="text"
            value={local.name}
            onChange={(e) => setLocal(prev => ({ ...prev, name: e.target.value }))}
            style={{
              width: '100%',
              padding: '10px 12px',
              margin: 0,
              boxSizing: 'border-box',
              backgroundColor: EPIC_THEME.colors.bgPrimary,
              border: `1px solid ${EPIC_THEME.colors.accent}`,
              borderRadius: '8px',
              color: 'white',
              fontSize: 'clamp(14px, 2.8vw, 16px)',
              fontFamily: EPIC_THEME.typography.body,
            }}
          />
        </div>
        
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: 'clamp(13px, 2.6vw, 15px)',
            opacity: 0.9,
            fontFamily: EPIC_THEME.typography.subtitle,
          }}>
            Edad
          </label>
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
            style={{
              width: '100%',
              padding: '10px 12px',
              margin: 0,
              boxSizing: 'border-box',
              backgroundColor: EPIC_THEME.colors.bgPrimary,
              border: `1px solid ${EPIC_THEME.colors.accent}`,
              borderRadius: '8px',
              color: 'white',
              fontSize: 'clamp(14px, 2.8vw, 16px)',
              fontFamily: EPIC_THEME.typography.body,
            }}
          />
        </div>
        
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: 'clamp(13px, 2.6vw, 15px)',
            opacity: 0.9,
            fontFamily: EPIC_THEME.typography.subtitle,
          }}>
            Título
          </label>
          <select
            value={local.title}
            onChange={(e) => setLocal(prev => ({ ...prev, title: e.target.value }))}
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
            <option value="">Seleccionar...</option>
            {titles.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: 'clamp(13px, 2.6vw, 15px)',
            opacity: 0.9,
            fontFamily: EPIC_THEME.typography.subtitle,
          }}>
            Biografía
          </label>
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
              borderRadius: '8px',
              color: 'white',
              fontSize: 'clamp(14px, 2.8vw, 16px)',
              fontFamily: EPIC_THEME.typography.body,
              minHeight: '100px',
              resize: 'vertical',
            }}
          />
          <div style={{
            fontSize: 'clamp(11px, 2.2vw, 12px)',
            opacity: 0.6,
            marginTop: '4px',
            textAlign: 'right',
          }}>
            {local.bio.length}/300
          </div>
        </div>
        
        <EpicButton onClick={() => onSave(local)} variant="primary" style={{ width: '100%' }}>
          GUARDAR
        </EpicButton>
      </div>
    </EpicModalFrame>
  );
});

