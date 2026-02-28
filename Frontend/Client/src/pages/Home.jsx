import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import FilterBar from '../components/FilterBar';
import { useAuth } from '../context/AuthContext';

/* ─── Dot-Grid Canvas — base pulse + mouse hover glow ────────────────── */
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
          b: 0.14 + Math.random() * 0.12,   // thin base brightness
          p: Math.random() * Math.PI * 2,    // phase
          ps: 0.005 + Math.random() * 0.008,  // phase speed
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
        // base pulse stays thin; hover adds glow
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
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, display: 'block' }}
    />
  );
};

/* ─── Floating Badge Card ─────────────────────────────────────────────── */
const BadgeCard = () => (
  <div style={{
    position: 'absolute', right: '60px', top: '50%',
    animation: 'badgeFloat 4s ease-in-out infinite',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '4px', padding: '22px 26px',
    zIndex: 2, minWidth: '170px',
  }}>
    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '2px', marginBottom: '4px', color: '#fff' }}>EVENTO</div>
    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono', monospace", letterSpacing: '1px', marginBottom: '18px' }}>LIVE EVENTS PLATFORM</div>
    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace", borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '11px', letterSpacing: '2px' }}>ATTENDEE</div>
  </div>
);

/* ─── Date label ──────────────────────────────────────────────────────── */
const getDayDateLabel = () => {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const date = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
  return `${day} · ${date}`;
};

/* ─── HomePage ────────────────────────────────────────────────────────── */
const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({ eventType: 'all', date: 'all' });
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Pull first name from Firebase displayName
  const firstName = (user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'THERE').toUpperCase();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'https://s62-james-capstone-evento.onrender.com'}/api/events`)
      .then(r => setEvents(r.data))
      .catch(err => console.error('Error fetching events:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (deletedId) => {
    setEvents(prev => prev.filter(e => e._id !== deletedId));
  };

  const filteredEvents = Array.isArray(events) ? events.filter(event => {
    const q = searchQuery.toLowerCase();
    if (!q) return selectedFilters.eventType === 'all' ||
      event.eventType?.toLowerCase() === selectedFilters.eventType.toLowerCase();

    // Text fields (note: description included; move to $text index at scale)
    const textMatch = [event.title, event.subtitle, event.description,
    event.eventType, event.venue, event.organizer, event.institution, event.city]
      .some(f => (f || '').toLowerCase().includes(q));

    // Array fields — requires .some() not direct includes
    const arrayMatch = [...(event.tags || []), ...(event.themes || [])]
      .some(t => t.toLowerCase().includes(q));

    const matchesSearch = textMatch || arrayMatch;
    const matchesCategory = selectedFilters.eventType === 'all' ||
      event.eventType?.toLowerCase() === selectedFilters.eventType.toLowerCase();
    return matchesSearch && matchesCategory;
  }) : [];

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="home-hero" style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <DotCanvas />

        {/* Radial glow */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(168,85,247,0.09) 0%, transparent 70%)' }} />

        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px', zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '660px' }}>

          {/* ── GREETING ── */}
          <div style={{ marginBottom: '20px', animation: 'fadeUp 0.65s ease both', animationDelay: '0s' }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '4px',
              color: 'rgba(255,255,255,0.45)',
              marginBottom: '6px',
            }}>
              {getDayDateLabel()}
            </div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '38px',
              letterSpacing: '2px',
              lineHeight: 1,
              margin: 0,
              padding: 0,
              color: '#fff',
              fontWeight: 600,
            }}>
              HELLO,<br />
              <span style={{ color: '#a855f7' }}>{firstName}</span> ✦
            </h1>
          </div>

          {/* ── DISCOVER / EVENTS ── */}
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(72px, 9.5vw, 120px)',
            lineHeight: 0.92,
            margin: '0 0 22px',
            letterSpacing: '2px',
            fontWeight: 600,
            animation: 'fadeUp 0.65s ease both',
            animationDelay: '0.08s',
          }}>
            <span style={{ display: 'block', color: '#fff' }}>DISCOVER</span>
            <span style={{ display: 'block', WebkitTextStroke: '1.5px rgba(255,255,255,0.28)', color: 'transparent' }}>EVENTS</span>
          </h1>

          {/* Sub-text */}
          <p style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.7,
            maxWidth: '480px', margin: '0 0 32px',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            animation: 'fadeUp 0.65s ease both', animationDelay: '0.16s',
          }}>
            Find and join events happening around you. From cultural celebrations to tech summits — there's something for everyone.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', animation: 'fadeUp 0.65s ease both', animationDelay: '0.24s' }}>
            <button
              onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={e => { e.currentTarget.style.background = '#e0e0e0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              style={{ background: '#fff', color: '#000', border: 'none', padding: '13px 30px', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '2px', cursor: 'pointer', borderRadius: '2px', fontWeight: 700, transition: 'background 0.2s' }}
            >BROWSE ALL</button>
            <button
              onClick={() => navigate('/eventform')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '13px 30px', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '2px', cursor: 'pointer', borderRadius: '2px', transition: 'border-color 0.2s' }}
            >HOST AN EVENT</button>
          </div>
        </div>

        {/* Floating badge — hidden on mobile via CSS */}
        <div className="home-badge"><BadgeCard /></div>
      </section>

      {/* ── SEARCH + FILTERS ──────────────────────────────────── */}
      <section id="events-section" className="home-search" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>⊹</span>
            <input
              type="text"
              placeholder="Search events, venues, or organizers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoComplete="off"
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px 12px 40px', borderRadius: '2px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color 0.2s' }}
            />
          </div>
          <FilterBar selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
        </div>
        {!loading && (
          <div style={{ marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace", letterSpacing: '2px' }}>
            {filteredEvents.length} EVENT{filteredEvents.length !== 1 ? 'S' : ''} FOUND
          </div>
        )}
      </section>

      {/* ── EVENT GRID ────────────────────────────────────────── */}
      <section className="home-grid-section">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: '32px', height: '32px', border: '2px solid #a855f7', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <>
            <div className="home-grid">
              {filteredEvents.map((event, i) => (
                <EventCard key={event._id} event={event} index={i}
                  onDelete={handleDelete}
                  onOpen={setSelectedEvent} />
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '2px' }}>NO EVENTS FOUND</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Event detail modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default HomePage;
