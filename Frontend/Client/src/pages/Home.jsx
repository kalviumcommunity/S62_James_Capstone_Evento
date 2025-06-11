  import React, { useState, useEffect } from 'react';
  import { Search, Filter, MapPin, Calendar, Users, Heart, Star, MessageCircle, User, Bell, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

  const EventoApp = () => {
    const [activeTab, setActiveTab] = useState('discover');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({
      location: 'all',
      category: 'all',
      date: 'all'
    });
    const Navigate=useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mock data
    const events = [
      {
        id: 1,
        title: "Tech Innovation Summit 2025",
        date: "June 15, 2025",
        time: "2:00 PM",
        location: "Stanford University",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
        interested: 156,
        attending: 89,
        description: "Join industry leaders discussing the future of AI and machine learning.",
        organizer: "Stanford Tech Club",
        friendsInterested: ["Alice", "Bob", "Charlie"]
      },
      {
        id: 2,
        title: "Music Festival Spring",
        date: "June 20, 2025",
        time: "6:00 PM",
        location: "UC Berkeley",
        category: "Music",
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=200&fit=crop",
        interested: 234,
        attending: 187,
        description: "An evening of live performances by local and international artists.",
        organizer: "Berkeley Music Society",
        friendsInterested: ["Diana", "Eve"]
      },
      {
        id: 3,
        title: "Startup Pitch Competition",
        date: "June 18, 2025",
        time: "10:00 AM",
        location: "MIT",
        category: "Business",
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop",
        interested: 98,
        attending: 67,
        description: "Watch innovative startups pitch their ideas to top VCs.",
        organizer: "MIT Entrepreneurship Club",
        friendsInterested: ["Frank", "Grace", "Henry"]
      },
      {
        id: 4,
        title: "Art Exhibition Opening",
        date: "June 22, 2025",
        time: "4:00 PM",
        location: "Harvard University",
        category: "Arts",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
        interested: 76,
        attending: 54,
        description: "Contemporary art showcase featuring student and professional works.",
        organizer: "Harvard Arts Department",
        friendsInterested: ["Ivy", "Jack"]
      }
    ];

    const curatedEvents = events.slice(0, 2);
    const friends = [
      { name: "Alice", avatar: "A", interests: ["Technology", "Business"] },
      { name: "Bob", avatar: "B", interests: ["Music", "Arts"] },
      { name: "Charlie", avatar: "C", interests: ["Technology", "Sports"] },
      { name: "Diana", avatar: "D", interests: ["Music", "Arts"] }
    ];

    const EventCard = ({ event, showFriends = false }) => (
      <div className="bg-white max-w-96 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative">
          <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div className="absolute bottom-4 left-4">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {event.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
          
          <div className="flex items-center text-gray-500 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="mr-4">{event.date}</span>
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center text-gray-500 mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-purple-600">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">{event.interested} interested</span>
              </div>
              <div className="flex items-center text-green-600">
                <User className="w-4 h-4 mr-1" />
                <span className="text-sm">{event.attending} attending</span>
              </div>
            </div>
          </div>
          
          {showFriends && event.friendsInterested.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-purple-700 font-medium mb-1">Friends interested:</p>
              <div className="flex items-center space-x-2">
                {event.friendsInterested.slice(0, 3).map((friend, idx) => (
                  <div key={idx} className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-medium text-purple-700">
                    {friend[0]}
                  </div>
                ))}
                {event.friendsInterested.length > 3 && (
                  <span className="text-xs text-purple-600">+{event.friendsInterested.length - 3} more</span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Interested
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>
    );

    const Sidebar = () => (
      <div className={`fixed max-h-screen inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-2xl font-bold text-purple-600">Evento</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 mb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</h2>
          </div>
          
          {[
            { id: 'discover', label: 'Discover Events', icon: Search },
            { id: 'curated', label: 'For You', icon: Star },
            { id: 'friends', label: 'Friends Activity', icon: Users },
            { id: 'community', label: 'Community', icon: MessageCircle }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-purple-50 transition-colors ${
                activeTab === item.id ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600' : 'text-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <div onClick={()=>{
          Navigate("/login")
        }} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">John Doe</p>
              <p className="text-sm text-gray-500">Stanford University</p>
            </div>
          </div>
        </div>
      </div>
    );

    const FilterBar = () => (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select 
            value={selectedFilters.location}
            onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Locations</option>
            <option value="stanford">Stanford University</option>
            <option value="berkeley">UC Berkeley</option>
            <option value="mit">MIT</option>
            <option value="harvard">Harvard University</option>
          </select>
          
          <select 
            value={selectedFilters.category}
            onChange={(e) => setSelectedFilters({...selectedFilters, category: e.target.value})}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="music">Music</option>
            <option value="business">Business</option>
            <option value="arts">Arts</option>
          </select>
          
          <select 
            value={selectedFilters.date}
            onChange={(e) => setSelectedFilters({...selectedFilters, date: e.target.value})}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Any Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
    );

    const renderContent = () => {
      switch (activeTab) {
        case 'discover':
          return (
            <div className='w-full max-h-screen h-screen'>
              <div className="flex justify-between items-center mb-6 w-full">
                <h2 className="text-2xl font-bold text-gray-800">Discover Events</h2>
                <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events, locations, or organizers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <FilterBar />
              
              <div className="flex flex-wrap flex-row justify-center items-center gap-12">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} showFriends={true} />
                ))}
              </div>
            </div>
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
                {friends.map((friend, idx) => (
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
                {events.slice(0, 2).map((event) => (
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
                {events.slice(0, 2).map((event) => (
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
        <Sidebar />
        
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className="flex-1 lg:ml-0 max-h-screen overflow-y-scroll">
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