import { useEffect, useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { 
  XP_BY_DIFFICULTY, 
  DISPLAY_NAMES, 
  STATUS_TEXT, 
  STATUS_COLORS, 
  CATEGORY_COLORS,
  RARITY_COLORS,
  RARITY_NAMES,
  ITEM_CATEGORY_NAMES
} from '../constants';
import type { RealAttribute, ItemCategory, ItemRarity } from '../types';

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
    inventory,
    addItem,
    removeItem,
    updateProfile,
  } = useHabits();

  const [modal, setModal] = useState<null | 'missions' | 'inventory' | 'titles' | 'pets' | 'profile'>(null);
  const [editProfile, setEditProfile] = useState({ name: '', age: 0, title: '' });
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'all'>('all');
  const [showAddItem, setShowAddItem] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'herramientas' as ItemCategory,
    rarity: 'normal' as ItemRarity,
  });

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
    const interval = setInterval(checkPending, 60000);
    return () => clearInterval(interval);
  }, [habits]);

  const handleSaveProfile = () => {
    updateProfile(editProfile);
    setModal(null);
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;
    
    addItem({
      name: newItem.name,
      description: newItem.description,
      category: newItem.category,
      rarity: newItem.rarity,
    });

    setNewItem({
      name: '',
      description: '',
      category: 'herramientas',
      rarity: 'normal',
    });
    setShowAddItem(false);
  };

  const filteredItems = filterCategory === 'all' 
    ? inventory 
    : inventory.filter(item => item.category === filterCategory);

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
        position: 'relative',
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

        {/* Atributos */}
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

      {/* 🔘 Botones de navegación */}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(['exercise', 'mind', 'health', 'productivity'] as const).map(category => (
                dailyMissions[category] && dailyMissions[category]!.map((habit) => {
                  const today = new Date().toISOString().split('T')[0];
                  const isCompleted = habit.lastCompleted === today;
                  
                  return (
                    <div key={habit.id} style={{
                      backgroundColor: '#33244A',
                      padding: '16px',
                      borderRadius: '8px',
                      border: `2px solid ${CATEGORY_COLORS[category]}`,
                      opacity: isCompleted ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}>
                      {/* Checkbox estilo imagen */}
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        disabled={isCompleted}
                        style={{
                          width: '32px',
                          height: '32px',
                          minWidth: '32px',
                          minHeight: '32px',
                          borderRadius: '50%',
                          border: `3px solid ${isCompleted ? '#4CAF50' : '#666'}`,
                          backgroundColor: isCompleted ? '#4CAF50' : 'transparent',
                          cursor: isCompleted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isCompleted ? '✓' : ''}
                      </button>

                      {/* Contenido de la misión */}
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '11px', 
                          opacity: 0.7, 
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          {isCompleted ? 'MISIÓN SECUNDARIA' : 'MISIÓN PRINCIPAL'}
                        </div>
                        <div style={{ 
                          fontWeight: 'bold', 
                          fontSize: '16px',
                          marginBottom: '4px',
                        }}>
                          {habit.name}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#FFD93D',
                        }}>
                          +{XP_BY_DIFFICULTY[habit.difficulty]} XP
                        </div>
                        {isCompleted && (
                          <div style={{ 
                            fontSize: '10px', 
                            color: '#4CAF50', 
                            marginTop: '4px',
                          }}>
                            Completado hoy
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ Modal de Inventario */}
      {modal === 'inventory' && (
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
            maxWidth: '600px',
            maxHeight: '85vh',
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
                INVENTARIO
              </h2>
              <button onClick={() => setModal(null)} style={{
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: '24px',
                cursor: 'pointer'
              }}>✕</button>
            </div>

            <button
              onClick={() => setShowAddItem(!showAddItem)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              {showAddItem ? '✕ Cancelar' : '+ Añadir Item'}  {/* 👈 Ya está aquí, es correcto */}
            </button>

            {showAddItem && (
              <div style={{
                backgroundColor: '#33244A',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}>
                <input
                  type="text"
                  placeholder="Nombre del item"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '8px',
                    backgroundColor: '#25153A',
                    border: '1px solid #B18CFF',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <textarea
                  placeholder="Descripción"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '8px',
                    backgroundColor: '#25153A',
                    border: '1px solid #B18CFF',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'vertical',
                  }}
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value as ItemCategory})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '8px',
                    backgroundColor: '#25153A',
                    border: '1px solid #B18CFF',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  {Object.keys(ITEM_CATEGORY_NAMES).map(cat => (
                    <option key={cat} value={cat}>{ITEM_CATEGORY_NAMES[cat as ItemCategory]}</option>
                  ))}
                </select>
                <select
                  value={newItem.rarity}
                  onChange={(e) => setNewItem({...newItem, rarity: e.target.value as ItemRarity})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '12px',
                    backgroundColor: '#25153A',
                    border: '1px solid #B18CFF',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  {Object.keys(RARITY_NAMES).map(rar => (
                    <option key={rar} value={rar}>{RARITY_NAMES[rar as ItemRarity]}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddItem}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Guardar Item
                </button>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '16px',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => setFilterCategory('all')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: filterCategory === 'all' ? '#B18CFF' : '#33244A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Todos
              </button>
              {Object.keys(ITEM_CATEGORY_NAMES).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat as ItemCategory)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: filterCategory === cat ? '#B18CFF' : '#33244A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {ITEM_CATEGORY_NAMES[cat as ItemCategory]}
                </button>
              ))}
            </div>

            {filteredItems.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.7 }}>
                No tienes items en esta categoría
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredItems.map(item => (
                  <div key={item.id} style={{
                    backgroundColor: '#33244A',
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${RARITY_COLORS[item.rarity]}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 'bold', 
                          fontSize: '16px',
                          marginBottom: '4px',
                        }}>
                          {item.name}
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: RARITY_COLORS[item.rarity],
                          marginBottom: '8px',
                        }}>
                          {RARITY_NAMES[item.rarity]} • {ITEM_CATEGORY_NAMES[item.category]}
                        </div>
                        {item.description && (
                          <div style={{ 
                            fontSize: '13px', 
                            opacity: 0.8,
                            marginBottom: '8px',
                          }}>
                            {item.description}
                          </div>
                        )}
                        <div style={{ fontSize: '11px', opacity: 0.5 }}>
                          Adquirido: {new Date(item.dateAcquired).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#F44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          marginLeft: '12px',
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                onChange={(e) => setEditProfile({...editProfile, age: parseInt(e.target.value) || 0})}
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