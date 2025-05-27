'use client';

import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  CloudSun,
  CloudMoon,
  Moon,
  CloudFog,
  Snowflake,
  Umbrella,
} from 'lucide-react';
import { DayData, HourlyData } from '@/lib/types';
import { WeatherChart } from './weather-chart';
import { isThisWeek, subDays } from 'date-fns';
import { useWeatherStore } from '@/lib/store';
import { WeatherCardSkeleton } from './weather-card-skeleton';

interface WeatherCardProps {
  dayData?: DayData;
  isPrimaryCard: boolean;
  isLoading?: boolean;
}

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export function WeatherCard({
  dayData,
  isPrimaryCard,
  isLoading,
}: WeatherCardProps) {
  const { selectedTimeOfDayIndex } = useWeatherStore();

  if (!dayData || isLoading) {
    return <WeatherCardSkeleton />;
  }

  const getWeatherIcon = (
    iconString: string | undefined,
    datetimeEpoch: number,
    isLarge: boolean = false
  ) => {
    const hour = new Date(datetimeEpoch * 1000).getHours();
    const isNight = hour < 6 || hour > 18;
    const iconSize = isLarge ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-12 h-12';

    if (!iconString) return <Sun className={`${iconSize} text-yellow-500`} />;
    switch (iconString.toLowerCase()) {
      case 'clear-day':
        return <Sun className={`${iconSize} text-yellow-500`} />;
      case 'clear-night':
        return <Moon className={`${iconSize} text-blue-300`} />;
      case 'partly-cloudy-day':
        return <CloudSun className={`${iconSize} text-yellow-400`} />;
      case 'partly-cloudy-night':
        return <CloudMoon className={`${iconSize} text-gray-400`} />;
      case 'cloudy':
        return <Cloud className={`${iconSize} text-gray-500`} />;
      case 'rain':
        return <CloudRain className={`${iconSize} text-blue-500`} />;
      case 'showers-day':
      case 'showers-night':
        return <Umbrella className={`${iconSize} text-blue-400`} />;
      case 'snow':
      case 'snow-showers-day':
      case 'snow-showers-night':
        return <Snowflake className={`${iconSize} text-blue-200`} />;
      case 'thunder-rain':
      case 'thunder-showers-day':
      case 'thunder-showers-night':
        return <CloudRain className={`${iconSize} text-purple-500`} />;
      case 'fog':
        return <CloudFog className={`${iconSize} text-gray-400`} />;
      case 'wind':
        return <Wind className={`${iconSize} text-green-400`} />;
      default:
        return isNight ? (
          <CloudMoon className={`${iconSize} text-gray-400`} />
        ) : (
          <CloudSun className={`${iconSize} text-yellow-400`} />
        );
    }
  };

  const calculateMaxValues = (hours: HourlyData[]) => {
    if (!hours || hours.length === 0) {
      return {
        maxTemp: dayData.temp, // Fallback to daily average if no hourly data
        maxPrecipProb: dayData.precipprob,
        maxWindspeed: dayData.windspeed,
      };
    }

    // slice the hours array to only include hours in the selected time range
    const hoursInRange =
      selectedTimeOfDayIndex === 0
        ? hours.slice(8, 13)
        : selectedTimeOfDayIndex === 1
          ? hours.slice(13, 18)
          : hours.slice(17, 22);

    const maxTemp = Math.round(Math.max(...hoursInRange.map(h => h.temp)));
    const maxPrecipProb = Math.round(
      Math.max(...hoursInRange.map(h => h.precipprob))
    );
    const maxWindspeed = Math.round(
      Math.max(...hoursInRange.map(h => h.windspeed))
    );

    return { maxTemp, maxPrecipProb, maxWindspeed };
  };

  const { maxTemp, maxPrecipProb, maxWindspeed } = calculateMaxValues(
    dayData.hours
  );

  let dayLabel: string;
  const currentDate = new Date(dayData.datetimeEpoch * 1000);
  const dayOfMonth = currentDate.getDate();
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedFullDate = `${dayName} the ${dayOfMonth}${getOrdinalSuffix(dayOfMonth)}`;

  if (isPrimaryCard) {
    if (isThisWeek(currentDate)) {
      dayLabel = `This ${formattedFullDate}`;
    } else {
      dayLabel = `Upcoming ${formattedFullDate}`;
    }
  } else {
    const dateWithout7Days = subDays(currentDate, 7);
    if (isThisWeek(dateWithout7Days)) {
      dayLabel = `Next ${formattedFullDate}`;
    } else {
      dayLabel = `Following ${formattedFullDate}`;
    }
  }

  const cardTitleColor = isPrimaryCard ? 'text-red-500' : 'text-gray-900';

  return (
    <div className="flex flex-col">
      <div className="text-center pt-4">
        <h1
          className={`text-header-mobile md:text-header font-bold ${cardTitleColor}`}
        >
          {dayLabel}
        </h1>
      </div>
      <div className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="w-full justify-center flex flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex-shrink-0">
            {getWeatherIcon(dayData.icon, dayData.datetimeEpoch, true)}
          </div>
          <div className="flex flex-col space-y-1 text-left">
            <div className="text-lg sm:text-body-mobile md:text-body font-semibold">
              {dayData.conditions} {maxTemp}°F
            </div>
            <div className="flex items-center gap-1 text-small-mobile md:text-small text-gray-600">
              <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>winds {maxWindspeed}mph</span>
            </div>
            {maxPrecipProb > 0 ? (
              <div className="flex items-center gap-1 text-small-mobile md:text-small text-gray-600">
                <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{maxPrecipProb}% chance rain</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>no rain</span>
              </div>
            )}
          </div>
        </div>
        <WeatherChart hours={dayData?.hours} />
        <div className="text-center text-small-mobile md:text-small font-semibold text-gray-600">
          {selectedTimeOfDayIndex === 0
            ? 'MORNING'
            : selectedTimeOfDayIndex === 1
              ? 'AFTERNOON'
              : 'EVENING'}
        </div>
      </div>
    </div>
  );
}
