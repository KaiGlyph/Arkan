import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async (mode: 'signin' | 'signup') => {
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signin') await signIn(email, password);
      else await signUp(email, password);
    } catch (e: any) {
      const code = e?.code || '';
      const map: Record<string, string> = {
        'auth/invalid-email': 'Email inválido',
        'auth/missing-password': 'Falta la contraseña',
        'auth/weak-password': 'La contraseña es demasiado débil',
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #0A0514 0%, #120b24 100%)',
      color: 'white',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: 'rgba(15,10,25,0.85)',
        border: '2px solid rgba(177,140,255,0.4)',
        boxShadow: '0 0 25px rgba(177,140,255,0.25)',
        padding: 24,
      }}>
        <div style={{textAlign: 'center', marginBottom: 16}}>
          <img src="/Arkan-Logo.png" alt="Arkan Protocol" style={{width: 72, height: 72, objectFit: 'contain'}} />
        </div>
        <h1 style={{margin: '0 0 8px 0', fontSize: 22}}>Iniciar sesión</h1>
        <p style={{margin: '0 0 16px 0', opacity: 0.8, fontSize: 14}}>Accede con tu cuenta o crea una nueva.</p>

        <label style={{display: 'block', fontSize: 13, marginBottom: 6, opacity: 0.9}}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
          style={{
            width: '100%', padding: '10px 12px', marginBottom: 12, boxSizing: 'border-box',
            background: '#1a1330', color: 'white', border: '1px solid #6f56b8'
          }}
        />

        <label style={{display: 'block', fontSize: 13, marginBottom: 6, opacity: 0.9}}>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          style={{
            width: '100%', padding: '10px 12px', marginBottom: 12,
            background: '#1a1330', color: 'white', border: '1px solid #6f56b8'
          }}
        />

        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.15)',
            border: '1px solid rgba(255, 107, 107, 0.6)',
            color: '#FFB3B3', padding: '8px 10px', fontSize: 13, marginBottom: 12
          }}>{error}</div>
        )}

        <button
          onClick={() => handle('signin')}
          disabled={loading}
          style={{
            width: '100%', padding: '10px 12px', fontWeight: 700, cursor: 'pointer',
            background: '#B18CFF', color: '#0F071A', border: 'none'
          }}
        >{loading ? 'Accediendo…' : 'Entrar'}</button>

        <div style={{textAlign: 'center', margin: '12px 0', opacity: 0.75, fontSize: 13}}>o</div>

        <button
          onClick={() => handle('signup')}
          disabled={loading}
          style={{
            width: '100%', padding: '10px 12px', fontWeight: 700, cursor: 'pointer',
            background: 'transparent', color: '#D8B4FE', border: '1px solid #6f56b8'
          }}
        >Crear cuenta</button>
      </div>
    </div>
  );
}
