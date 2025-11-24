import React from 'react';
import { useHabits } from '../hooks/useHabits';

export default function HUD() {
  return (
    <div style={{
      backgroundColor: '#25153A',
      color: '#FFFFFF',
      fontFamily: "'Inter', sans-serif",
      padding: '24px',
      minHeight: '100vh',
    }}>
      {/* Triángulo Arkan */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px',
      }}>
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: '35px solid #FFFFFF',
          margin: '0 auto 8px',
        }}></div>
        <div style={{
          fontWeight: 'bold',
          fontSize: '24px',
          letterSpacing: '1px',
        }}>ARKAN</div>
      </div>

      {/* Nivel y XP */}
      <div style={{ marginBottom: '24px' }}>
        <div>LEVEL 1</div>
        <div>XP: 0 / 100</div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#4A3A6B',
          borderRadius: '4px',
          marginTop: '4px',
        }}>
          <div style={{
            width: '0%',
            height: '100%',
            backgroundColor: '#B18CFF',
            borderRadius: '4px',
          }}></div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ 
        textAlign: 'right', 
        marginBottom: '24px',
        fontWeight: 'bold',
      }}>
        💪 Fuerza:    10<br />
        🧠 Sabiduría: 8<br />
        🛡️ Resistencia: 12
      </div>

      {/* Hábitos del día */}
      <div>
        <div>▼ Today’s Axioms (0/1)</div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginTop: '8px' 
        }}>
          <input type="checkbox" style={{ marginRight: '8px' }} />
          <span>Leer 10 min</span>
          <span style={{ marginLeft: 'auto', color: '#D8B4FE' }}>+10 XP</span>
        </div>
      </div>
    </div>
  );
}