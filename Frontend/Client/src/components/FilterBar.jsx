import React from 'react';
import { Filter } from 'lucide-react';

const FilterBar = ({ selectedFilters, setSelectedFilters }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select 
          value={selectedFilters.location}
          onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          <option value="technology">Technology</option>
          <option value="music">Music</option>
          <option value="business">Business</option>
          <option value="arts">Arts</option>
          <option value="sports">Sports</option>
        </select>
        
        <select 
          value={selectedFilters.date}
          onChange={(e) => setSelectedFilters({...selectedFilters, date: e.target.value})}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">Any Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        
        {(selectedFilters.location !== 'all' || selectedFilters.category !== 'all' || selectedFilters.date !== 'all') && (
          <button
            onClick={() => setSelectedFilters({ location: 'all', category: 'all', date: 'all' })}
            className="px-3 py-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;