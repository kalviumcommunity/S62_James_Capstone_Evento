import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

/* ─── Background Dot Canvas ────────────────────────────────────────────── */
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
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; buildDots(canvas.width, canvas.height); };
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dotsRef.current.forEach(d => { d.p += d.ps; ctx.beginPath(); ctx.arc(d.x, d.y, 1.1, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${d.b + Math.sin(d.p) * 0.04})`; ctx.fill(); });
            animRef.current = requestAnimationFrame(draw);
        };
        resize(); draw();
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
    }, [buildDots]);
    return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

/* ─── Shared styles ───────────────────────────────────────────────────── */
const fieldBase = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '13px 16px', borderRadius: '2px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color 0.2s, background 0.2s' };
const labelStyle = { display: 'block', fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono', monospace", marginBottom: '8px' };
const dividerStyle = { height: '1px', background: 'rgba(255,255,255,0.06)' };
const focusOn = e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; e.currentTarget.style.background = 'rgba(168,85,247,0.03)'; };
const focusOff = e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; };
const sectionHead = (icon, label, color) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ color, fontSize: '14px' }}>{icon}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.5)' }}>{label}</span>
    </div>
);

const STYLES = `
  @keyframes scanlineEE{0%{top:-2px;}100%{top:100vh;}}
  @keyframes fadeUpEE{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes toastInEE{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
  .ee-d1{animation:fadeUpEE 0.6s ease both;animation-delay:0.04s;}
  .ee-d2{animation:fadeUpEE 0.6s ease both;animation-delay:0.08s;}
  .ee-d3{animation:fadeUpEE 0.6s ease both;animation-delay:0.12s;}
  .ee-d4{animation:fadeUpEE 0.6s ease both;animation-delay:0.16s;}
  .ee-d5{animation:fadeUpEE 0.6s ease both;animation-delay:0.2s;}
  .ee-d6{animation:fadeUpEE 0.6s ease both;animation-delay:0.24s;}
  .ee-d7{animation:fadeUpEE 0.6s ease both;animation-delay:0.28s;}
  .ee-d8{animation:fadeUpEE 0.6s ease both;animation-delay:0.32s;}
  .ee-toast{animation:toastInEE 0.3s ease both;}
  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(0.4);cursor:pointer;}
  select option{background:#111;color:#fff;}
`;

/* ─── EditEvent ───────────────────────────────────────────────────────── */
const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const emptyForm = { title: '', description: '', date: '', time: '', venue: '', organizer: '', contact: '', eventType: '', tags: '', registrationLink: '' };
    const [form, setForm] = useState(emptyForm);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [existingImage, setExistingImage] = useState(null);

    const tagList = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3500); };
    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    /* ── Load existing event data ── */
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/api/events`);
                const ev = data.find(e => e._id === id);
                if (!ev) { showToast('error', 'Event not found.'); setIsLoading(false); return; }
                setForm({
                    title: ev.title || '',
                    description: ev.description || '',
                    date: ev.date ? ev.date.slice(0, 10) : '',
                    time: ev.time || '',
                    venue: ev.venue || '',
                    organizer: ev.organizer || '',
                    contact: ev.contact || '',
                    eventType: ev.eventType || '',
                    tags: Array.isArray(ev.tags) ? ev.tags.join(', ') : (ev.tags || ''),
                    registrationLink: ev.registrationLink || '',
                });
                setExistingImage(ev.image || null);
            } catch (err) {
                showToast('error', 'Failed to load event data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    /* ── Submit update ── */
    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.title || !form.description || !form.date || !form.time || !form.venue || !form.organizer || !form.eventType) {
            showToast('error', 'Please fill in all required fields.'); return;
        }
        setIsSubmitting(true);
        try {
            const payload = { ...form, tags: form.tags };
            await axios.put(`http://localhost:3000/api/events/${id}`, payload);
            showToast('success', 'Event updated successfully!');
            setTimeout(() => navigate('/'), 1800);
        } catch (err) {
            showToast('error', err.response?.data?.message || err.message || 'Failed to update event.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toastColors = { success: '#22c55e', error: '#ef4444' };
    const toastIcons = { success: '✓', error: '✕' };

    return (
        <div style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
            <style>{STYLES}</style>
            <DotCanvas />

            {/* Scanline */}
            <div style={{ position: 'fixed', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.12),transparent)', animation: 'scanlineEE 8s linear infinite', pointerEvents: 'none', zIndex: 50 }} />
            {/* Radial glow */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'radial-gradient(ellipse 60% 50% at 50% 20%,rgba(168,85,247,0.06) 0%,transparent 70%)' }} />

            {/* Toast */}
            {toast && (
                <div className="ee-toast" style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,15,15,0.95)', border: `1px solid ${toastColors[toast.type]}44`, borderRadius: '2px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 999, backdropFilter: 'blur(12px)' }}>
                    <span style={{ color: toastColors[toast.type], fontFamily: "'Space Mono', monospace" }}>{toastIcons[toast.type]}</span>
                    <span style={{ fontSize: '13px', color: '#fff' }}>{toast.msg}</span>
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
                <div style={{ width: '100px' }} />
            </nav>

            <main style={{ position: 'relative', zIndex: 2, maxWidth: '780px', margin: '0 auto', padding: '48px 24px 100px' }}>

                {/* Page Header */}
                <div className="ee-d1" style={{ marginBottom: '40px' }}>
                    <div style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace", marginBottom: '12px' }}>EDITING EVENT</div>
                    <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,6vw,64px)', letterSpacing: '3px', lineHeight: 0.95 }}>
                        <span style={{ display: 'block', color: '#fff' }}>EDIT</span>
                        <span style={{ display: 'block', WebkitTextStroke: '1px rgba(255,255,255,0.25)', color: 'transparent' }}>EVENT</span>
                    </h1>
                    <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #a855f7, transparent)', marginTop: '12px' }} />
                </div>

                {/* Loading state */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '3px' }}>
                        <div style={{ fontSize: '28px', marginBottom: '16px', opacity: 0.3 }}>◈</div>
                        LOADING EVENT DATA...
                    </div>
                ) : (
                    /* FORM CARD */
                    <form onSubmit={handleSubmit}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

                            {/* Existing poster preview */}
                            {existingImage && (
                                <div className="ee-d1" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '2px' }}>
                                    <img src={existingImage} alt="current poster" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#a855f7', fontFamily: "'Space Mono', monospace", marginBottom: '4px' }}>CURRENT POSTER</div>
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Poster image is kept as-is. Re-upload via Create Event to change it.</div>
                                    </div>
                                </div>
                            )}

                            <div style={dividerStyle} />

                            {/* ── Basic Info ── */}
                            <div className="ee-d2">
                                {sectionHead('◈', 'BASIC INFO', '#a855f7')}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>EVENT TITLE</label>
                                    <input name="title" value={form.title} onChange={handleChange} type="text" placeholder="e.g. Tech Summit 2025" style={fieldBase} onFocus={focusOn} onBlur={focusOff} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>DESCRIPTION</label>
                                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="What's this event about?" style={{ ...fieldBase, resize: 'vertical', minHeight: '110px', lineHeight: 1.6 }} onFocus={focusOn} onBlur={focusOff} required />
                                </div>
                            </div>

                            <div style={dividerStyle} />

                            {/* ── Schedule ── */}
                            <div className="ee-d3">
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
                            <div className="ee-d4">
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
                            <div className="ee-d5">
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
                                    <label style={labelStyle}>TAGS <span style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', fontSize: '9px' }}>(COMMA-SEPARATED)</span></label>
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
                            <div className="ee-d6">
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

                            {/* ── Action Buttons ── */}
                            <div className="ee-d8" style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                                <button type="submit" disabled={isSubmitting}
                                    onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = '#e0e0e0'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                                    style={{ flex: 1, background: '#fff', color: '#000', border: 'none', padding: '16px', fontFamily: "'Space Mono', monospace", fontSize: '13px', letterSpacing: '3px', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: '2px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: isSubmitting ? 0.7 : 1 }}>
                                    {isSubmitting ? 'UPDATING...' : '✎ UPDATE EVENT'}
                                </button>
                                <button type="button" onClick={() => navigate('/')}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                                    style={{ padding: '16px 28px', background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', borderRadius: '2px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                                    CANCEL
                                </button>
                            </div>

                        </div>
                    </form>
                )}
            </main>
        </div>
    );
};

export default EditEvent;
