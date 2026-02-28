import React, { useEffect } from 'react';
import { getFormattedDate, getFormattedTime } from '../utils/formatDate';

const STATUS_STYLE = {
    Upcoming: { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.35)', color: '#a855f7' },
    Live: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.35)', color: '#22c55e' },
    Completed: { bg: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' },
    Cancelled: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#ef4444' },
    Draft: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', color: '#6366f1' },
};
const CAT_COLORS = {
    drama: '#a855f7', other: '#6366f1', technical: '#06b6d4', technology: '#06b6d4',
    hackathon: '#f59e0b', music: '#f59e0b', 'talk / seminar': '#3b82f6',
    workshop: '#22c55e', cultural: '#f97316', sports: '#22c55e', 'film / media': '#ec4899',
};
const getCatColor = (t = '') => CAT_COLORS[t.toLowerCase()] || '#a855f7';

const MODAL_CSS = `
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  .em-backdrop { animation: fadeIn .2s ease both; }
  .em-modal    { animation: slideUp .35s cubic-bezier(.4,0,.2,1) both; }

  .em-modal { scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.1) transparent; }
  .em-modal::-webkit-scrollbar { width:4px; }
  .em-modal::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }

  .em-right { scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.1) transparent; }
  .em-right::-webkit-scrollbar { width:4px; }
  .em-right::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }

  /* Responsive — stack columns on mobile */
  @media (max-width: 768px) {
    .em-body { flex-direction: column !important; }
    .em-col-left  { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07) !important; }
    .em-hero-title { font-size: 36px !important; }
  }

  .em-contact-row + .em-contact-row { border-top: 1px solid rgba(255,255,255,0.05); }
  .em-btn-reg:hover  { background: #e0e0e0 !important; }
  .em-btn-web:hover  { border-color: rgba(255,255,255,0.4) !important; color: #fff !important; }
  .em-close:hover    { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
  .em-stream:hover   { text-decoration: underline; }
  .em-prize-chip { display:inline-block; padding:4px 10px; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); color:rgba(245,158,11,0.7); border-radius:2px; font-size:11px; font-family:'Space Mono',monospace; }
  .em-note-chip  { display:inline-block; padding:4px 10px; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); color:rgba(245,158,11,0.8); border-radius:2px; font-size:11px; margin:3px 3px 3px 0; }
`;

/* ── Small helpers ───────────────────────────────────────────────────────── */
const MetaLabel = ({ children }) => (
    <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono',monospace", marginBottom: 6 }}>
        {children}
    </div>
);

const MetaVal = ({ children, style }) => (
    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, ...style }}>
        {children}
    </div>
);

