'use client';

import { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { cities, City } from '../data/cities';

interface CitySearchProps {
  onLocationSelect: (location: [number, number]) => void;
}

const CitySearch = ({ onLocationSelect }: CitySearchProps) => {
  const [query, setQuery] = useState('Mascot, New South Wales, Australia');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set default location to Mascot
    const mascot = cities.find(city => city.name === 'Mascot');
    if (mascot) {
      onLocationSelect([mascot.latitude, mascot.longitude]);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onLocationSelect]);

  const searchCities = debounce((searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const searchTerm = searchQuery.toLowerCase();
      const filteredCities = cities.filter(city => 
        city.name.toLowerCase().includes(searchTerm) ||
        city.country.toLowerCase().includes(searchTerm) ||
        (city.state && city.state.toLowerCase().includes(searchTerm))
      ).slice(0, 10);

      setSuggestions(filteredCities);
    } catch (err) {
      setError('Failed to search cities. Please try again.');
      console.error('Error searching cities:', err);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    if (query.length >= 3) {
      searchCities(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleCitySelect = (city: City) => {
    setQuery(`${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}`);
    onLocationSelect([city.latitude, city.longitude]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for a city (minimum 3 characters)..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-red-600 text-sm">{error}</div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((city, index) => (
            <div
              key={`${city.name}-${city.latitude}-${city.longitude}-${index}`}
              onClick={() => handleCitySelect(city)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">{city.name}</div>
              <div className="text-sm text-gray-600">
                {city.state ? `${city.state}, ` : ''}{city.country}
                {city.population && (
                  <span className="ml-2 text-gray-500">
                    (Pop: {city.population.toLocaleString()})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && query.length > 0 && query.length < 3 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-gray-600">
          Please enter at least 3 characters to search
        </div>
      )}
    </div>
  );
};

export default CitySearch; 