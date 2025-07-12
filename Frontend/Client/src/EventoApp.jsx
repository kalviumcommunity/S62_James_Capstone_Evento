import  { useState } from 'react';
import { Bell, Menu, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import components
import Sidebar from './components/Sidebar';
import HomePage from './pages/Home';
import EventCard from './components/EventCard';

// Import data
import { mockEvents, mockFriends } from './data/mockdata';

const EventoApp = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const curatedEvents = mockEvents.slice(0, 2);

  const renderContent = () => {
    switch (activeTab) {
      case 'discover':
        return (
          <HomePage onMenuClick={() => setSidebarOpen(true)} />
        );
        
      case 'curated':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Curated For You</h2>
              <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 mb-6 text-white">
              <h3 className="text-xl font-bold mb-2">Personalized Recommendations</h3>
              <p className="opacity-90">Based on your interests in Technology and Business events</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curatedEvents.map((event) => (
                <EventCard key={event.id} event={event} showFriends={true} />
              ))}
            </div>
          </div>
        );
        
      case 'friends':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Friends Activity</h2>
              <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {mockFriends.map((friend, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-medium text-purple-600">
                      {friend.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{friend.name}</p>
                      <p className="text-sm text-gray-500">Interested in {friend.interests.join(', ')}</p>
                    </div>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 font-medium">Follow</button>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Events Your Friends Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockEvents.slice(0, 2).map((event) => (
                <EventCard key={event.id} event={event} showFriends={true} />
              ))}
            </div>
          </div>
        );
        
      case 'community':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Community Reviews</h2>
              <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {mockEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start space-x-4">
                    <img src={event.image} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{event.location} • {event.date}</p>
                      
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">A</div>
                            <span className="text-sm font-medium">Alice</span>
                            <div className="flex text-yellow-400">
                              {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">"Amazing event! Great speakers and networking opportunities."</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600">B</div>
                            <span className="text-sm font-medium">Bob</span>
                            <div className="flex text-yellow-400">
                              {[1,2,3,4].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                              <Star className="w-3 h-3" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">"Well organized event, learned a lot about emerging technologies."</p>
                        </div>
                      </div>
                      
                      <button className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium">
                        Write a review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EventoApp;