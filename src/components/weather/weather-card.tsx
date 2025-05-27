'use client';

import React from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets } from 'lucide-react';
import { WeatherForecast } from '@/lib/store';

interface WeatherCardProps {
  forecast: WeatherForecast;
  isNext?: boolean;
}

export function WeatherCard({ forecast, isNext = false }: WeatherCardProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-12 h-12 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-12 h-12 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-12 h-12 text-blue-500" />;
      default:
        return <Sun className="w-12 h-12 text-yellow-500" />;
    }
  };

  const getConditionText = (condition: string) => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  return (
    <div className="text-center">
      <h2
        className={`text-lg font-medium mb-4 ${isNext ? 'text-gray-900' : 'text-red-500'}`}
      >
        {forecast.date}
      </h2>

      <div className="flex flex-col items-center gap-3">
        {getWeatherIcon(forecast.condition)}

        <div className="space-y-1">
          <div className="text-2xl font-semibold">
            {getConditionText(forecast.condition)} {forecast.temperature}°F
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Wind className="w-4 h-4" />
              <span>winds {forecast.windSpeed}mph</span>
            </div>

            {forecast.rainChance > 0 ? (
              <div className="flex items-center gap-1">
                <Droplets className="w-4 h-4" />
                <span>{forecast.rainChance}% chance rain</span>
              </div>
            ) : (
              <span>no rain</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
