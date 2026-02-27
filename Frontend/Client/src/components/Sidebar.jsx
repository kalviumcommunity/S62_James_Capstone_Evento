import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'discover', label: 'Discover Events', icon: '⊹', path: '/' },
    { id: 'myevents', label: 'My Events', icon: '◈', path: '/myevents' },
    { id: 'create', label: 'Create Event', icon: '⊕', path: '/eventform' },
  ];

  // Firebase user fields
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const photoURL = user?.photoURL || null;
  const initial = displayName[0]?.toUpperCase() || 'U';

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        style={{
          width: '260px',
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
          padding: '32px 24px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(20px)',
          zIndex: 10,
        }}
        className={`
          fixed inset-y-0 left-0
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sticky lg:top-0
        `}
      >
        {/* Logo */}
        <div style={{ marginBottom: '48px' }}>
          <div
            onClick={() => navigate('/')}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '28px',
              letterSpacing: '3px',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            EVENTO
          </div>
          <div style={{
            width: '32px',
            height: '2px',
            background: 'linear-gradient(90deg, #a855f7, transparent)',
            marginTop: '6px',
          }} />
        </div>

        {/* Nav label */}
        <div style={{
          fontSize: '10px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: '16px',
          fontFamily: "'Space Mono', monospace",
        }}>
          NAVIGATION
        </div>

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.id}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: isActive ? 'rgba(168,85,247,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #a855f7' : '2px solid transparent',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; } }}
              >
                <span style={{
                  color: isActive ? '#a855f7' : 'rgba(255,255,255,0.3)',
                  fontSize: '14px',
                }}>
                  {item.icon}
                </span>
                <span style={{
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontSize: '13px',
                  fontWeight: isActive ? 500 : 400,
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User card */}
        <div
          onClick={() => navigate('/profile')}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: photoURL ? 'transparent' : 'linear-gradient(135deg, #a855f7, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700,
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            {photoURL
              ? <img src={photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initial
            }
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: '#fff',
            }}>
              {displayName.toUpperCase()}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {email}
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.4)',
            padding: '9px 16px',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '1px',
            textAlign: 'left',
            width: '100%',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,100,100,0.8)'; e.currentTarget.style.borderColor = 'rgba(255,100,100,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          ↳ SIGN OUT
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
