import { EPIC_THEME } from '../../constants/constants';

interface EpicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
  style?: React.CSSProperties;
  disabled?: boolean;
  [key: string]: any;
}

export function EpicButton({ 
  children, 
  onClick, 
  variant = 'default', 
  style: customStyle = {}, 
  disabled = false,
  ...props 
}: EpicButtonProps) {
  const baseStyle: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: '0px',
    border: 'none',
    fontWeight: 'bold',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: EPIC_THEME.typography.heading,
    fontSize: 'clamp(14px, 3.2vw, 15px)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'visible',
    opacity: disabled ? 0.5 : 1,
  };

  const variants: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: 'rgba(15, 10, 25, 0.9)',
      color: EPIC_THEME.colors.accentLight,
      border: `2px solid ${EPIC_THEME.colors.accent}`,
      boxShadow: `0 0 15px ${EPIC_THEME.colors.accentGlow}, inset 0 0 20px rgba(177, 140, 255, 0.1)`,
    },
    primary: {
      backgroundColor: EPIC_THEME.colors.accent,
      color: '#0F071A',
      border: `2px solid ${EPIC_THEME.colors.accent}`,
      boxShadow: `0 0 20px ${EPIC_THEME.colors.accentGlow}, inset 0 0 25px rgba(177, 140, 255, 0.3)`,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: EPIC_THEME.colors.accentLight,
      border: `2px solid ${EPIC_THEME.colors.accent}`,
      boxShadow: `0 0 10px ${EPIC_THEME.colors.accentGlow}`,
    },
    danger: {
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
      color: '#FF5252',
      border: '2px solid rgba(244, 67, 54, 0.7)',
      boxShadow: '0 0 15px rgba(244, 67, 54, 0.5)',
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant], ...customStyle }}
      {...props}
    >
      {/* Esquinas angulares para botones */}
      {[
        { top: '-2px', left: '-2px', width: '12px', height: '2px', bg: EPIC_THEME.colors.accent },
        { top: '-2px', left: '-2px', width: '2px', height: '12px', bg: EPIC_THEME.colors.accent },
        { top: '-2px', right: '-2px', width: '12px', height: '2px', bg: EPIC_THEME.colors.accent },
        { top: '-2px', right: '-2px', width: '2px', height: '12px', bg: EPIC_THEME.colors.accent },
        { bottom: '-2px', left: '-2px', width: '12px', height: '2px', bg: EPIC_THEME.colors.accent },
        { bottom: '-2px', left: '-2px', width: '2px', height: '12px', bg: EPIC_THEME.colors.accent },
        { bottom: '-2px', right: '-2px', width: '12px', height: '2px', bg: EPIC_THEME.colors.accent },
        { bottom: '-2px', right: '-2px', width: '2px', height: '12px', bg: EPIC_THEME.colors.accent },
      ].map((line, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...line,
            background: line.bg,
            boxShadow: `0 0 6px ${line.bg}`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ))}
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
    </button>
  );
}

