import { NextResponse } from 'next/server';
import { weatherCache } from '../../utils/cache';

function logRequest(latitude: string, longitude: string, status: string, message: string) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({
    timestamp,
    type: 'WEATHER_API_REQUEST',
    latitude,
    longitude,
    status,
    message,
    cacheHit: status === 'CACHE_HIT',
    cacheMiss: status === 'CACHE_MISS',
    error: status === 'ERROR',
    rateLimited: status === 'RATE_LIMITED'
  }));
}

// Handle both POST and GET methods
export async function POST(request: Request) {
  return handleRequest(request);
}

export async function GET(request: Request) {
  return handleRequest(request);
}

async function handleRequest(request: Request) {
  try {
    let latitude: string | null = null;
    let longitude: string | null = null;

    if (request.method === 'POST') {
      const body = await request.json();
      latitude = body.latitude;
      longitude = body.longitude;
    } else {
      const { searchParams } = new URL(request.url);
      latitude = searchParams.get('latitude');
      longitude = searchParams.get('longitude');
    }

    if (!latitude || !longitude) {
      logRequest(latitude || 'null', longitude || 'null', 'ERROR', 'Missing coordinates');
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const cacheKey = `weather_${latitude}_${longitude}`;
    const cachedData = weatherCache.get(cacheKey);
    
    if (cachedData) {
      logRequest(latitude, longitude, 'CACHE_HIT', 'Serving from cache');
      return NextResponse.json(cachedData);
    }

    logRequest(latitude, longitude, 'CACHE_MISS', 'Fetching from API');
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
    );

    if (!response.ok) {
      if (response.status === 429) {
        logRequest(latitude, longitude, 'RATE_LIMITED', 'API rate limit exceeded');
        // If rate limited, try to use cached data even if expired
        const expiredCache = weatherCache.get(cacheKey);
        if (expiredCache) {
          logRequest(latitude, longitude, 'CACHE_HIT', 'Serving expired cache due to rate limit');
          return NextResponse.json(expiredCache);
        }
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a few minutes.' },
          { status: 429 }
        );
      }
      logRequest(latitude, longitude, 'ERROR', `API error: ${response.status}`);
      return NextResponse.json(
        { error: 'Failed to fetch weather data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    weatherCache.set(cacheKey, data);
    logRequest(latitude, longitude, 'SUCCESS', 'Data fetched and cached successfully');
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logRequest('unknown', 'unknown', 'ERROR', `Server error: ${errorMessage}`);
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 