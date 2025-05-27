'use client';

import React from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets, CloudSun, CloudMoon, Moon, CloudFog, Snowflake, Umbrella } from 'lucide-react';
import { DayData } from '@/lib/types';
import { startOfToday, addDays, isSameDay } from 'date-fns';

interface WeatherCardProps {
  dayData: DayData;
  isPrimaryCard: boolean;
}

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export function WeatherCard({ dayData, isPrimaryCard }: WeatherCardProps) {
  const getWeatherIcon = (iconString: string | undefined, datetimeEpoch: number, isLarge: boolean = false) => {
    const hour = new Date(datetimeEpoch * 1000).getHours();
    const isNight = hour < 6 || hour > 18;
    const iconSize = isLarge ? "w-16 h-16 sm:w-20 sm:h-20" : "w-12 h-12";

    if (!iconString) return <Sun className={`${iconSize} text-yellow-500`} />;
    switch (iconString.toLowerCase()) {
      case 'clear-day': return <Sun className={`${iconSize} text-yellow-500`} />;
      case 'clear-night': return <Moon className={`${iconSize} text-blue-300`} />;
      case 'partly-cloudy-day': return <CloudSun className={`${iconSize} text-yellow-400`} />;
      case 'partly-cloudy-night': return <CloudMoon className={`${iconSize} text-gray-400`} />;
      case 'cloudy': return <Cloud className={`${iconSize} text-gray-500`} />;
      case 'rain': return <CloudRain className={`${iconSize} text-blue-500`} />;
      case 'showers-day':
      case 'showers-night': return <Umbrella className={`${iconSize} text-blue-400`} />;
      case 'snow':
      case 'snow-showers-day':
      case 'snow-showers-night': return <Snowflake className={`${iconSize} text-blue-200`} />;
      case 'thunder-rain':
      case 'thunder-showers-day':
      case 'thunder-showers-night': return <CloudRain className={`${iconSize} text-purple-500`} />;
      case 'fog': return <CloudFog className={`${iconSize} text-gray-400`} />;
      case 'wind': return <Wind className={`${iconSize} text-green-400`} />;
      default: return isNight ? <CloudMoon className={`${iconSize} text-gray-400`} /> : <CloudSun className={`${iconSize} text-yellow-400`} />;
    }
  };

  let dayLabel: string;
  const currentDate = new Date(dayData.datetimeEpoch * 1000);
  const dayOfMonth = currentDate.getDate();
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedFullDate = `${dayName} the ${dayOfMonth}${getOrdinalSuffix(dayOfMonth)}`;
  const today = startOfToday();

  if (isPrimaryCard) {
    if (isSameDay(currentDate, today)) {
      dayLabel = `This ${formattedFullDate}`;
    } else {
      dayLabel = formattedFullDate;
    }
  } else {
    if (isSameDay(currentDate, addDays(today, 1))) {
      dayLabel = 'Tomorrow';
    } else {
      dayLabel = formattedFullDate;
    }
  }
  
  const cardTitleColor = isPrimaryCard ? 'text-red-500' : 'text-gray-900';

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center ${cardTitleColor}`}>
        {dayLabel}
      </h2>
      <div className="flex flex-row items-center gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          {getWeatherIcon(dayData.icon, dayData.datetimeEpoch, true)}
        </div>
        <div className="flex flex-col space-y-1 text-left">
          <div className="text-lg sm:text-xl font-semibold">
            {dayData.conditions} {Math.round(dayData.temp)}°F
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
            <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>winds {Math.round(dayData.windspeed)}mph</span>
          </div>
          {dayData.precipprob > 0.01 ? (
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
              <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{Math.round(dayData.precipprob)}% chance rain</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
              <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
              <span>no rain</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
