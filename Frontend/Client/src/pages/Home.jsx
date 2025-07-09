import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Users, Heart, User, Menu } from 'lucide-react';
import EventCard from '../components/EventCard';
import FilterBar from '../components/FilterBar';
import { mockEvents } from '../data/mockdata';

const HomePage = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: 'all',
    category: 'all',
    date: 'all'
  });

  // Filter events based on search query and filters
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = selectedFilters.location === 'all' || 
                           event.location.toLowerCase().includes(selectedFilters.location.toLowerCase());
    
    const matchesCategory = selectedFilters.category === 'all' || 
                           event.category.toLowerCase() === selectedFilters.category.toLowerCase();
    
    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className='w-full max-h-screen h-screen'>
      <div className="flex justify-between items-center mb-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800">Discover Events</h2>
        <button className="lg:hidden" onClick={onMenuClick}>
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
      
      <FilterBar 
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      
      <div className="flex flex-wrap flex-row justify-center items-center gap-12">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} showFriends={true} />
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;