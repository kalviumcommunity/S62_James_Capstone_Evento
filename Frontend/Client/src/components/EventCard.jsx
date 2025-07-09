import React from 'react';
import { MapPin, Calendar, Users, Heart, User } from 'lucide-react';

const EventCard = ({ event, showFriends = false }) => {
  return (
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
        
        {showFriends && event.friendsInterested && event.friendsInterested.length > 0 && (
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
};

export default EventCard;