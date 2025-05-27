import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const weatherApiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat}%2C${lng}?unitGroup=us&key=LUVAGWSNP7YZZEC5TX3BTPUGK&contentType=json`;

  const response = await fetch(weatherApiUrl);
  const data = await response.json();
  return NextResponse.json(data);
}
