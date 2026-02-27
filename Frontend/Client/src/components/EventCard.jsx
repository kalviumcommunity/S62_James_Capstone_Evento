import React from 'react';
import { useNavigate } from 'react-router-dom';

// Inline date/time formatters (utils/dateFormatter.js removed)
const getFormattedDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const getFormattedTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const d = new Date(); d.setHours(hours, minutes, 0);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};


const CAT_COLORS = {
  drama: '#a855f7',
  other: '#6366f1',
  technology: '#06b6d4',
  music: '#f59e0b',
  seminar: '#3b82f6',
  sports: '#22c55e',
  arts: '#f97316',
  tech: '#06b6d4',
};

const getCatColor = (type = '') => CAT_COLORS[type.toLowerCase()] || '#a855f7';

const EventCard = ({ event, index = 0 }) => {
  const navigate = useNavigate();
  const color = getCatColor(event.eventType);
  const delay = `${index * 0.07}s`;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        animation: `fadeUp 0.7s ease both`,
        animationDelay: delay,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Card image / placeholder */}
      <div style={{
        height: '160px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        ) : (
          <>
            {/* Grid pattern placeholder */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.04) 39px, rgba(255,255,255,0.04) 40px),
                repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.04) 39px, rgba(255,255,255,0.04) 40px)
              `,
            }} />
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '2px',
              position: 'relative',
              zIndex: 1,
            }}>
              {event.title?.toUpperCase().slice(0, 14)}
            </span>
          </>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '20px 22px 24px' }}>
        {/* Category badge + Edit button row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            background: `${color}22`,
            border: `1px solid ${color}55`,
            color: color,
            borderRadius: '2px',
            fontSize: '11px',
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '1px',
          }}>
            {event.eventType?.toUpperCase()}
          </span>

          {/* Edit button */}
          <button
            onClick={e => { e.stopPropagation(); navigate(`/edit-event/${event._id}`); }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.15)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'; e.currentTarget.style.color = '#a855f7'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
              borderRadius: '2px',
              padding: '5px 14px',
              fontSize: '11px',
              fontFamily: "'Space Mono', monospace",
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            ✎ EDIT
          </button>
        </div>

        {/* Title */}
        <h3 style={{
          color: '#fff',
          margin: '0 0 8px',
          fontSize: '18px',
          fontFamily: "'Bebas Neue', sans-serif",
          letterSpacing: '1px',
          lineHeight: 1.2,
        }}>
          {event.title}
        </h3>

        {/* Description */}
        <p style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '13px',
          lineHeight: 1.6,
          margin: '0 0 16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {event.description}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>◷</span>
            <span style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '12px',
              fontFamily: "'Space Mono', monospace",
            }}>
              {getFormattedDate(event.date)}{event.time ? ` · ${getFormattedTime(event.time)}` : ''}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>◎</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>
              {event.venue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;