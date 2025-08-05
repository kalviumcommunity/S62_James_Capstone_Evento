import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Menu } from 'lucide-react';
import EventCard from '../components/EventCard';
import FilterBar from '../components/FilterBar';

const HomePage = ({ onMenuClick }) => {
  const [events, setEvents] = useState([]);        // fetched events from DB
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    venue: 'all',
    eventType: 'all',
    date: 'all'
  });



   
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/events');
        console.log('Fetched events:', response.data);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);


  console.log('Events state:', events, 'Type:', typeof events);
  // Filtering logic
const filteredEvents = Array.isArray(events) ? events.filter(event => {
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.venue.toLowerCase().includes(searchLower) ||
      event.organizer.toLowerCase().includes(searchLower);

    const matchesVenue =
      selectedFilters.venue === 'all' ||
      event.venue.toLowerCase().includes(selectedFilters.venue.toLowerCase());

    const matchesCategory =
      selectedFilters.eventType === 'all' ||
      event.catoger.toLowerCase() === selectedFilters.eventType.toLowerCase();

    // Optional: Add date filter here if needed

    return matchesSearch && matchesVenue && matchesCategory;
  }) : [];
  return (
    <div className='w-full max-h-screen h-screen'>
      <div className="flex justify-between items-center mb-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800">Discover Events</h2>
        <button className="lg:hidden" onClick={onMenuClick}>
          {/* <Menu className="w-6 h-6" /> */}
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search events, venues, or organizers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          autoComplete="off"
          aria-label="Search events"
        />
      </div>

      <FilterBar
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />

      {loading ? (
        <div className="text-center py-12">Loading events...</div>
      ) : (
        <>
          <div className="flex flex-wrap flex-row justify-center items-center gap-12">
            {filteredEvents.map(event => (
              <EventCard key={event._id} event={event} showFriends={true} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
