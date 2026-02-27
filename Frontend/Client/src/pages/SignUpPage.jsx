import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';

/* ─── Dot Canvas ──────────────────────────────────────────────────────── */
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
        arr.push({ x: c * S, y: r * S, b: 0.1 + Math.random() * 0.1, p: Math.random() * Math.PI * 2, ps: 0.006 + Math.random() * 0.008 });
    dotsRef.current = arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    const resize = () => { canvas.width = parent.offsetWidth; canvas.height = parent.offsetHeight; buildDots(canvas.width, canvas.height); };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dotsRef.current.forEach(d => {
        d.p += d.ps;
        const dx = d.x - mouse.current.x, dy = d.y - mouse.current.y;
        const inf = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 140);
        ctx.beginPath(); ctx.arc(d.x, d.y, 1.1 + inf * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, d.b + Math.sin(d.p) * 0.04 + inf * 0.65)})`; ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    const onMove = e => { const r = canvas.getBoundingClientRect(); mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    resize(); draw();
    const ro = new ResizeObserver(resize); ro.observe(parent);
    parent.addEventListener('mousemove', onMove); parent.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); parent.removeEventListener('mousemove', onMove); parent.removeEventListener('mouseleave', onLeave); window.removeEventListener('resize', resize); };
  }, [buildDots]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

/* ─── SignUp ──────────────────────────────────────────────────────────── */
const SignUp = () => {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    setIsGoogleLoading(true);
    try {
      localStorage.removeItem('clerk-db-jwt');
      await signUp.authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: '/sso-callback', redirectUrlComplete: '/' });
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Google sign-up failed.');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isLoaded) return;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*christuniversity\.in$/;
    if (!emailRegex.test(formData.email)) { setError('Please use your official Christ University email.'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    try {
      const result = await signUp.create({ emailAddress: formData.email, password: formData.password });
      if (result.status === 'complete') { await setActive({ session: result.createdSessionId }); navigate('/'); }
    } catch (err) {
      if (err.errors?.[0]?.code === 'form_identifier_exists') { setError('Email already registered. Sign in instead.'); }
      else { setError(err.errors?.[0]?.longMessage || 'Sign up failed. Please try again.'); }
    } finally { setIsLoading(false); }
  };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '2px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color 0.2s' };
  const labelStyle = { fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono', monospace", display: 'block', marginBottom: '8px' };

  const features = [
    { icon: '◈', color: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)', title: 'Discover Events', desc: 'Find events that match your interests across universities' },
    { icon: '⊹', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', title: 'Connect with Friends', desc: 'See what events your friends are interested in' },
    { icon: '✦', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)', title: 'Personalized Recommendations', desc: 'Get curated events based on your preferences' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a', overflow: 'hidden' }}>

      {/* ── LEFT PANEL ──────────────────────────────── */}
      <div style={{ width: '45%', flexShrink: 0, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 48px', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
        <DotCanvas />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(168,85,247,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: '36px' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', letterSpacing: '4px', color: '#fff' }}>EVENTO</div>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #a855f7, transparent)', marginTop: '8px' }} />
          </div>
          <div style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace", marginBottom: '12px' }}>UNIVERSITY EVENTS PLATFORM</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '46px', lineHeight: 0.95, letterSpacing: '2px', marginBottom: '20px' }}>
            <span style={{ display: 'block', color: '#fff' }}>JOIN THE</span>
            <span style={{ display: 'block', WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent' }}>COMMUNITY</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.6, maxWidth: '340px', marginBottom: '32px', fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            Create your account to start discovering events, connecting with peers, and never missing what matters.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', flexShrink: 0, background: f.bg, border: `1px solid ${f.border}`, borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: f.color }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '3px' }}>{f.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace", letterSpacing: '2px' }}>
              JOIN THOUSANDS OF STUDENTS DISCOVERING AMAZING EVENTS
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px 44px', overflowY: 'hidden' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Header */}
          <div style={{ marginBottom: '18px', animation: 'fadeUp 0.6s ease both', animationDelay: '0.05s' }}>
            <div style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace", marginBottom: '10px' }}>CREATE ACCOUNT</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', letterSpacing: '2px', lineHeight: 1, color: '#fff' }}>SIGN UP</h1>
            <div style={{ width: '32px', height: '2px', background: 'linear-gradient(90deg, #a855f7, transparent)', marginTop: '8px' }} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: '10px', animation: 'fadeUp 0.6s ease both', animationDelay: '0.1s' }}>
              <label style={labelStyle}>FULL NAME</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>◈</span>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  style={{ ...inputStyle, padding: '12px 16px 12px 42px' }} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '10px', animation: 'fadeUp 0.6s ease both', animationDelay: '0.12s' }}>
              <label style={labelStyle}>EMAIL ADDRESS</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>✉</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@christuniversity.in" required
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  style={{ ...inputStyle, padding: '12px 16px 12px 42px' }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '10px', animation: 'fadeUp 0.6s ease both', animationDelay: '0.15s' }}>
              <label style={labelStyle}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>🔒</span>
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  style={{ ...inputStyle, padding: '12px 44px 12px 42px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '13px' }}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '10px', animation: 'fadeUp 0.6s ease both', animationDelay: '0.18s' }}>
              <label style={labelStyle}>CONFIRM PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>🔒</span>
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  style={{ ...inputStyle, padding: '12px 16px 12px 42px' }} />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: '12px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '2px', fontSize: '12px', color: 'rgba(239,68,68,0.9)', fontFamily: "'DM Sans', sans-serif" }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <div style={{ animation: 'fadeUp 0.6s ease both', animationDelay: '0.2s', marginBottom: '10px' }}>
              <button type="submit" disabled={isLoading}
                onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = '#e8e8e8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                style={{ width: '100%', background: '#fff', color: '#000', border: 'none', padding: '15px', fontFamily: "'Space Mono', monospace", fontSize: '13px', letterSpacing: '3px', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', borderRadius: '2px', transition: 'all 0.2s', opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace", letterSpacing: '2px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogleSignUp} disabled={isGoogleLoading}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', cursor: isGoogleLoading ? 'not-allowed' : 'pointer', borderRadius: '2px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isGoogleLoading ? 'Signing up...' : 'Sign up with Google'}
          </button>

          {/* Sign in link */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>Already have an account? </span>
            <button onClick={() => navigate('/sign-in')}
              onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
              style={{ fontSize: '13px', color: '#a855f7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", letterSpacing: '1px' }}>
              SIGN IN
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUp;
