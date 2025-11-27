import { useEffect, useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { XP_BY_DIFFICULTY, DISPLAY_NAMES, STATUS_TEXT, STATUS_COLORS, CATEGORY_COLORS } from '../constants';
import type { RealAttribute } from '../types';


export default function HUD() {
  const {
    level,
    xpProgress,
    xpToNextLevel,
    progressPercent,
    attributes,
    energy,
    health,
    status,
    habits,
    dailyMissions,
    toggleHabit,
    name,      
    age,
    title,
  } = useHabits();
  const handleSaveProfile = () => {
    // Aquí necesitarás añadir una función updateProfile en useHabits
    // Por ahora, cierra el modal
    setModal(null);
  };

  const [modal, setModal] = useState<null | 'missions' | 'inventory' | 'titles' | 'pets' | 'profile'>(null);
  const [editProfile, setEditProfile] = useState({ name: '', age: 0, title: '' });

  // 🔔 Notificaciones activas (recordatorio cada minuto si hay hábitos pendientes)
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
      const today = new Date().toISOString().split('T')[0];
      const pending = habits.filter(h => !h.lastCompleted || h.lastCompleted !== today);
      if (pending.length > 0) {
        sendNotification('Arkan Protocol', `Tienes ${pending.length} hábito(s) pendientes`);
      }
    };

    requestPermission();
    const interval = setInterval(checkPending, 60000); // cada minuto
    return () => clearInterval(interval);
  }, [habits]);

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
            src="/Arkan-Logo.png" 
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
      {/* 👤 Perfil del Usuario */}
      <div style={{ 
        marginBottom: '20px', 
        backgroundColor: '#33244A', 
        padding: '16px', 
        borderRadius: '12px',
        textAlign: 'center',
        position: 'relative', // 👈 nuevo
      }}>
        {/* Botón editar */}
        <button
          onClick={() => {
            setEditProfile({ name, age, title });
            setModal('profile');
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: '#B18CFF',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✏️
        </button>
        
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '20px', 
          color: '#D8B4FE',
          marginBottom: '4px'
        }}>
          {name}
        </div>
        <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '2px' }}>
          {age} años
        </div>
        <div style={{ 
          fontSize: '13px', 
          color: '#B18CFF',
          fontFamily: "'Orbitron', sans-serif"
        }}>
          {title}
        </div>
      </div>

      // Y añade el modal al final (antes del cierre del div principal):
      {/* 🖼️ Modal de Editar Perfil */}
      {modal === 'profile' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#25153A',
            width: '90%',
            maxWidth: '400px',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", margin: 0 }}>
                EDITAR PERFIL
              </h2>
              <button onClick={() => setModal(null)} style={{
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: '24px',
                cursor: 'pointer'
              }}>✕</button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>
                Nombre
              </label>
              <input
                type="text"
                value={editProfile.name}
                onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#33244A',
                  border: '1px solid #B18CFF',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>
                Edad
              </label>
              <input
                type="number"
                value={editProfile.age}
                onChange={(e) => setEditProfile({...editProfile, age: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#33244A',
                  border: '1px solid #B18CFF',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>
                Título
              </label>
              <input
                type="text"
                value={editProfile.title}
                onChange={(e) => setEditProfile({...editProfile, title: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#33244A',
                  border: '1px solid #B18CFF',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <button
              onClick={handleSaveProfile}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {/* 📊 Estado Épico */}
      <div style={{ marginBottom: '24px', backgroundColor: '#33244A', padding: '16px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.7 }}>Nivel</div>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Lvl {level}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', opacity: 0.7 }}>Estado</div>
            <div style={{ 
              fontWeight: 'bold', 
              color: STATUS_COLORS[status],
            }}>
              {STATUS_TEXT[status]}
            </div>
          </div>
        </div>

        {/* Barra de XP */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
            XP: {xpProgress} / {xpToNextLevel}
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#4A3A6B',
            borderRadius: '3px',
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: '#B18CFF',
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }}></div>
          </div>
        </div>

        {/* HP y MP */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>HP</div>
            <div style={{ fontWeight: 'bold', color: health < 50 ? '#FF5252' : '#4CAF50' }}>
              {health}/100
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>MP</div>
            <div style={{ fontWeight: 'bold', color: energy < 30 ? '#FF9800' : '#2196F3' }}>
              {energy}/100
            </div>
          </div>
        </div>

        {/* Atributos — nombres reales con números */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '8px',
          fontSize: '13px'
        }}>
          {(Object.keys(attributes) as RealAttribute[]).map(attr => (
            <div key={attr} style={{ textAlign: 'center' }}>
              <div style={{ opacity: 0.7 }}>{DISPLAY_NAMES[attr]}</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#B18CFF' }}>
                {attributes[attr]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔘 Botones de navegación (abren modales) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setModal('missions')}
          style={{
            padding: '12px',
            backgroundColor: '#33244A',
            color: '#D8B4FE',
            border: '1px solid #B18CFF',
            borderRadius: '8px',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Misiones Diarias
        </button>
        <button
          onClick={() => setModal('inventory')}
          style={{
            padding: '12px',
            backgroundColor: '#33244A',
            color: '#D8B4FE',
            border: '1px solid #6A558C',
            borderRadius: '8px',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Inventario
        </button>
        <button
          onClick={() => setModal('titles')}
          style={{
            padding: '12px',
            backgroundColor: '#33244A',
            color: '#D8B4FE',
            border: '1px solid #8A7DBF',
            borderRadius: '8px',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Títulos
        </button>
        <button
          onClick={() => setModal('pets')}
          style={{
            padding: '12px',
            backgroundColor: '#33244A',
            color: '#D8B4FE',
            border: '1px solid #5A4B7C',
            borderRadius: '8px',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Mascotas
        </button>
      </div>

      {/* 🖼️ Modal de Misiones Diarias */}
      {modal === 'missions' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#25153A',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            borderRadius: '12px',
            padding: '24px',
            overflowY: 'auto',
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", margin: 0 }}>
                MISIONES DIARIAS
              </h2>
              <button onClick={() => setModal(null)} style={{
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: '24px',
                cursor: 'pointer'
              }}>✕</button>
            </div>

            {/* Listado de misiones por categoría */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Ejercicio */}
              {dailyMissions.exercise && dailyMissions.exercise.map((habit) => {
                const today = new Date().toISOString().split('T')[0];
                return (
                  <div key={habit.id} style={{
                    backgroundColor: '#33244A',
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${CATEGORY_COLORS.exercise}`,
                    opacity: habit.lastCompleted === today ? 0.6 : 1,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                          {habit.lastCompleted === today ? '🔁 MISIÓN SECUNDARIA' : '🎯 MISIÓN PRINCIPAL'}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{habit.name}</div>
                        <div style={{ fontSize: '12px', marginTop: '4px', color: '#FFD93D' }}>
                          +{XP_BY_DIFFICULTY[habit.difficulty]} XP
                        </div>
                        {habit.lastCompleted === today && (
                          <div style={{ fontSize: '10px', color: '#4CAF50', marginTop: '4px' }}>
                            ✅ Completado hoy
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: habit.lastCompleted === today ? '#666' : '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                        disabled={habit.lastCompleted === today}
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Mente */}
              {dailyMissions.mind && dailyMissions.mind.map((habit) => {
                const today = new Date().toISOString().split('T')[0];
                return (
                  <div key={habit.id} style={{
                    backgroundColor: '#33244A',
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${CATEGORY_COLORS.mind}`,
                    opacity: habit.lastCompleted === today ? 0.6 : 1,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                          {habit.lastCompleted === today ? '🔁 MISIÓN SECUNDARIA' : '🎯 MISIÓN PRINCIPAL'}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{habit.name}</div>
                        <div style={{ fontSize: '12px', marginTop: '4px', color: '#FFD93D' }}>
                          +{XP_BY_DIFFICULTY[habit.difficulty]} XP
                        </div>
                        {habit.lastCompleted === today && (
                          <div style={{ fontSize: '10px', color: '#4CAF50', marginTop: '4px' }}>
                            ✅ Completado hoy
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: habit.lastCompleted === today ? '#666' : '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                        disabled={habit.lastCompleted === today}
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Salud */}
              {dailyMissions.health && dailyMissions.health.map((habit) => {
                const today = new Date().toISOString().split('T')[0];
                return (
                  <div key={habit.id} style={{
                    backgroundColor: '#33244A',
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${CATEGORY_COLORS.health}`,
                    opacity: habit.lastCompleted === today ? 0.6 : 1,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                          {habit.lastCompleted === today ? '🔁 MISIÓN SECUNDARIA' : '🎯 MISIÓN PRINCIPAL'}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{habit.name}</div>
                        <div style={{ fontSize: '12px', marginTop: '4px', color: '#FFD93D' }}>
                          +{XP_BY_DIFFICULTY[habit.difficulty]} XP
                        </div>
                        {habit.lastCompleted === today && (
                          <div style={{ fontSize: '10px', color: '#4CAF50', marginTop: '4px' }}>
                            ✅ Completado hoy
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: habit.lastCompleted === today ? '#666' : '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                        disabled={habit.lastCompleted === today}
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Productividad */}
              {dailyMissions.productivity && dailyMissions.productivity.map((habit) => {
                const today = new Date().toISOString().split('T')[0];
                return (
                  <div key={habit.id} style={{
                    backgroundColor: '#33244A',
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${CATEGORY_COLORS.productivity}`,
                    opacity: habit.lastCompleted === today ? 0.6 : 1,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                          {habit.lastCompleted === today ? '🔁 MISIÓN SECUNDARIA' : '🎯 MISIÓN PRINCIPAL'}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{habit.name}</div>
                        <div style={{ fontSize: '12px', marginTop: '4px', color: '#FFD93D' }}>
                          +{XP_BY_DIFFICULTY[habit.difficulty]} XP
                        </div>
                        {habit.lastCompleted === today && (
                          <div style={{ fontSize: '10px', color: '#4CAF50', marginTop: '4px' }}>
                            ✅ Completado hoy
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: habit.lastCompleted === today ? '#666' : '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                        disabled={habit.lastCompleted === today}
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      )}

      {/* 🖼️ Modal de Editar Perfil */}
      {modal === 'profile' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#25153A',
            width: '90%',
            maxWidth: '400px',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", margin: 0 }}>
                EDITAR PERFIL
              </h2>
              <button onClick={() => setModal(null)} style={{
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: '24px',
                cursor: 'pointer'
              }}>✕</button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>
                Nombre
              </label>
              <input
                type="text"
                value={editProfile.name}
                onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#33244A',
                  border: '1px solid #B18CFF',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>
                Edad
              </label>
              <input
                type="number"
                value={editProfile.age}
                onChange={(e) => setEditProfile({...editProfile, age: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#33244A',
                  border: '1px solid #B18CFF',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>
                Título
              </label>
              <input
                type="text"
                value={editProfile.title}
                onChange={(e) => setEditProfile({...editProfile, title: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#33244A',
                  border: '1px solid #B18CFF',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <button
              onClick={handleSaveProfile}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {/* 🖼️ Otros modales (placeholders) */}
      {modal && modal !== 'missions' && modal !== 'inventory' && modal !== 'profile' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#25153A',
            width: '90%',
            maxWidth: '500px',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", margin: 0 }}>
                {modal === 'titles' ? 'TÍTULOS' : 'MASCOTAS'}
              </h2>
              <button onClick={() => setModal(null)} style={{
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: '24px',
                cursor: 'pointer'
              }}>✕</button>
            </div>
            <p style={{ opacity: 0.7 }}>Próximamente...</p>
          </div>
        </div>
      )}
    </div>
  );
}