'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import CitySearch from './components/CitySearch';
import DailyForecast from './components/DailyForecast';
import { Line } from 'react-chartjs-2';
import { cities } from './data/cities';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { weatherCache } from './utils/cache';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
});

interface WeatherData {
  time: string;
  temperature: number;
  weathercode: number;
  windspeed: number;
  relativehumidity: number;
  precipitation_probability: number;
}

interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([0, 0]);
  const [selectedCity, setSelectedCity] = useState<{ name: string; latitude: number; longitude: number } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedLocation, setLastFetchedLocation] = useState<[number, number] | null>(null);

  // Set initial location to Mascot
  useEffect(() => {
    const mascot = cities.find(city => city.name === 'Mascot');
    if (mascot) {
      setSelectedLocation([mascot.latitude, mascot.longitude]);
      setSelectedCity(mascot);
    }
  }, []);

  const fetchWeatherData = useCallback(async (latitude: number, longitude: number) => {
    // Skip if we're already fetching for this location
    if (lastFetchedLocation?.[0] === latitude && lastFetchedLocation?.[1] === longitude) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/weather-forecast/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If we get a rate limit error, use cached data if available
        if (response.status === 429 && weatherData.length > 0) {
          console.log('Rate limited, using existing data');
          return;
        }
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      // Validate the response data
      if (!data.hourly || !data.daily) {
        throw new Error('Invalid weather data received');
      }
      
      const hourlyData = data.hourly;
      const formattedData = hourlyData.time.map((time: string, index: number) => ({
        time,
        temperature: hourlyData.temperature_2m[index],
        weathercode: hourlyData.weathercode[index],
        windspeed: hourlyData.windspeed_10m[index],
        relativehumidity: hourlyData.relativehumidity_2m[index],
        precipitation_probability: hourlyData.precipitation_probability[index],
      }));

      setWeatherData(formattedData);
      setDailyData(data.daily);
      setLastFetchedLocation([latitude, longitude]);
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Error fetching weather data:', err);
      
      // If we have existing data, keep it instead of showing an error
      if (weatherData.length > 0) {
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  }, [lastFetchedLocation, weatherData]);

  // Debounce the weather data fetching
  const debouncedFetchWeather = useCallback(
    debounce((latitude: number, longitude: number) => {
      fetchWeatherData(latitude, longitude);
    }, 500),
    [fetchWeatherData]
  );

  useEffect(() => {
    if (selectedLocation[0] !== 0 && selectedLocation[1] !== 0) {
      debouncedFetchWeather(selectedLocation[0], selectedLocation[1]);
    }
  }, [selectedLocation, debouncedFetchWeather]);

  const getWeatherIcon = (code: number) => {
    // WMO Weather interpretation codes (WW)
    const weatherIcons: { [key: number]: string } = {
      0: '☀️', // Clear sky
      1: '🌤️', // Mainly clear
      2: '⛅', // Partly cloudy
      3: '☁️', // Overcast
      45: '🌫️', // Foggy
      48: '🌫️', // Depositing rime fog
      51: '🌧️', // Light drizzle
      53: '🌧️', // Moderate drizzle
      55: '🌧️', // Dense drizzle
      61: '🌧️', // Slight rain
      63: '🌧️', // Moderate rain
      65: '🌧️', // Heavy rain
      71: '🌨️', // Slight snow
      73: '🌨️', // Moderate snow
      75: '🌨️', // Heavy snow
      77: '🌨️', // Snow grains
      80: '🌧️', // Slight rain showers
      81: '🌧️', // Moderate rain showers
      82: '🌧️', // Violent rain showers
      85: '🌨️', // Slight snow showers
      86: '🌨️', // Heavy snow showers
      95: '⛈️', // Thunderstorm
      96: '⛈️', // Thunderstorm with slight hail
      99: '⛈️', // Thunderstorm with heavy hail
    };
    return weatherIcons[code] || '❓';
  };

  const hourlyChartData = {
    labels: weatherData.slice(0, 24).map(data => format(new Date(data.time), 'HH:mm')),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: weatherData.slice(0, 24).map(data => data.temperature),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Precipitation Probability (%)',
        data: weatherData.slice(0, 24).map(data => data.precipitation_probability),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        label: 'Current Time',
        data: weatherData.slice(0, 24).map((data, index) => {
          const currentTime = new Date();
          const dataTime = new Date(data.time);
          return currentTime.getHours() === dataTime.getHours() ? data.temperature : null;
        }),
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(0, 0, 0)',
        pointRadius: 8,
        pointStyle: 'rectRot',
        pointBackgroundColor: 'rgb(0, 0, 0)',
        pointBorderColor: 'rgb(0, 0, 0)',
        showLine: false,
        yAxisID: 'y',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '24-Hour Forecast',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            if (context.dataset.label === 'Current Time') {
              return 'Current Time';
            }
            if (context.dataset.label === 'Temperature (°C)') {
              return `Temperature: ${context.raw}°C`;
            }
            if (context.dataset.label === 'Precipitation Probability (%)') {
              return `Rain Chance: ${context.raw}%`;
            }
            return context.dataset.label + ': ' + context.raw;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Precipitation Probability (%)'
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      }
    },
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800">
        Demo: ReactJS with Next.js Weather Forecast
      </h1>
      <p className="text-center text-gray-600">
        Deployed to Google Cloud Functions
      </p>
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="mb-4">
          <CitySearch 
            onLocationSelect={(location) => {
              setSelectedLocation(location);
              // Find the city in our database
              const city = cities.find(
                c => c.latitude === location[0] && c.longitude === location[1]
              );
              setSelectedCity(city || null);
            }} 
          />
        </div>
        <MapComponent 
          onLocationSelect={setSelectedLocation} 
          selectedCity={selectedCity || undefined}
        />
      </div>

      {loading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading weather data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {weatherData.length > 0 && !loading && !error && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Hourly Forecast</h2>
            <div className="text-lg font-medium text-gray-600">
              Current Time: {format(new Date(), 'h:mm:ss a')}
            </div>
          </div>
          <div className="mb-6">
            <Line options={chartOptions} data={hourlyChartData} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weatherData.slice(0, 24).map((data, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">
                      {format(new Date(data.time), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(data.time), 'h:mm a')}
                    </p>
                    <p className="text-3xl">{getWeatherIcon(data.weathercode)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{data.temperature}°C</p>
                    <p className="text-sm text-gray-600">
                      Wind: {data.windspeed} km/h
                    </p>
                    <p className="text-sm text-gray-600">
                      Humidity: {data.relativehumidity}%
                    </p>
                    <p className={`text-sm ${data.precipitation_probability > 50 ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                      Rain Chance: {data.precipitation_probability}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dailyData && !loading && !error && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-2xl font-semibold mb-4">7-Day Forecast</h2>
          <DailyForecast dailyData={dailyData} />
        </div>
      )}
    </div>
  );
} 