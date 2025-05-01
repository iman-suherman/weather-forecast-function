'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  onLocationSelect: (location: [number, number]) => void;
  selectedCity?: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

const MapComponent = ({ onLocationSelect, selectedCity }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fix Leaflet default icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Mascot coordinates
    const mascotCoords: [number, number] = [-33.9258, 151.1933];

    // Initialize map with Mascot as the center
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(mascotCoords, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Add initial marker for Mascot
      markerRef.current = L.marker(mascotCoords).addTo(mapRef.current);
      onLocationSelect(mascotCoords);

      // Add click handler
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        updateMarker(lat, lng);
      });

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Only update if user is in a reasonable distance from Mascot
            const distance = calculateDistance(latitude, longitude, mascotCoords[0], mascotCoords[1]);
            if (distance > 50) { // If more than 50km from Mascot
              mapRef.current?.setView([latitude, longitude], 10);
              updateMarker(latitude, longitude);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onLocationSelect]);

  // Effect to handle city changes
  useEffect(() => {
    if (selectedCity && mapRef.current) {
      const newCoords: [number, number] = [selectedCity.latitude, selectedCity.longitude];
      mapRef.current.setView(newCoords, 13);
      updateMarker(newCoords[0], newCoords[1]);
    }
  }, [selectedCity]);

  const updateMarker = (lat: number, lng: number) => {
    if (mapRef.current) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
      }
      onLocationSelect([lat, lng]);
    }
  };

  // Helper function to calculate distance between two points in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    // Fetches weather data from Open-Meteo API
    // Updates weatherData and dailyData states
    // Handles loading and error states
  };

  return <div id="map" className="w-full h-[400px] rounded-lg" />;
};

export default MapComponent; 