import { memo } from 'react';
import { EPIC_THEME } from '../../constants/constants';

interface EpicCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  [key: string]: any;
}

export const EpicCard = memo(function EpicCard({ 
  children, 
  style = {}, 
  onClick,
  ...rest 
}: EpicCardProps) {
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
      {/* Esquinas angulares tipo Solo Leveling */}
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
        <div 
          key={i} 
          style={{ 
            position: 'absolute', 
            ...line, 
            background: line.bg, 
            boxShadow: '0 0 8px #B18CFF', 
            zIndex: 15 
          }} 
        />
      ))}
      {children}
    </div>
  );
});