const MetaBlock = ({ label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <MetaLabel>{label}</MetaLabel>
        {children}
    </div>
);

const Divider = () => (
    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
);

/* ═══════════════════════════════════════════════════════════════════════════
   EventModal — Option A — Editorial / Magazine
═══════════════════════════════════════════════════════════════════════════ */
const EventModal = ({ event, onClose }) => {

    useEffect(() => {
        if (!event) return;
        const handler = e => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
    }, [event, onClose]);

    if (!event) return null;

    const color = getCatColor(event.eventType);
    const statusSt = STATUS_STYLE[event.status] || STATUS_STYLE.Upcoming;
    const statusDot = event.status === 'Live' ? '● ' : '';

    /* Date/time helpers — legacy fallback */
    const dateStr = event.startDate || event.date;
    const timeStr = event.startTime || event.time;
    const dateLabel = dateStr ? getFormattedDate(dateStr) : null;
    const endDateLabel = event.endDate ? getFormattedDate(event.endDate) : null;
    const timeLabel = timeStr ? getFormattedTime(timeStr) : null;
    const endTimeLabel = event.endTime ? getFormattedTime(event.endTime) : null;

    return (
        <>
            <style>{MODAL_CSS}</style>

            {/* ── Backdrop ── */}
            <div className="em-backdrop"
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>

                {/* ── Modal shell ── */}
                <div className="em-modal"
                    onClick={e => e.stopPropagation()}
                    style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, width: '100%', maxWidth: 820, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>

                    {/* Close button */}
                    <button className="em-close" onClick={onClose}
                        style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, width: 32, height: 32, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 14, transition: 'all .2s' }}>
                        ✕
                    </button>

                    {/* ── HERO ── */}
                    <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                        {/* Poster or placeholder */}
                        {event.image ? (
                            <img src={event.image} alt={event.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }} />
                        ) : (
                            <div style={{
                                width: '100%', height: '100%', background: '#111',
                                backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px)'
                            }} />
                        )}

                        {/* Gradient overlay */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, #0f0f0f 100%)' }} />

                        {/* Hero meta (badges + title) */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 32px' }}>
                            {/* Badge row */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                                {event.eventType && (
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 2, fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1.5,
                                        background: `${color}22`, border: `1px solid ${color}55`, color
                                    }}>
                                        {event.eventType.toUpperCase()}
                                    </span>
                                )}
                                {event.level && (
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 2, fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1.5,
                                        background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4'
                                    }}>
                                        {event.level.toUpperCase()}
                                    </span>
                                )}
                                <span style={{
                                    padding: '3px 10px', borderRadius: 2, fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1.5,
                                    background: statusSt.bg, border: `1px solid ${statusSt.border}`, color: statusSt.color
                                }}>
                                    {statusDot}{(event.status || 'Upcoming').toUpperCase()}
                                </span>
                                {event.isVerified && (
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 2, fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1,
                                        background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e'
                                    }}>
                                        ✓ VERIFIED
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <div className="em-hero-title"
                                style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, letterSpacing: 3, lineHeight: .95, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                                {event.title}
                            </div>

                            {/* Subtitle */}
                            {event.subtitle && (
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6, fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic' }}>
                                    {event.subtitle}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── BODY — two columns ── */}
                    <div className="em-body"
                        style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.07)' }}>

                        {/* ── LEFT COLUMN ── */}
                        <div className="em-col-left"
                            style={{ width: 260, flexShrink: 0, padding: '28px 28px', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 20 }}>

                            {/* Schedule */}
                            <MetaBlock label="SCHEDULE">
                                {dateLabel && (
                                    <MetaVal>{dateLabel}{endDateLabel ? ` → ${endDateLabel}` : ''}</MetaVal>
                                )}
                                {(timeLabel || event.duration) && (
                                    <MetaVal style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                                        {timeLabel}{endTimeLabel ? ` – ${endTimeLabel}` : ''}
                                        {event.duration ? ` (${event.duration})` : ''}
                                    </MetaVal>
                                )}
                            </MetaBlock>

                            {/* Deadline */}
                            {event.deadline && (
                                <MetaBlock label="REG. CLOSES">
                                    <MetaVal style={{ color: '#f59e0b' }}>{getFormattedDate(event.deadline)}</MetaVal>
                                </MetaBlock>
                            )}

                            <Divider />

                            {/* Location */}
                            <MetaBlock label="LOCATION">
                                <MetaVal>{[event.venue, event.campus].filter(Boolean).join(' · ')}</MetaVal>
                                {event.city && <MetaVal style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{event.city}</MetaVal>}
                            </MetaBlock>

                            {/* Stream link */}
                            {event.streamLink && (
                                <MetaBlock label="STREAM LINK">
                                    <MetaVal>
                                        <a className="em-stream" href={event.streamLink} target="_blank" rel="noreferrer"
                                            style={{ color: '#a855f7', textDecoration: 'none', fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 1 }}>
                                            ▶ WATCH LIVE
                                        </a>
                                    </MetaVal>
                                </MetaBlock>
                            )}

                            <Divider />

                            {/* Entry fee */}
                            <MetaBlock label="ENTRY">
                                <MetaVal style={{ color: event.isFree ? '#22c55e' : '#fff', fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: 1 }}>
                                    {event.isFree ? 'FREE ENTRY' : `₹${event.entryFee || 0}`}
                                </MetaVal>
                            </MetaBlock>

                            {/* Prizes */}
                            {event.hasPrizes && (
                                <MetaBlock label="PRIZES">
                                    {event.prizePool && (
                                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, letterSpacing: 2, color: '#f59e0b', lineHeight: 1 }}>
                                            ₹{Number(event.prizePool).toLocaleString('en-IN')}
                                        </div>
                                    )}
                                    {event.prizes?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                                            {event.prizes.map((p, i) => (
                                                <span key={i} className="em-prize-chip">{p}</span>
                                            ))}
                                        </div>
                                    )}
                                </MetaBlock>
                            )}
                        </div>

                        {/* ── RIGHT COLUMN ── */}
                        <div className="em-right"
                            style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>

                            {/* Organiser */}
                            <MetaBlock label="ORGANISER">
                                <MetaVal style={{ fontSize: 15, fontWeight: 500 }}>{event.organizer}</MetaVal>
                                {event.department && <MetaVal style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{event.department}</MetaVal>}
                                {event.institution && <MetaVal style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{event.institution}</MetaVal>}
                            </MetaBlock>

                            <Divider />

                            {/* Description */}
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif" }}>
                                {event.description}
                            </div>

                            {/* Contacts */}
                            {event.contacts?.length > 0 && (
                                <>
                                    <Divider />
                                    <MetaBlock label="CONTACTS FOR QUERIES">
                                        <div>
                                            {event.contacts.map((c, i) => (
                                                <div key={i} className="em-contact-row"
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{c.name}</span>
                                                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono',monospace" }}>
                                                        {c.phone || c.email}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </MetaBlock>
                                </>
                            )}

                            {/* Speakers */}
                            {event.speakers?.length > 0 && (
                                <>
                                    <Divider />
                                    <MetaBlock label="SPEAKERS & GUESTS">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {event.speakers.map((s, i) => (
                                                <div key={i}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4 }}>
                                                    {/* Avatar initial */}
                                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, flexShrink: 0, color: '#fff' }}>
                                                        {s.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                                                        {(s.designation || s.organisation) && (
                                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                                                                {[s.designation, s.organisation].filter(Boolean).join(' · ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </MetaBlock>
                                </>
                            )}

                            {/* Important notes */}
                            {event.importantNotes?.length > 0 && (
                                <>
                                    <Divider />
                                    <MetaBlock label="IMPORTANT NOTES">
                                        <div>
                                            {event.importantNotes.map((n, i) => (
                                                <span key={i} className="em-note-chip">{n}</span>
                                            ))}
                                        </div>
                                    </MetaBlock>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── CTA ROW (conditional) ── */}
                    {(event.registrationLink || event.eventWebsite) && (
                        <div style={{ display: 'flex', gap: 10, padding: '20px 32px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                            {event.registrationLink && (
                                <a href={event.registrationLink} target="_blank" rel="noreferrer"
                                    className="em-btn-reg"
                                    style={{ flex: 1, background: '#fff', color: '#000', border: 'none', padding: 14, fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 2, fontWeight: 700, cursor: 'pointer', borderRadius: 2, transition: 'background .2s', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                                    REGISTER →
                                </a>
                            )}
                            {event.eventWebsite && (
                                <a href={event.eventWebsite} target="_blank" rel="noreferrer"
                                    className="em-btn-web"
                                    style={{ padding: '14px 24px', background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 2, cursor: 'pointer', borderRadius: 2, transition: 'all .2s', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                                    VISIT WEBSITE ↗
                                </a>
                            )}
                        </div>
                    )}

                </div>{/* /modal */}
            </div>{/* /backdrop */}
        </>
    );
};

export default EventModal;
