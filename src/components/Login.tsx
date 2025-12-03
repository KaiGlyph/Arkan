import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EPIC_THEME } from '../constants';

// 🔹 Iconos SVG personalizados (estilo Sistema)
const EyeClosedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // solo para signup
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔁 Reset al cambiar de modo
  const resetForm = () => {
    setPassword('');
    setPasswordConfirm('');
    setShowPassword(false);
    setShowPasswordConfirm(false);
    setShowConfirmPassword(false);
    setError(null);
  };

  const handle = async (mode: 'signin' | 'signup') => {
    setError(null);
    setLoading(true);

    // ✅ Validación universal
    if (password.trim().length < 6) {
      setError('Contraseña mínima: 6 caracteres');
      setLoading(false);
      return;
    }

    // ✅ Validación solo en signup
    if (mode === 'signup') {
      if (password !== passwordConfirm) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (e: any) {
      const code = e?.code || '';
      const map: Record<string, string> = {
        'auth/invalid-email': 'Email inválido',
        'auth/missing-password': 'Falta la contraseña',
        'auth/weak-password': 'Mínimo 6 caracteres',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/email-already-in-use': 'El email ya está en uso',
      };
      setError(map[code] || 'Error al autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div style={{
        width: '100%',
        maxWidth: 380,
        backgroundColor: 'rgba(15, 10, 25, 0.85)',
        border: `2px solid ${EPIC_THEME.colors.accent}`,
        boxShadow: `0 0 25px ${EPIC_THEME.colors.accentGlow}, inset 0 0 30px rgba(177, 140, 255, 0.1)`,
        padding: 24,
        borderRadius: 0,
        position: 'relative',
        overflow: 'visible',
      }}>
        {/* Esquinas futuristas */}
        {[
          { top: '-4px', left: '-4px', width: '24px', height: '3px', bg: EPIC_THEME.colors.accent },
          { top: '-4px', left: '-4px', width: '3px', height: '24px', bg: EPIC_THEME.colors.accent },
          { top: '-4px', right: '-4px', width: '24px', height: '3px', bg: EPIC_THEME.colors.accent },
          { top: '-4px', right: '-4px', width: '3px', height: '24px', bg: EPIC_THEME.colors.accent },
          { bottom: '-4px', left: '-4px', width: '24px', height: '3px', bg: EPIC_THEME.colors.accent },
          { bottom: '-4px', left: '-4px', width: '3px', height: '24px', bg: EPIC_THEME.colors.accent },
          { bottom: '-4px', right: '-4px', width: '24px', height: '3px', bg: EPIC_THEME.colors.accent },
          { bottom: '-4px', right: '-4px', width: '3px', height: '24px', bg: EPIC_THEME.colors.accent },
        ].map((line, i) => (
          <div key={i} style={{ position: 'absolute', ...line, background: line.bg, boxShadow: `0 0 8px ${EPIC_THEME.colors.accent}`, zIndex: 15 }} />
        ))}

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <img 
            src="/Arkan-Logo.png" 
            alt="Arkan Protocol" 
            style={{ 
              width: 72, 
              height: 72, 
              objectFit: 'contain', 
              filter: 'drop-shadow(0 0 10px rgba(177, 140, 255, 0.5))' 
            }} 
          />
        </div>

        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: 22,
          fontWeight: 'bold',
          fontFamily: EPIC_THEME.typography.heading,
          letterSpacing: '1px',
          color: EPIC_THEME.colors.accentLight,
          textShadow: `0 0 8px ${EPIC_THEME.colors.accentLight}`
        }}>Iniciar sesión</h1>

        <p style={{
          margin: '0 0 16px 0',
          opacity: 0.8,
          fontSize: 14,
          fontFamily: EPIC_THEME.typography.subtitle,
          color: '#D8B4FE'
        }}>Accede con tu cuenta o crea una nueva.</p>

        {/* Email */}
        <label style={{
          display: 'block',
          fontSize: 13,
          marginBottom: 6,
          opacity: 0.9,
          fontFamily: EPIC_THEME.typography.subtitle,
          color: EPIC_THEME.colors.accentLight
        }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
          style={{
            width: '100%',
            padding: '10px 12px',
            marginBottom: 12,
            boxSizing: 'border-box',
            backgroundColor: 'rgba(26, 19, 48, 0.8)',
            color: 'white',
            border: `1px solid ${EPIC_THEME.colors.accent}`,
            borderRadius: 0,
            fontFamily: EPIC_THEME.typography.body,
            fontSize: 14,
            outline: 'none'
          }}
        />

        {/* Contraseña */}
        <label style={{
          display: 'block',
          fontSize: 13,
          marginBottom: 6,
          opacity: 0.9,
          fontFamily: EPIC_THEME.typography.subtitle,
          color: EPIC_THEME.colors.accentLight
        }}>Contraseña</label>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            style={{
              width: '100%',
              padding: '10px 40px 10px 12px',
              boxSizing: 'border-box',
              backgroundColor: 'rgba(26, 19, 48, 0.8)',
              color: 'white',
              border: `1px solid ${EPIC_THEME.colors.accent}`,
              borderRadius: 0,
              fontFamily: EPIC_THEME.typography.body,
              fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 2,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: EPIC_THEME.colors.accentLight,
              filter: `drop-shadow(0 0 6px ${EPIC_THEME.colors.accentGlow})`,
            }}
          >
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        </div>

        {/* 🔑 Confirmar contraseña (solo en signup) */}
        {showConfirmPassword && (
          <>
            <label style={{
              display: 'block',
              fontSize: 13,
              marginBottom: 6,
              opacity: 0.9,
              fontFamily: EPIC_THEME.typography.subtitle,
              color: EPIC_THEME.colors.accentLight
            }}>Confirmar contraseña</label>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 12px',
                  boxSizing: 'border-box',
                  backgroundColor: 'rgba(26, 19, 48, 0.8)',
                  color: 'white',
                  border: `1px solid ${EPIC_THEME.colors.accent}`,
                  borderRadius: 0,
                  fontFamily: EPIC_THEME.typography.body,
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                aria-label={showPasswordConfirm ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 2,
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: EPIC_THEME.colors.accentLight,
                  filter: `drop-shadow(0 0 6px ${EPIC_THEME.colors.accentGlow})`,
                }}
              >
                {showPasswordConfirm ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
          </>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.15)',
            border: '1px solid rgba(255, 107, 107, 0.6)',
            color: '#FFB3B3',
            padding: '8px 10px',
            fontSize: 13,
            marginBottom: 12,
            borderRadius: 0,
            fontFamily: EPIC_THEME.typography.subtitle
          }}>{error}</div>
        )}

        {/* Botón Entrar */}
        <button
          onClick={() => {
            resetForm();
            handle('signin');
          }}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontWeight: 700,
            cursor: 'pointer',
            background: EPIC_THEME.colors.accent,
            color: '#0F071A',
            border: 'none',
            borderRadius: 0,
            fontFamily: EPIC_THEME.typography.heading,
            fontSize: 15,
            boxShadow: `0 0 15px ${EPIC_THEME.colors.accentGlow}, inset 0 0 20px rgba(177, 140, 255, 0.3)`,
            transition: 'all 0.2s ease'
          }}
        >{loading ? 'Accediendo…' : 'Entrar'}</button>

        <div style={{
          textAlign: 'center',
          margin: '12px 0',
          opacity: 0.75,
          fontSize: 13,
          fontFamily: EPIC_THEME.typography.subtitle,
          color: '#D8B4FE'
        }}>o</div>

        {/* Botón Crear cuenta — ahora activa el modo signup */}
        <button
          onClick={() => {
            resetForm();
            setShowConfirmPassword(true);
            handle('signup');
          }}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontWeight: 700,
            cursor: 'pointer',
            background: 'transparent',
            color: '#D8B4FE',
            border: `1px solid ${EPIC_THEME.colors.accent}`,
            borderRadius: 0,
            fontFamily: EPIC_THEME.typography.heading,
            fontSize: 15,
            boxShadow: `0 0 10px ${EPIC_THEME.colors.accentGlow}`,
            transition: 'all 0.2s ease'
          }}
        >Crear cuenta</button>
      </div>
    </div>
  );
}