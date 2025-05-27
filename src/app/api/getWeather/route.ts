import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const weatherApiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat}%2C${lng}/${startDate}/${endDate}?unitGroup=us&key=${process.env.WEATHER_API_KEY}&contentType=json`;

  const response = await fetch(weatherApiUrl);

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch weather data (probably exceeded request limit)' }, { status: 500 });
  }

  try {
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
