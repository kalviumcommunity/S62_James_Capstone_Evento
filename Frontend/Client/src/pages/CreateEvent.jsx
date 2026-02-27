import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ─── Background Dot Canvas (no mouse — keeps thin base pulse) ─────────── */
const DotCanvas = () => {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const animRef = useRef(null);
  const S = 28;

  const buildDots = useCallback((W, H) => {
    const arr = [];
    for (let r = 0; r < Math.ceil(H / S) + 1; r++)
      for (let c = 0; c < Math.ceil(W / S) + 1; c++)
        arr.push({ x: c * S, y: r * S, b: 0.07 + Math.random() * 0.09, p: Math.random() * Math.PI * 2, ps: 0.005 + Math.random() * 0.007 });
    dotsRef.current = arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; buildDots(canvas.width, canvas.height); };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dotsRef.current.forEach(d => {
        d.p += d.ps;
        ctx.beginPath(); ctx.arc(d.x, d.y, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.b + Math.sin(d.p) * 0.04})`; ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, [buildDots]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

/* ─── Shared field styles ─────────────────────────────────────────────── */
const fieldBase = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  padding: '13px 16px',
  borderRadius: '2px',
  fontSize: '13px',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
};

const labelStyle = {
  display: 'block',
  fontSize: '10px',
  letterSpacing: '3px',
  color: 'rgba(255,255,255,0.35)',
  fontFamily: "'Space Mono', monospace",
  marginBottom: '8px',
};

const dividerStyle = { height: '1px', background: 'rgba(255,255,255,0.06)' };

const sectionHead = (icon, label, color) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
    <span style={{ color, fontSize: '14px' }}>{icon}</span>
    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.5)' }}>{label}</span>
  </div>
);

const focusOn = e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; e.currentTarget.style.background = 'rgba(168,85,247,0.03)'; };
const focusOff = e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; };

const DRAFT_KEY = 'evento_create_draft';

/* ─── CreateEvent ─────────────────────────────────────────────────────── */
const CreateEvent = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const emptyForm = { title: '', description: '', date: '', time: '', venue: '', organizer: '', contact: '', eventType: '', tags: '', registrationLink: '' };

  const [form, setForm] = useState(() => {
    try { const saved = localStorage.getItem(DRAFT_KEY); return saved ? JSON.parse(saved) : emptyForm; }
    catch { return emptyForm; }
  });
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error'|'draft', msg }
  const [hasDraft, setHasDraft] = useState(() => !!localStorage.getItem(DRAFT_KEY));

  const tagList = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  /* ── Poster file handling ── */
  const applyFile = file => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { showToast('error', 'File too large — max 10 MB.'); return; }
    setPoster(file);
    const reader = new FileReader();
    reader.onload = e => setPosterPreview(e.target.result);
    reader.readAsDataURL(file);
  };
  const clearPoster = e => { e.stopPropagation(); setPoster(null); setPosterPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  /* ── Draft ── */
  const saveDraft = () => {
    setIsSavingDraft(true);
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setHasDraft(true);
      showToast('draft', 'Draft saved! You can return later.');
    } catch { showToast('error', 'Could not save draft.'); }
    finally { setTimeout(() => setIsSavingDraft(false), 600); }
  };

  const clearDraft = () => { localStorage.removeItem(DRAFT_KEY); setHasDraft(false); setForm(emptyForm); setPoster(null); setPosterPreview(null); showToast('draft', 'Draft cleared.'); };

  /* ── Submit ── */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date || !form.time || !form.venue || !form.organizer || !form.eventType) {
      showToast('error', 'Please fill in all required fields.'); return;
    }
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (poster) fd.append('poster', poster, poster.name);

      await axios.post('http://localhost:3000/api/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
      showToast('success', 'Event created successfully!');
      setTimeout(() => navigate('/'), 1800);
    } catch (err) {
      showToast('error', err.response?.data?.message || err.message || 'Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const STYLES = `
    @keyframes scanlineEF{0%{top:-2px;}100%{top:100vh;}}
    @keyframes fadeUpEF{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
    @keyframes toastIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
    .ef-d1{animation:fadeUpEF 0.6s ease both;animation-delay:0.04s;}
    .ef-d2{animation:fadeUpEF 0.6s ease both;animation-delay:0.08s;}
    .ef-d3{animation:fadeUpEF 0.6s ease both;animation-delay:0.12s;}
    .ef-d4{animation:fadeUpEF 0.6s ease both;animation-delay:0.16s;}
    .ef-d5{animation:fadeUpEF 0.6s ease both;animation-delay:0.2s;}
    .ef-d6{animation:fadeUpEF 0.6s ease both;animation-delay:0.24s;}
    .ef-d7{animation:fadeUpEF 0.6s ease both;animation-delay:0.28s;}
    .ef-d8{animation:fadeUpEF 0.6s ease both;animation-delay:0.32s;}
    .ef-toast{animation:toastIn 0.3s ease both;}
    .ef-drop:hover,.ef-drop.over{border-color:rgba(168,85,247,0.5)!important;background:rgba(168,85,247,0.04)!important;}
    input[type="date"]::-webkit-calendar-picker-indicator,
    input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(0.4);cursor:pointer;}
    select option{background:#111;color:#fff;}
  `;

  const toastColors = { success: '#22c55e', error: '#ef4444', draft: '#a855f7' };
  const toastIcons = { success: '✓', error: '✕', draft: '⊹' };

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{STYLES}</style>
      <DotCanvas />

      {/* Scanline */}
      <div style={{ position: 'fixed', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.12),transparent)', animation: 'scanlineEF 8s linear infinite', pointerEvents: 'none', zIndex: 50 }} />
      {/* Radial glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'radial-gradient(ellipse 60% 50% at 50% 20%,rgba(168,85,247,0.06) 0%,transparent 70%)' }} />

      {/* Toast */}
      {toast && (
        <div className="ef-toast" style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,15,15,0.95)', border: `1px solid ${toastColors[toast.type]}44`, borderRadius: '2px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 999, backdropFilter: 'blur(12px)', boxShadow: `0 0 24px ${toastColors[toast.type]}22` }}>
          <span style={{ color: toastColors[toast.type], fontFamily: "'Space Mono', monospace" }}>{toastIcons[toast.type]}</span>
          <span style={{ fontSize: '13px', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>{toast.msg}</span>
        </div>
      )}

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, height: '56px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 40px', background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(20px)', zIndex: 100, justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'Space Mono', monospace", letterSpacing: '2px', cursor: 'pointer', transition: 'color 0.2s' }}>
          ← DASHBOARD
        </button>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '3px' }}>EVENTO</div>
        <div style={{ width: '100px', display: 'flex', justifyContent: 'flex-end' }}>
          {hasDraft && (
            <button onClick={clearDraft}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,100,100,0.9)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,100,100,0.5)'; }}
              style={{ background: 'none', border: 'none', fontSize: '10px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px', color: 'rgba(255,100,100,0.5)', cursor: 'pointer', transition: 'color 0.2s' }}>
              ✕ CLEAR DRAFT
            </button>
          )}
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 2, maxWidth: '780px', margin: '0 auto', padding: '48px 24px 100px' }}>

        {/* Page Header */}
        <div className="ef-d1" style={{ marginBottom: '40px' }}>
          {hasDraft && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '5px 12px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '2px' }}>
              <span style={{ color: '#a855f7', fontSize: '11px' }}>⊹</span>
              <span style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", letterSpacing: '2px', color: 'rgba(168,85,247,0.8)' }}>DRAFT LOADED</span>
            </div>
          )}
          <div style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace", marginBottom: '12px' }}>NEW EVENT</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,6vw,64px)', letterSpacing: '3px', lineHeight: 0.95 }}>
            <span style={{ display: 'block', color: '#fff' }}>CREATE</span>
            <span style={{ display: 'block', WebkitTextStroke: '1px rgba(255,255,255,0.25)', color: 'transparent' }}>EVENT</span>
          </h1>
          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #a855f7, transparent)', marginTop: '12px' }} />
        </div>

        {/* FORM CARD */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Step indicator */}
            <div className="ef-d1" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '2px', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>1</div>
                <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#a855f7', fontFamily: "'Space Mono', monospace" }}>EVENT DETAILS</span>
              </div>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)' }}>2</div>
                <span style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace" }}>MEDIA</span>
              </div>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.3)' }}>3</div>
                <span style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace" }}>PUBLISH</span>
              </div>
            </div>

            <div style={dividerStyle} />

            {/* ── Basic Info ── */}
            <div className="ef-d2">
              {sectionHead('◈', 'BASIC INFO', '#a855f7')}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>EVENT TITLE</label>
                <input name="title" value={form.title} onChange={handleChange} type="text" placeholder="e.g. Tech Summit 2025" style={fieldBase} onFocus={focusOn} onBlur={focusOff} required />
              </div>
              <div>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="What's this event about? Tell attendees why they should come..." style={{ ...fieldBase, resize: 'vertical', minHeight: '110px', lineHeight: 1.6 }} onFocus={focusOn} onBlur={focusOff} required />
              </div>
            </div>

            <div style={dividerStyle} />

            {/* ── Schedule ── */}
            <div className="ef-d3">
              {sectionHead('◷', 'SCHEDULE', '#06b6d4')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>DATE</label>
                  <input name="date" value={form.date} onChange={handleChange} type="date" style={fieldBase} onFocus={focusOn} onBlur={focusOff} required />
                </div>
                <div>
                  <label style={labelStyle}>TIME</label>
                  <input name="time" value={form.time} onChange={handleChange} type="time" style={fieldBase} onFocus={focusOn} onBlur={focusOff} required />
                </div>
              </div>
            </div>

            <div style={dividerStyle} />

            {/* ── Location & Organizer ── */}
            <div className="ef-d4">
              {sectionHead('◎', 'LOCATION & ORGANIZER', '#f59e0b')}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>VENUE</label>
                <input name="venue" value={form.venue} onChange={handleChange} type="text" placeholder="e.g. Bangalore International Centre" style={fieldBase} onFocus={focusOn} onBlur={focusOff} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>ORGANIZER <span style={{ color: '#a855f7' }}>*</span></label>
                  <input name="organizer" value={form.organizer} onChange={handleChange} type="text" placeholder="Organizer name" style={fieldBase} onFocus={focusOn} onBlur={focusOff} required />
                </div>
                <div>
                  <label style={labelStyle}>CONTACT INFO</label>
                  <input name="contact" value={form.contact} onChange={handleChange} type="text" placeholder="Email or phone" style={fieldBase} onFocus={focusOn} onBlur={focusOff} />
                </div>
              </div>
            </div>

            <div style={dividerStyle} />

            {/* ── Classification ── */}
            <div className="ef-d5">
              {sectionHead('⊹', 'CLASSIFICATION', '#6366f1')}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>EVENT TYPE</label>
                <select name="eventType" value={form.eventType} onChange={handleChange} style={fieldBase} onFocus={focusOn} onBlur={focusOff} required>
                  <option value="" disabled>Select a category</option>
                  <option value="Drama">Drama</option>
                  <option value="Music">Music</option>
                  <option value="Technology">Technology</option>
                  <option value="Sports">Sports</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>
                  TAGS <span style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', fontSize: '9px' }}>(COMMA-SEPARATED)</span>
                </label>
                <input name="tags" value={form.tags} onChange={handleChange} type="text" placeholder="e.g. music, fest, cultural, free" style={fieldBase} onFocus={focusOn} onBlur={focusOff} />
                {tagList.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {tagList.map((t, i) => (
                      <span key={i} style={{ padding: '3px 10px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', color: 'rgba(168,85,247,0.8)', borderRadius: '2px', fontSize: '10px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={dividerStyle} />

            {/* ── Registration ── */}
            <div className="ef-d6">
              {sectionHead('✦', 'REGISTRATION', 'rgba(34,197,94,0.8)')}
              <div>
                <label style={labelStyle}>REGISTRATION LINK</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', fontSize: '12px', fontFamily: "'Space Mono', monospace", pointerEvents: 'none' }}>https://</span>
                  <input name="registrationLink" value={form.registrationLink} onChange={handleChange} type="text" placeholder="your-registration-link.com" style={{ ...fieldBase, paddingLeft: '76px' }} onFocus={focusOn} onBlur={focusOff} />
                </div>
              </div>
            </div>

            <div style={dividerStyle} />

            {/* ── Upload Poster ── */}
            <div className="ef-d7">
              {sectionHead('⊡', 'UPLOAD POSTER', 'rgba(255,255,255,0.4)')}
              <div
                className={`ef-drop${isDragOver ? ' over' : ''}`}
                onClick={() => !posterPreview && fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={e => { e.preventDefault(); setIsDragOver(false); applyFile(e.dataTransfer.files[0]); }}
                style={{ border: '1px dashed rgba(255,255,255,0.12)', borderRadius: '2px', background: 'rgba(255,255,255,0.02)', padding: '40px 20px', textAlign: 'center', cursor: posterPreview ? 'default' : 'pointer', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
              >
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => applyFile(e.target.files[0])} />

                {!posterPreview ? (
                  <>
                    <div style={{ marginBottom: '14px' }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto', display: 'block' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 15l5-5 4 4 3-3 6 6" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <line x1="12" y1="8" x2="12" y2="4" /><line x1="10" y1="6" x2="14" y2="6" />
                      </svg>
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                      <span style={{ color: '#a855f7', fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '1px', cursor: 'pointer' }}>BROWSE FILE</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}> or drag and drop</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: "'Space Mono', monospace", letterSpacing: '1px' }}>PNG · JPG · GIF · UP TO 10MB</div>
                  </>
                ) : (
                  <>
                    <img src={posterPreview} alt="poster preview" style={{ maxHeight: '160px', maxWidth: '100%', borderRadius: '2px', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                    <div style={{ marginTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace" }}>{poster?.name?.toUpperCase()}</div>
                    <button type="button" onClick={clearPoster} style={{ marginTop: '8px', background: 'transparent', border: '1px solid rgba(255,80,80,0.25)', color: 'rgba(255,100,100,0.6)', padding: '5px 14px', borderRadius: '2px', cursor: 'pointer', fontSize: '10px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px' }}>
                      ✕ REMOVE
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="ef-d8" style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
              <button type="submit" disabled={isSubmitting}
                onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = '#e0e0e0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                style={{ flex: 1, background: '#fff', color: '#000', border: 'none', padding: '16px', fontFamily: "'Space Mono', monospace", fontSize: '13px', letterSpacing: '3px', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: '2px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'CREATING...' : '⊕ CREATE EVENT'}
              </button>
              <button type="button" onClick={saveDraft} disabled={isSavingDraft}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'; e.currentTarget.style.color = '#a855f7'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                style={{ padding: '16px 28px', background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '2px', cursor: isSavingDraft ? 'not-allowed' : 'pointer', borderRadius: '2px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                {isSavingDraft ? 'SAVING...' : '⊹ SAVE DRAFT'}
              </button>
            </div>

          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateEvent;
