import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Global Dot Canvas (full-page) ──────────────────────────────────── */
const DotCanvas = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const dotsRef = useRef([]);
  const animRef = useRef(null);
  const S = 26;

  const buildDots = useCallback((W, H) => {
    const arr = [];
    for (let r = 0; r < Math.ceil(H / S) + 1; r++)
      for (let c = 0; c < Math.ceil(W / S) + 1; c++)
        arr.push({ x: c * S, y: r * S, b: 0.08 + Math.random() * 0.1, p: Math.random() * Math.PI * 2, ps: 0.005 + Math.random() * 0.008 });
    dotsRef.current = arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildDots(canvas.width, canvas.height);
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dotsRef.current.forEach(d => {
        d.p += d.ps;
        const dx = d.x - mouse.current.x, dy = d.y - mouse.current.y;
        const inf = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 160);
        ctx.beginPath(); ctx.arc(d.x, d.y, 1.1 + inf * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, d.b + Math.sin(d.p) * 0.04 + inf * 0.65)})`; ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    const onMove = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    resize(); draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [buildDots]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

/* ─── CSS Keyframes injected once ────────────────────────────────────── */
const STYLES = `
  @keyframes scanline{0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}}
  @keyframes float404{0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);}}
  @keyframes spin404{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes blink404{0%,100%{opacity:1;}49%{opacity:1;}50%,80%{opacity:0;}}
  @keyframes glitch1{0%,95%,100%{clip-path:inset(0 0 100% 0);}96%{clip-path:inset(10% 0 60% 0);transform:translate(-4px,0);}97%{clip-path:inset(40% 0 30% 0);transform:translate(4px,0);}98%{clip-path:inset(70% 0 10% 0);transform:translate(-4px,0);}}
  @keyframes glitch2{0%,93%,100%{clip-path:inset(0 0 100% 0);}94%{clip-path:inset(20% 0 50% 0);transform:translate(5px,0);}95%{clip-path:inset(55% 0 20% 0);transform:translate(-5px,0);}96%{clip-path:inset(80% 0 5% 0);transform:translate(3px,0);}97%{clip-path:inset(0 0 100% 0);}}
  @keyframes fadeUp404{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
  .a404-d1{animation:fadeUp404 0.7s ease both;animation-delay:0.05s;}
  .a404-d2{animation:fadeUp404 0.7s ease both;animation-delay:0.15s;}
  .a404-d3{animation:fadeUp404 0.7s ease both;animation-delay:0.25s;}
  .a404-d4{animation:fadeUp404 0.7s ease both;animation-delay:0.35s;}
  .a404-d5{animation:fadeUp404 0.7s ease both;animation-delay:0.45s;}
  .a404-float{animation:float404 3.5s ease-in-out infinite;}
  .a404-spin{animation:spin404 12s linear infinite;}
  .a404-blink{animation:blink404 1.2s step-end infinite;color:#a855f7;}
  .a404-glitch1{animation:glitch1 4s steps(1) infinite;}
  .a404-glitch2{animation:glitch2 4s steps(1) infinite 0.5s;}
  .a404-scanline{animation:scanline 6s linear infinite;}
`;

/* ─── Error404 Page ───────────────────────────────────────────────────── */
const Error404 = () => {
  const navigate = useNavigate();
  const fontSize = 'clamp(140px,22vw,240px)';

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{STYLES}</style>

      {/* Scanline */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
        <div className="a404-scanline" style={{ width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.15), transparent)' }} />
      </div>

      {/* Dot canvas */}
      <DotCanvas />

      {/* Purple radial glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(168,85,247,0.07) 0%, transparent 70%)' }} />

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '56px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 40px', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', zIndex: 100, justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '3px' }}>EVENTO</div>
        <button
          onClick={() => navigate('/')}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'Space Mono', monospace", letterSpacing: '2px', cursor: 'pointer', transition: 'color 0.2s' }}
        >
          ← DASHBOARD
        </button>
      </nav>

      {/* ── MAIN ────────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2, padding: '56px 24px 40px' }}>

        {/* 404 Glitch Number */}
        <div className="a404-d1" style={{ position: 'relative', marginBottom: '8px', userSelect: 'none' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize, lineHeight: 1, letterSpacing: '8px', color: 'rgba(255,255,255,0.06)', position: 'relative' }}>
            404
            {/* Glitch layer 1 - purple */}
            <div className="a404-glitch1" style={{ position: 'absolute', inset: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize, lineHeight: 1, letterSpacing: '8px', color: '#a855f7' }}>404</div>
            {/* Glitch layer 2 - cyan */}
            <div className="a404-glitch2" style={{ position: 'absolute', inset: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize, lineHeight: 1, letterSpacing: '8px', color: '#06b6d4' }}>404</div>
            {/* Solid gradient top layer */}
            <div style={{ position: 'absolute', inset: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize, lineHeight: 1, letterSpacing: '8px', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.5) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</div>
          </div>
        </div>

        {/* ERROR divider */}
        <div className="a404-d2" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', width: '100%', maxWidth: '420px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12))' }} />
          <span style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.2)', fontFamily: "'Space Mono', monospace" }}>ERROR</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)' }} />
        </div>

        {/* Message */}
        <div className="a404-d2" style={{ textAlign: 'center', marginBottom: '12px' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '3px', lineHeight: 1.1, marginBottom: '16px', color: '#fff' }}>
            PAGE NOT FOUND<span className="a404-blink">_</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
        </div>

        {/* Floating search icon with orbit */}
        <div className="a404-d3" style={{ margin: '32px 0', position: 'relative' }}>
          <div className="a404-float" style={{ width: '110px', height: '110px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* inner grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(255,255,255,0.03) 19px,rgba(255,255,255,0.03) 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(255,255,255,0.03) 19px,rgba(255,255,255,0.03) 20px)' }} />
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <line x1="15.5" y1="15.5" x2="21" y2="21" />
            </svg>
          </div>
          {/* Orbit ring */}
          <div className="a404-spin" style={{ position: 'absolute', inset: '-16px', border: '1px dashed rgba(168,85,247,0.15)', borderRadius: '50%' }} />
          {/* Dot on orbit */}
          <div style={{ position: 'absolute', top: '-4px', left: '50%', width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 12px rgba(168,85,247,0.8)', transform: 'translateX(-50%)' }} />
        </div>

        {/* HTTP status bar */}
        <div className="a404-d3" style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.2)', marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,80,80,0.7)', boxShadow: '0 0 8px rgba(255,80,80,0.5)', display: 'inline-block' }} />
          HTTP 404 · RESOURCE UNAVAILABLE
        </div>

        {/* Buttons */}
        <div className="a404-d4" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          <button
            onClick={() => navigate('/')}
            onMouseEnter={e => { e.currentTarget.style.background = '#e0e0e0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
            style={{ background: '#fff', color: '#000', border: 'none', padding: '14px 36px', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '3px', fontWeight: 700, cursor: 'pointer', borderRadius: '2px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            ⌂ GO HOME
          </button>
          <button
            onClick={() => window.history.back()}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 36px', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '3px', cursor: 'pointer', borderRadius: '2px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            ← GO BACK
          </button>
        </div>

        {/* Quick links */}
        <div className="a404-d5" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.2)', fontFamily: "'Space Mono', monospace", marginBottom: '14px' }}>
            OR TRY ONE OF THESE
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {quickLinks.map((link, i) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                onMouseEnter={e => { e.currentTarget.style.color = '#a855f7'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                style={{
                  color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none',
                  borderRight: i < quickLinks.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  fontSize: '12px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px',
                  padding: '0 14px', cursor: 'pointer', transition: 'color 0.2s',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Error404;
