import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import FilterBar from '../components/FilterBar';

/* ─── Enhanced Dot-Grid Canvas (matches HTML reference exactly) ───────── */
const DotCanvas = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const dotsRef = useRef([]);
  const animRef = useRef(null);
  const S = 24;

  const buildDots = useCallback((W, H) => {
    const arr = [];
    for (let r = 0; r < Math.ceil(H / S) + 1; r++) {
      for (let c = 0; c < Math.ceil(W / S) + 1; c++) {
        arr.push({
          x: c * S,
          y: r * S,
          b: 0.15 + Math.random() * 0.12,   // base brightness
          p: Math.random() * Math.PI * 2,    // phase for pulsing
          ps: 0.006 + Math.random() * 0.008, // phase speed
        });
      }
    }
    dotsRef.current = arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;

    const resize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
      buildDots(canvas.width, canvas.height);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dotsRef.current.forEach(d => {
        d.p += d.ps;
        const dx = d.x - mouse.current.x;
        const dy = d.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const inf = Math.max(0, 1 - dist / 160);
        const br = Math.min(1, d.b + Math.sin(d.p) * 0.05 + inf * 0.7);
        const r = 1.2 + inf * 3.5;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${br})`;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };

    const onMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(section);
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, [buildDots]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        display: 'block',
      }}
    />
  );
};

/* ─── Floating Badge Card ─────────────────────────────────────────────── */
const BadgeCard = () => (
  <div style={{
    position: 'absolute',
    right: '60px',
    top: '50%',
    animation: 'badgeFloat 4s ease-in-out infinite',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '4px',
    padding: '24px 28px',
    zIndex: 2,
    minWidth: '180px',
  }}>
    <div style={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '30px',
      letterSpacing: '2px',
      marginBottom: '4px',
      color: '#fff',
    }}>
      EVENTO
    </div>
    <div style={{
      fontSize: '10px',
      color: 'rgba(255,255,255,0.4)',
      fontFamily: "'Space Mono', monospace",
      letterSpacing: '1px',
      marginBottom: '20px',
    }}>
      LIVE EVENTS PLATFORM
    </div>
    <div style={{
      fontSize: '10px',
      color: 'rgba(255,255,255,0.25)',
      fontFamily: "'Space Mono', monospace",
      borderTop: '1px solid rgba(255,255,255,0.07)',
      paddingTop: '12px',
      letterSpacing: '2px',
    }}>
      ATTENDEE
    </div>
  </div>
);

/* ─── HomePage ────────────────────────────────────────────────────────── */
const HomePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({ eventType: 'all', date: 'all' });

  useEffect(() => {
    axios.get('https://s62-james-capstone-evento.onrender.com/api/events')
      .then(r => setEvents(r.data))
      .catch(err => console.error('Error fetching events:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = Array.isArray(events) ? events.filter(event => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      event.title?.toLowerCase().includes(q) ||
      event.description?.toLowerCase().includes(q) ||
      event.venue?.toLowerCase().includes(q) ||
      event.organizer?.toLowerCase().includes(q);
    const matchesCategory = selectedFilters.eventType === 'all' ||
      event.eventType?.toLowerCase() === selectedFilters.eventType.toLowerCase();
    return matchesSearch && matchesCategory;
  }) : [];

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '72vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 60px 60px',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        {/* Dot canvas */}
        <DotCanvas />

        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(168,85,247,0.09) 0%, transparent 70%)',
        }} />

        {/* Bottom fade into body */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
        }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
          {/* Tagline */}
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            letterSpacing: '4px',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '20px',
            animation: 'fadeUp 0.7s ease both',
            animationDelay: '0s',
          }}>
            DISCOVER · CONNECT · CELEBRATE
          </div>

          {/* Giant heading */}
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(64px, 8vw, 110px)',
            lineHeight: 0.95,
            margin: '0 0 24px',
            letterSpacing: '2px',
            animation: 'fadeUp 0.7s ease both',
            animationDelay: '0.1s',
          }}>
            <span style={{ display: 'block', color: '#fff' }}>DISCOVER</span>
            <span style={{
              display: 'block',
              WebkitTextStroke: '1px rgba(255,255,255,0.3)',
              color: 'transparent',
            }}>EVENTS</span>
          </h1>

          {/* Sub-text */}
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '15px',
            lineHeight: 1.7,
            maxWidth: '500px',
            margin: '0 0 36px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            animation: 'fadeUp 0.7s ease both',
            animationDelay: '0.2s',
          }}>
            Find and join events happening around you. From cultural celebrations to tech summits — there's something for everyone.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            animation: 'fadeUp 0.7s ease both',
            animationDelay: '0.3s',
          }}>
            <button
              onClick={() => { const el = document.getElementById('events-section'); el?.scrollIntoView({ behavior: 'smooth' }); }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e0e0e0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              style={{
                background: '#fff',
                color: '#000',
                border: 'none',
                padding: '14px 32px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '12px',
                letterSpacing: '2px',
                cursor: 'pointer',
                borderRadius: '2px',
                fontWeight: 700,
                transition: 'background 0.2s',
              }}
            >
              BROWSE ALL
            </button>
            <button
              onClick={() => navigate('/eventform')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '14px 32px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '12px',
                letterSpacing: '2px',
                cursor: 'pointer',
                borderRadius: '2px',
                transition: 'border-color 0.2s',
              }}
            >
              HOST AN EVENT
            </button>
          </div>
        </div>

        {/* Floating badge */}
        <BadgeCard />
      </section>

      {/* ── SEARCH + FILTERS ──────────────────────────────────── */}
      <section id="events-section" style={{ padding: '36px 60px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '14px',
            }}>⊹</span>
            <input
              type="text"
              placeholder="Search events, venues, or organizers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoComplete="off"
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '13px 16px 13px 42px',
                borderRadius: '2px',
                fontSize: '13px',
                fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          {/* Filter bar */}
          <FilterBar selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
        </div>

        {/* Count */}
        {!loading && (
          <div style={{
            marginTop: '20px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.25)',
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '2px',
          }}>
            {filteredEvents.length} EVENT{filteredEvents.length !== 1 ? 'S' : ''} FOUND
          </div>
        )}
      </section>

      {/* ── EVENT GRID ────────────────────────────────────────── */}
      <section style={{ padding: '24px 60px 80px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '2px solid #a855f7',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {filteredEvents.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '2px' }}>
                  NO EVENTS FOUND
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
