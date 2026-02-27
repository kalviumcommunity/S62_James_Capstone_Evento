import React from 'react';

const selectStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  padding: '12px 16px',
  borderRadius: '2px',
  fontSize: '12px',
  fontFamily: "'Space Mono', monospace",
  cursor: 'pointer',
  outline: 'none',
};

const FilterBar = ({ selectedFilters, setSelectedFilters }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
    <span style={{
      fontSize: '11px',
      color: 'rgba(255,255,255,0.3)',
      fontFamily: "'Space Mono', monospace",
      letterSpacing: '2px',
    }}>
      FILTER:
    </span>

    <select
      value={selectedFilters.eventType}
      onChange={e => setSelectedFilters({ ...selectedFilters, eventType: e.target.value })}
      style={selectStyle}
    >
      <option value="all">All Categories</option>
      <option value="Drama">Drama</option>
      <option value="Music">Music</option>
      <option value="Technology">Technology</option>
      <option value="Seminar">Seminar</option>
      <option value="Sports">Sports</option>
      <option value="Arts">Arts</option>
      <option value="Other">Other</option>
    </select>

    <select
      value={selectedFilters.date}
      onChange={e => setSelectedFilters({ ...selectedFilters, date: e.target.value })}
      style={selectStyle}
    >
      <option value="all">Any Time</option>
      <option value="today">Today</option>
      <option value="week">This Week</option>
      <option value="month">This Month</option>
    </select>
  </div>
);

export default FilterBar;