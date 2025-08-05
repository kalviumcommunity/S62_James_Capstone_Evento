import React, { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import HomePage from './pages/Home';

const EventoApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        // You can customize Sidebar to hide tabs or leave as-is
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab="discover"      // Always on discover/home
        setActiveTab={() => {}}   // No tab switching needed
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 max-h-screen overflow-y-scroll">
        <header className="bg-white shadow-sm border-b px-6 py-4 lg:hidden">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-purple-600">Evento</h1>
            <Bell className="w-6 h-6 text-gray-400" />
          </div>
        </header>

        <main className="p-6">
          <HomePage onMenuClick={() => setSidebarOpen(true)} />
        </main>
      </div>
    </div>
  );
};

export default EventoApp;
