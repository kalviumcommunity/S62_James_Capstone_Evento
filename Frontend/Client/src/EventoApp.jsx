import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './pages/Home';

const EventoApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content — no top navbar, sidebar manages its own open/close */}
      <main style={{ flex: 1, overflowX: 'hidden', minWidth: 0 }}>
        <HomePage />
      </main>
    </div>
  );
};

export default EventoApp;
