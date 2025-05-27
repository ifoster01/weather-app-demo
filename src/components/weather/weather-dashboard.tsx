'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeatherControls } from './controls';
import { WeatherCard } from './weather-card';
import { WeatherChart } from './weather-chart';
import { useWeatherStore } from '@/lib/store';

export function WeatherDashboard() {
  const { getCurrentForecast, getNextForecast } = useWeatherStore();

  const currentForecast = getCurrentForecast();
  const nextForecast = getNextForecast();

  if (!currentForecast || !nextForecast) {
    return <div>Loading weather data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <WeatherControls />

        {/* Weather Cards Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <WeatherCard forecast={currentForecast} />
          <WeatherCard forecast={nextForecast} isNext />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-8 relative">
          {/* Navigation Arrow - Left */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Current Day Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <WeatherChart data={currentForecast.hourlyData} title="afternoon" />
          </div>

          {/* Next Day Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <WeatherChart data={nextForecast.hourlyData} title="afternoon" />
          </div>

          {/* Navigation Arrow - Right */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
