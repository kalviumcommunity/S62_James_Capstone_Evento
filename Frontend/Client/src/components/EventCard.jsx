import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getFormattedDate, getFormattedTime } from '../utils/formatDate';

const API = import.meta.env.VITE_API_URL || 'https://s62-james-capstone-evento.onrender.com';

const CAT_COLORS = {
  drama: '#a855f7', other: '#6366f1', technical: '#06b6d4', technology: '#06b6d4',
  hackathon: '#f59e0b', music: '#f59e0b', 'talk / seminar': '#3b82f6',
  workshop: '#22c55e', cultural: '#f97316', sports: '#22c55e',
  'film / media': '#ec4899', seminar: '#3b82f6',
};
const getCatColor = (type = '') => CAT_COLORS[type.toLowerCase()] || '#a855f7';

/* ── Three-dot menu ─────────────────────────────────────────────────────── */
const CardMenu = ({ eventId, onDelete }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setConfirm(false); } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDelete = async e => {
    e.stopPropagation();
    if (!confirm) { setConfirm(true); return; }
    setDeleting(true);
    try {
      await axios.delete(`${API}/api/events/${eventId}`);
      onDelete(eventId);
    } catch {
      alert('Failed to delete event. Please try again.');
    } finally { setDeleting(false); setConfirm(false); setOpen(false); }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* ⋮ trigger — always visible on mobile (see CSS below) */}
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); setConfirm(false); }}
        className="card-menu-btn"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: 2, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, transition: 'all .15s', flexShrink: 0 }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        aria-label="Options">
        ⋮
      </button>

      {open && (
        <div onClick={e => e.stopPropagation()}
          style={{ position: 'absolute', top: 36, right: 0, width: 148, background: 'rgba(14,14,14,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', zIndex: 200, backdropFilter: 'blur(16px)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
          <button onClick={e => { e.stopPropagation(); navigate(`/edit-event/${eventId}`); setOpen(false); }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.1)'; e.currentTarget.style.color = '#a855f7'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', padding: '10px 14px', cursor: 'pointer', fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: 13 }}>✎</span> EDIT
          </button>
          <button onClick={handleDelete} disabled={deleting}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: confirm ? '#ef4444' : 'rgba(255,100,100,0.65)', padding: '10px 14px', cursor: deleting ? 'not-allowed' : 'pointer', fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s' }}>
            <span style={{ fontSize: 13 }}>{deleting ? '…' : '✕'}</span>
            {deleting ? 'DELETING...' : confirm ? 'CONFIRM?' : 'DELETE'}
          </button>
        </div>
      )}
    </div>
  );
};

/* ── EventCard ───────────────────────────────────────────────────────────── */
const EventCard = ({ event, index = 0, onDelete, onOpen }) => {
  const color = getCatColor(event.eventType);
  // Support both new schema (startDate/startTime) and old (date/time)
  const dateStr = event.startDate || event.date;
  const timeStr = event.startTime || event.time;

  return (
    <>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        /* ⋮ button: hidden on desktop hover-only, always visible on mobile */
        .card-menu-btn { opacity: 0; transition: opacity .15s; }
        .event-card:hover .card-menu-btn { opacity: 1; }
        @media (max-width: 768px) { .card-menu-btn { opacity: 1 !important; } }
      `}</style>

      <div className="event-card"
        onClick={() => onOpen && onOpen(event)}
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', transition: 'all .25s ease', animation: 'fadeUp .7s ease both', animationDelay: `${index * 0.07}s`, position: 'relative' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

        {/* Poster */}
        <div style={{ height: 160, background: 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
          {event.image ? (
            <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          ) : (
            <>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px)' }} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: 2, position: 'relative', zIndex: 1 }}>{event.title?.toUpperCase().slice(0, 14)}</span>
            </>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '20px 22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ display: 'inline-block', padding: '3px 10px', background: `${color}22`, border: `1px solid ${color}55`, color, borderRadius: 2, fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 1 }}>
              {event.eventType?.toUpperCase()}
            </span>
            <CardMenu eventId={event._id} onDelete={onDelete} />
          </div>

          <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, lineHeight: 1.2 }}>
            {event.title}
          </h3>

          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.6, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: "'DM Sans',sans-serif" }}>
            {event.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>◷</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: "'Space Mono',monospace" }}>
                {dateStr ? getFormattedDate(dateStr) : '—'}{timeStr ? ` · ${getFormattedTime(timeStr)}` : ''}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>◎</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>{event.venue}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventCard;