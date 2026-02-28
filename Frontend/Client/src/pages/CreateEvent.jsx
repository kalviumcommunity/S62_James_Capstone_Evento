import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'https://s62-james-capstone-evento.onrender.com';

/* ── Dot canvas background ──────────────────────────────────────────────── */
const DotCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dots = [], anim;
    const S = 28;
    const build = (W, H) => {
      dots = [];
      for (let r = 0; r < Math.ceil(H / S) + 1; r++)
        for (let c = 0; c < Math.ceil(W / S) + 1; c++)
          dots.push({ x: c * S, y: r * S, b: .06 + Math.random() * .08, p: Math.random() * Math.PI * 2, ps: .004 + Math.random() * .007 });
    };
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; build(canvas.width, canvas.height); };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => { d.p += d.ps; ctx.beginPath(); ctx.arc(d.x, d.y, 1, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${d.b + Math.sin(d.p) * .03})`; ctx.fill(); });
      anim = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(anim); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

/* ── Chip component ─────────────────────────────────────────────────────── */
const Chip = ({ label, onRemove, variant = '' }) => {
  const styles = {
    '': { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.28)', color: 'rgba(168,85,247,0.9)' },
    theme: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', color: 'rgba(6,182,212,0.9)' },
    note: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: 'rgba(245,158,11,0.9)' },
  }[variant] || {};
  return (
    <span style={{
      display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px',
      background: styles.bg, border: `1px solid ${styles.border}`, color: styles.color,
      borderRadius: 2, fontSize: 11, fontFamily: "'Space Mono',monospace", whiteSpace: 'nowrap'
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 12, lineHeight: 1, padding: 0, opacity: .7 }}>✕</button>
    </span>
  );
};

/* ── Chip input row ─────────────────────────────────────────────────────── */
const ChipInput = ({ chips, setChips, placeholder, variant }) => {
  const [val, setVal] = useState('');
  const add = () => {
    const v = val.trim(); if (!v) return;
    setChips(p => [...p, v]); setVal('');
  };
  return (
    <div onClick={e => e.currentTarget.querySelector('input').focus()}
      style={{
        display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 2, padding: '8px 10px', minHeight: 44, cursor: 'text', transition: 'border-color 0.2s'
      }}>
      {chips.map((c, i) => <Chip key={i} label={c} variant={variant} onRemove={() => setChips(p => p.filter((_, j) => j !== i))} />)}
      <input value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        placeholder={placeholder}
        style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 12, minWidth: 120, flex: 1, padding: '2px 4px', fontFamily: "'DM Sans',sans-serif" }} />
    </div>
  );
};

/* ── Toggle ─────────────────────────────────────────────────────────────── */
const Toggle = ({ checked, onChange, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
    <label style={{ position: 'relative', width: 40, height: 22, flexShrink: 0 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
      <span style={{
        position: 'absolute', inset: 0, borderRadius: 20, cursor: 'pointer', transition: 'all .25s',
        background: checked ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.1)',
        border: checked ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.12)',
      }}>
        <span style={{
          position: 'absolute', width: 16, height: 16, borderRadius: '50%', top: 2, transition: 'all .25s',
          left: checked ? 22 : 2,
          background: checked ? '#a855f7' : 'rgba(255,255,255,0.4)',
        }} />
      </span>
    </label>
  </div>
);

/* ── Section wrapper ─────────────────────────────────────────────────────── */
const Section = ({ icon, iconColor, title, children }) => (
  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ color: iconColor, fontSize: 14 }}>{icon}</span>
      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.5)' }}>{title}</span>
    </div>
    {children}
  </div>
);

/* ── Label ───────────────────────────────────────────────────────────────── */
const Lbl = ({ children }) => (
  <label style={{ display: 'block', fontSize: 10, letterSpacing: '2.5px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono',monospace", marginBottom: 7 }}>
    {children}
  </label>
);
const Req = () => <span style={{ color: '#a855f7' }}> *</span>;
const Opt = () => <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9, letterSpacing: 1 }}> OPTIONAL</span>;

const fieldSt = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 14px', borderRadius: 2, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: 'none', transition: 'border-color .2s,background .2s' };
const onF = e => { e.target.style.borderColor = 'rgba(168,85,247,0.5)'; e.target.style.background = 'rgba(168,85,247,0.03)'; };
const offF = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; };

/* ── Remove button (repeatable rows) ─────────────────────────────────────── */
const RemoveBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ width: 30, height: 30, flexShrink: 0, background: 'transparent', border: '1px solid rgba(255,80,80,0.2)', color: 'rgba(255,100,100,0.5)', borderRadius: 2, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,80,80,0.5)'; e.currentTarget.style.color = 'rgba(255,100,100,0.9)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,80,80,0.2)'; e.currentTarget.style.color = 'rgba(255,100,100,0.5)'; }}>
    ✕
  </button>
);

const AddBtn = ({ onClick, label }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: '1px dashed rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.35)', padding: '9px 14px', borderRadius: 2, cursor: 'pointer', fontSize: 12, fontFamily: "'Space Mono',monospace", letterSpacing: 1, transition: 'all .2s', width: 'fit-content' }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'; e.currentTarget.style.color = 'rgba(168,85,247,0.7)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}>
    ⊕ {label}
  </button>
);

/* ═══════════════════════════════════════════════════════════════════════════
   CreateEvent
═══════════════════════════════════════════════════════════════════════════ */
const CreateEvent = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /* ── Form state ── */
  const [form, setForm] = useState({
    title: '', subtitle: '', description: '', eventType: '', level: '',
    startDate: '', endDate: '', startTime: '', endTime: '', duration: '', deadline: '',
    venue: '', campus: '', city: '', streamLink: '',
    organizer: '', department: '', institution: '',
    registrationLink: '', eventWebsite: '',
    entryFee: '', prizePool: '',
  });
  const [tags, setTags] = useState([]);
  const [themes, setThemes] = useState([]);
  const [importantNotes, setImportantNotes] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [contacts, setContacts] = useState([{ name: '', phone: '' }]);
  const [speakers, setSpeakers] = useState([]);
  const [isFree, setIsFree] = useState(true);
  const [hasPrizes, setHasPrizes] = useState(false);
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const setField = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  /* ── Poster handling ── */
  const applyFile = file => {
    if (!file?.type.startsWith('image/')) { showToast('error', 'Please select an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { showToast('error', 'Poster must be under 10 MB.'); return; }
    setPoster(file);
    setPosterPreview(URL.createObjectURL(file));
  };
  const clearPoster = e => { e.stopPropagation(); setPoster(null); setPosterPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  /* ── Contacts ── */
  const addContact = () => setContacts(p => [...p, { name: '', phone: '' }]);
  const updateContact = (i, key, val) => setContacts(p => p.map((c, j) => j === i ? { ...c, [key]: val } : c));
  const removeContact = i => setContacts(p => p.filter((_, j) => j !== i));

  /* ── Speakers ── */
  const addSpeaker = () => setSpeakers(p => [...p, { name: '', designation: '' }]);
  const updateSpeaker = (i, key, val) => setSpeakers(p => p.map((s, j) => j === i ? { ...s, [key]: val } : s));
  const removeSpeaker = i => setSpeakers(p => p.filter((_, j) => j !== i));

  /* ── Submit ── */
  const handleSubmit = async (status = 'Upcoming') => {
    if (!form.title || !form.description || !form.eventType || !form.startDate || !form.startTime || !form.venue || !form.organizer) {
      showToast('error', 'Please fill in all required fields.'); return;
    }
    if (status !== 'Draft' && !poster) {
      showToast('error', 'Please upload a poster image.'); return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('tags', tags.join(','));
      fd.append('themes', themes.join(','));
      fd.append('importantNotes', importantNotes.join(','));
      fd.append('prizes', prizes.join(','));
      fd.append('contacts', JSON.stringify(contacts.filter(c => c.name.trim())));
      fd.append('speakers', JSON.stringify(speakers.filter(s => s.name.trim())));
      fd.append('isFree', String(isFree));
      fd.append('hasPrizes', String(hasPrizes));
      fd.append('status', status);
      if (poster) fd.append('poster', poster, poster.name);

      await axios.post(`${API}/api/events`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('success', status === 'Draft' ? 'Draft saved!' : 'Event created!');
      setTimeout(() => navigate('/'), 1600);
    } catch (err) {
      showToast('error', err.response?.data?.message || err.message || 'Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const GRID2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };
  const GRID3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 };

  const toastColor = { success: '#22c55e', error: '#ef4444', draft: '#a855f7' };

  const MOBILE_CSS = `
    @media (max-width:768px) {
      .ce-grid2,.ce-grid3{grid-template-columns:1fr!important;}
      .ce-main{padding:28px 14px 80px!important;}
      .ce-h1{font-size:40px!important;}
    }
    @keyframes scanlineCE{0%{top:-2px}100%{top:100vh}}
    @keyframes fadeUpCE{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    .ce-fade{animation:fadeUpCE .5s ease both;}
    input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2);}
    input[type="date"]::-webkit-calendar-picker-indicator,
    input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(0.35);cursor:pointer;}
    select option{background:#111;}
  `;

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans',sans-serif", minHeight: '100vh' }}>
      <style>{MOBILE_CSS}</style>
      <DotCanvas />
      <div style={{ position: 'fixed', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.1),transparent)', animation: 'scanlineCE 8s linear infinite', pointerEvents: 'none', zIndex: 50 }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'radial-gradient(ellipse 60% 40% at 50% 10%,rgba(168,85,247,0.05),transparent 70%)' }} />

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,15,15,0.95)', border: `1px solid ${toastColor[toast.type]}44`, borderRadius: 2, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 999, backdropFilter: 'blur(12px)' }}>
          <span style={{ color: toastColor[toast.type], fontFamily: "'Space Mono',monospace" }}>{toast.type === 'error' ? '✕' : '✓'}</span>
          <span style={{ fontSize: 13 }}>{toast.msg}</span>
        </div>
      )}

      <main className="ce-main" style={{ position: 'relative', zIndex: 2, maxWidth: 760, margin: '0 auto', padding: '40px 24px 100px' }}>

        {/* Header */}
        <div className="ce-fade" style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono',monospace", marginBottom: 10 }}>NEW EVENT</div>
          <h1 className="ce-h1" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(40px,6vw,62px)', letterSpacing: 3, lineHeight: .95 }}>
            <span style={{ display: 'block' }}>CREATE</span>
            <span style={{ display: 'block', WebkitTextStroke: '1px rgba(255,255,255,0.22)', color: 'transparent' }}>EVENT</span>
          </h1>
          <div style={{ width: 36, height: 2, background: 'linear-gradient(90deg,#a855f7,transparent)', marginTop: 10 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── 1. BASICS ── */}
          <Section icon="◈" iconColor="#a855f7" title="BASICS">
            <div><Lbl>EVENT TITLE<Req /></Lbl>
              <input name="title" value={form.title} onChange={setField} type="text" placeholder="e.g. VIBEXATHON 1.0 – 24 Hour State Level Hackathon" style={fieldSt} onFocus={onF} onBlur={offF} /></div>

            <div><Lbl>TAGLINE<Opt /></Lbl>
              <input name="subtitle" value={form.subtitle} onChange={setField} type="text" placeholder='e.g. "Innovate. Build. Compete."' style={fieldSt} onFocus={onF} onBlur={offF} /></div>

            <div><Lbl>DESCRIPTION<Req /></Lbl>
              <textarea name="description" value={form.description} onChange={setField} placeholder="Tell people what this event is about, who it's for, and why they should attend..." style={{ ...fieldSt, resize: 'vertical', minHeight: 100, lineHeight: 1.6 }} onFocus={onF} onBlur={offF} /></div>

            <div className="ce-grid2" style={GRID2}>
              <div><Lbl>EVENT TYPE<Req /></Lbl>
                <select name="eventType" value={form.eventType} onChange={setField} style={fieldSt} onFocus={onF} onBlur={offF}>
                  <option value="" disabled>Select type</option>
                  {['Cultural', 'Technical', 'Hackathon', 'Talk / Seminar', 'Workshop', 'Film / Media', 'Music', 'Drama', 'Sports', 'Other'].map(t => <option key={t}>{t}</option>)}
                </select></div>
              <div><Lbl>LEVEL<Opt /></Lbl>
                <select name="level" value={form.level} onChange={setField} style={fieldSt} onFocus={onF} onBlur={offF}>
                  <option value="">Select level</option>
                  {['College', 'Inter-College', 'State', 'National', 'International'].map(l => <option key={l}>{l}</option>)}
                </select></div>
            </div>

            <div><Lbl>TAGS<span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}> PRESS ENTER TO ADD</span></Lbl>
              <ChipInput chips={tags} setChips={setTags} placeholder="e.g. free-entry, open-to-all, coding..." variant="" /></div>

            <div><Lbl>THEMES / TRACKS<Opt /><span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}> · PRESS ENTER</span></Lbl>
              <ChipInput chips={themes} setChips={setThemes} placeholder="e.g. AI / ML, Smart City, Open Innovation..." variant="theme" /></div>
          </Section>

          {/* ── 2. DATE, TIME & DEADLINE ── */}
          <Section icon="◷" iconColor="#06b6d4" title="DATE, TIME & DEADLINE">
            <div className="ce-grid3" style={GRID3}>
              <div><Lbl>START DATE<Req /></Lbl><input name="startDate" value={form.startDate} onChange={setField} type="date" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
              <div><Lbl>END DATE<span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}> MULTI-DAY</span></Lbl><input name="endDate" value={form.endDate} onChange={setField} type="date" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
              <div><Lbl>REG. DEADLINE</Lbl><input name="deadline" value={form.deadline} onChange={setField} type="date" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
            </div>
            <div className="ce-grid3" style={GRID3}>
              <div><Lbl>START TIME<Req /></Lbl><input name="startTime" value={form.startTime} onChange={setField} type="time" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
              <div><Lbl>END TIME<Opt /></Lbl><input name="endTime" value={form.endTime} onChange={setField} type="time" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
              <div><Lbl>DURATION<Opt /></Lbl><input name="duration" value={form.duration} onChange={setField} type="text" placeholder='e.g. "24 Hours"' style={fieldSt} onFocus={onF} onBlur={offF} /></div>
            </div>
            <div><Lbl>IMPORTANT NOTES<span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}> PRESS ENTER TO ADD</span></Lbl>
              <ChipInput chips={importantNotes} setChips={setImportantNotes} placeholder='e.g. "Bring your college ID", "Certificate provided"...' variant="note" /></div>
          </Section>

          {/* ── 3. LOCATION ── */}
          <Section icon="◎" iconColor="#f59e0b" title="LOCATION">
            <div className="ce-grid3" style={GRID3}>
              <div><Lbl>VENUE / HALL<Req /></Lbl><input name="venue" value={form.venue} onChange={setField} type="text" placeholder="e.g. Block I Auditorium" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
              <div><Lbl>CAMPUS<Opt /></Lbl><input name="campus" value={form.campus} onChange={setField} type="text" placeholder="e.g. Kengeri Campus" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
              <div><Lbl>CITY</Lbl><input name="city" value={form.city} onChange={setField} type="text" placeholder="e.g. Bengaluru" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
            </div>
            <div><Lbl>LIVE STREAM LINK<Opt /></Lbl>
              <input name="streamLink" value={form.streamLink} onChange={setField} type="url" placeholder="YouTube / Zoom / Meet link (if streaming)" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
          </Section>

          {/* ── 4. ORGANISER ── */}
          <Section icon="⊹" iconColor="#6366f1" title="ORGANISER">
            <div className="ce-grid3" style={GRID3}>
              <div><Lbl>CLUB / COUNCIL<Req /></Lbl><input name="organizer" value={form.organizer} onChange={setField} type="text" placeholder="e.g. ASCII, IEEE CS, USC" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
              <div><Lbl>DEPARTMENT<Opt /></Lbl><input name="department" value={form.department} onChange={setField} type="text" placeholder="e.g. Dept. of CSE (Data Science)" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
              <div><Lbl>INSTITUTION<Opt /></Lbl><input name="institution" value={form.institution} onChange={setField} type="text" placeholder="e.g. Christ University" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
            </div>

            <div>
              <Lbl>CONTACTS FOR QUERIES</Lbl>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {contacts.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input value={c.name} onChange={e => updateContact(i, 'name', e.target.value)} placeholder="Name" style={{ ...fieldSt, maxWidth: 180, flex: '0 0 180px' }} onFocus={onF} onBlur={offF} />
                    <input value={c.phone} onChange={e => updateContact(i, 'phone', e.target.value)} placeholder="Phone or Email" style={{ ...fieldSt, flex: 1 }} onFocus={onF} onBlur={offF} />
                    <RemoveBtn onClick={() => removeContact(i)} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10 }}><AddBtn onClick={addContact} label="ADD CONTACT" /></div>
            </div>

            <div>
              <Lbl>SPEAKERS / GUESTS<Opt /></Lbl>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {speakers.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input value={s.name} onChange={e => updateSpeaker(i, 'name', e.target.value)} placeholder="Name" style={{ ...fieldSt, maxWidth: 160, flex: '0 0 160px' }} onFocus={onF} onBlur={offF} />
                    <input value={s.designation} onChange={e => updateSpeaker(i, 'designation', e.target.value)} placeholder="Designation & Organisation" style={{ ...fieldSt, flex: 1 }} onFocus={onF} onBlur={offF} />
                    <RemoveBtn onClick={() => removeSpeaker(i)} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10 }}><AddBtn onClick={addSpeaker} label="ADD SPEAKER" /></div>
            </div>
          </Section>

          {/* ── 5. REGISTRATION & PRIZES ── */}
          <Section icon="✦" iconColor="rgba(34,197,94,0.8)" title="REGISTRATION & PRIZES">
            <div className="ce-grid2" style={GRID2}>
              <div><Lbl>REGISTRATION LINK</Lbl>
                <input name="registrationLink" value={form.registrationLink} onChange={setField} type="url" placeholder="Google Form / Unstop / Devfolio URL" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
              <div><Lbl>EVENT WEBSITE<Opt /></Lbl>
                <input name="eventWebsite" value={form.eventWebsite} onChange={setField} type="url" placeholder="e.g. vibexathon.in" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
            </div>

            <Toggle checked={isFree} onChange={setIsFree} label="Free Event" />

            {!isFree && (
              <div style={{ animation: 'fadeUpCE .3s ease' }}>
                <Lbl>ENTRY FEE (₹)</Lbl>
                <input name="entryFee" value={form.entryFee} onChange={setField} type="number" placeholder="e.g. 199" min="0" style={fieldSt} onFocus={onF} onBlur={offF} />
              </div>
            )}

            <Toggle checked={hasPrizes} onChange={setHasPrizes} label="This event has prizes" />

            {hasPrizes && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUpCE .3s ease' }}>
                <div><Lbl>TOTAL PRIZE POOL (₹)</Lbl>
                  <input name="prizePool" value={form.prizePool} onChange={setField} type="number" placeholder="e.g. 50000" min="0" style={fieldSt} onFocus={onF} onBlur={offF} /></div>
                <div><Lbl>PRIZE BREAKDOWN<span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}> PRESS ENTER TO ADD</span></Lbl>
                  <ChipInput chips={prizes} setChips={setPrizes} placeholder='e.g. "1st: ₹25,000", "2nd: ₹15,000"...' variant="" /></div>
              </div>
            )}
          </Section>

          {/* ── 6. POSTER ── */}
          <Section icon="⊡" iconColor="rgba(255,255,255,0.35)" title="POSTER / BANNER">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); applyFile(e.dataTransfer.files[0]); }}
              style={{ border: `1px dashed ${isDragging ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 2, background: isDragging ? 'rgba(168,85,247,0.03)' : 'rgba(255,255,255,0.02)', padding: '32px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all .25s', position: 'relative' }}>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => applyFile(e.target.files[0])} />
              {posterPreview ? (
                <>
                  <img src={posterPreview} alt="preview" style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 2, objectFit: 'contain' }} />
                  <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono',monospace" }}>{poster?.name?.toUpperCase()}</div>
                  <button onClick={clearPoster} style={{ marginTop: 8, background: 'transparent', border: '1px solid rgba(255,80,80,0.25)', color: 'rgba(255,100,100,0.6)', padding: '5px 12px', borderRadius: 2, cursor: 'pointer', fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1 }}>✕ REMOVE</button>
                </>
              ) : (
                <>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" style={{ margin: '0 auto 12px', display: 'block' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 15l5-5 4 4 3-3 6 6" /><circle cx="8.5" cy="8.5" r="1.5" />
                  </svg>
                  <span style={{ color: '#a855f7', fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 1 }}>BROWSE FILE</span>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}> or drag and drop</span>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', fontFamily: "'Space Mono',monospace", marginTop: 6, letterSpacing: 1 }}>PNG · JPG · GIF · UP TO 10MB</div>
                </>
              )}
            </div>
          </Section>

          {/* ── Submit row ── */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <button onClick={() => handleSubmit('Upcoming')} disabled={isSubmitting}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = '#e0e0e0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              style={{ flex: 1, background: '#fff', color: '#000', border: 'none', padding: 15, fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: 3, fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: 2, transition: 'background .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: isSubmitting ? .7 : 1 }}>
              {isSubmitting ? '...' : '⊕ CREATE EVENT'}
            </button>
            <button onClick={() => handleSubmit('Draft')} disabled={isSubmitting}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
              style={{ padding: '15px 24px', background: 'transparent', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 2, cursor: 'pointer', borderRadius: 2, transition: 'all .2s', whiteSpace: 'nowrap' }}>
              SAVE DRAFT
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
