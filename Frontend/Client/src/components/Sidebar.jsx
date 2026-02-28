import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'discover', label: 'Discover Events', icon: '⊹', path: '/' },
    { id: 'myevents', label: 'My Events', icon: '◈', path: '/myevents' },
    { id: 'create', label: 'Create Event', icon: '⊕', path: '/eventform' },
  ];

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const photoURL = user?.photoURL || null;
  const initial = displayName[0]?.toUpperCase() || 'U';

  const handleSignOut = async () => { await signOut(); navigate('/sign-in'); };

  return (
    <>
      <style>{`
        /* ══════════════════════════════════════
           DESKTOP (≥ 1024px): sticky, collapsible width
           ══════════════════════════════════════ */
        .sidebar-aside {
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
          overflow: hidden;
          width: 256px;
          border-right: 1px solid rgba(255,255,255,0.07);
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(20px);
          z-index: 20;
          transition: width 0.32s cubic-bezier(.4,0,.2,1),
                      border-color 0.32s ease;
        }
        .sidebar-aside.sb-collapsed {
          width: 0;
          border-color: transparent;
        }

        /* Inner content keeps fixed min-width during collapse animation */
        .sb-inner {
          min-width: 256px;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 0 24px 28px;
        }

        /* ── Hamburger lines ── */
        .hb-line {
          display: block; width: 13px; height: 1.5px;
          background: rgba(255,255,255,0.6);
          transition: transform 0.25s ease, opacity 0.2s ease, width 0.2s ease;
          transform-origin: center;
        }
        .hb-btn.is-x .hb-line:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .hb-btn.is-x .hb-line:nth-child(2) { opacity: 0; width: 0; }
        .hb-btn.is-x .hb-line:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* ── Reopen tab (desktop: shows when collapsed) ── */
        .reopen-tab {
          position: fixed; top: 52px; left: 8px;
          width: 34px; height: 34px;
          background: rgba(10,10,10,0.9);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 4px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px;
          cursor: pointer;
          z-index: 300;
          opacity: 0; pointer-events: none;
          transition: opacity 0.2s ease, background 0.2s;
        }
        .reopen-tab.rt-visible { opacity: 1; pointer-events: all; }
        .reopen-tab:hover { background: rgba(40,40,40,0.95); }
        .reopen-tab span  { display: block; width: 13px; height: 1.5px; background: rgba(255,255,255,0.6); }

        /* ── Nav items ── */
        .sb-nav-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border-left: 2px solid transparent; cursor: pointer; border-radius: 2px;
          transition: background 0.15s, border-color 0.15s;
        }
        .sb-nav-item:hover  { background: rgba(255,255,255,0.04); border-left-color: rgba(255,255,255,0.12); }
        .sb-nav-item.active { background: rgba(168,85,247,0.08); border-left-color: #a855f7; }

        /* ══════════════════════════════════════
           MOBILE (< 1024px): fixed position overlay
           z-index 50 > backdrop 45 > page
           ══════════════════════════════════════ */
        @media (max-width: 1023px) {
          /* Sidebar slides in from left, completely out of flow */
          .sidebar-aside {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            width: 256px !important;
            z-index: 50 !important;        /* ABOVE the backdrop (45) */
            transform: translateX(-100%);
            transition: transform 0.3s ease !important;
            border-right: 1px solid rgba(255,255,255,0.07) !important;
          }
          .sidebar-aside.sb-mobile-open {
            transform: translateX(0) !important;
          }
          /* Desktop collapse class has no effect on mobile */
          .sidebar-aside.sb-collapsed {
            width: 256px !important;
            border-color: rgba(255,255,255,0.07) !important;
          }

          /* Reopen tab always visible on mobile when sidebar is closed */
          .reopen-tab.rt-mobile-show {
            opacity: 1;
            pointer-events: all;
          }
          /* Move reopen tab further from screen edge on mobile */
          .reopen-tab {
            left: 14px !important;
            top: 12px !important;
          }
        }
      `}</style>

      {/* ── Mobile backdrop — MUST be below sidebar z-index ── */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 30 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/*
        Reopen tab:
        - Desktop: shows via .rt-visible when desktop sidebar is collapsed
        - Mobile:  shows via .rt-mobile-show when sidebar is not open
        CSS handles which rule applies per breakpoint.
      */}
      <div
        className={[
          'reopen-tab',
          collapsed ? 'rt-visible' : '',    // desktop collapsed
          !sidebarOpen ? 'rt-mobile-show' : '', // mobile closed
        ].join(' ')}
        onClick={() => {
          setCollapsed(false);
          setSidebarOpen(true);
        }}
        title="Open menu"
      >
        <span /><span /><span />
      </div>

      {/* ── Sidebar ── z-index inline so it always beats backdrop (30) ── */}
      <aside
        className={[
          'sidebar-aside',
          collapsed ? 'sb-collapsed' : '',
          sidebarOpen ? 'sb-mobile-open' : '',
        ].join(' ')}
        style={sidebarOpen ? { zIndex: 40 } : {}}
      >
        <div className="sb-inner">

          {/* Logo + Hamburger header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0 0', marginBottom: '40px' }}>
            <div>
              <div
                onClick={() => { navigate('/'); setSidebarOpen(false); }}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', letterSpacing: '3px', cursor: 'pointer', color: '#fff' }}
              >
                EVENTO
              </div>
              <div style={{ width: '28px', height: '2px', background: 'linear-gradient(90deg, #a855f7, transparent)', marginTop: '5px' }} />
            </div>

            {/* Hamburger ✕ — collapses on desktop, closes on mobile */}
            <button
              className="hb-btn is-x"
              onClick={() => {
                setCollapsed(true);
                setSidebarOpen(false);
              }}
              style={{
                width: '32px', height: '32px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '4.5px',
                flexShrink: 0, transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              aria-label="Close menu"
            >
              <span className="hb-line" />
              <span className="hb-line" />
              <span className="hb-line" />
            </button>
          </div>

          {/* Nav label */}
          <div style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', fontFamily: "'Space Mono', monospace" }}>
            NAVIGATION
          </div>

          {/* Nav items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.id}
                  className={`sb-nav-item${isActive ? ' active' : ''}`}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); setCollapsed(false); }}
                >
                  <span style={{ color: isActive ? '#a855f7' : 'rgba(255,255,255,0.3)', fontSize: '14px' }}>{item.icon}</span>
                  <span style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: isActive ? 500 : 400 }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </nav>

          <div style={{ flex: 1 }} />

          {/* User card */}
          <div
            onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '18px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', cursor: 'pointer' }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: photoURL ? 'transparent' : 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, flexShrink: 0, overflow: 'hidden' }}>
              {photoURL ? <img src={photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>
                {displayName.toUpperCase()}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {email}
              </div>
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', padding: '9px 16px', borderRadius: '2px', cursor: 'pointer', fontSize: '12px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px', textAlign: 'left', width: '100%', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,80,80,0.35)'; e.currentTarget.style.color = 'rgba(255,100,100,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          >
            ↳ SIGN OUT
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
