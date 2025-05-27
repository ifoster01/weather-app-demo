'use client';

import React from 'react';
import { WeatherControls } from './controls';
import { WeatherCard } from './weather-card';
import { useWeatherStore } from '@/lib/store';
import useWeatherData from '@/lib/hooks/useWeatherData'; // Import the hook
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Added Shadcn Carousel imports
import { Separator } from '../ui/separator';

export function WeatherDashboard() {
  const { latitude, longitude, selectedDayIndex, incrementDayIndex, decrementDayIndex } = useWeatherStore(); // Added selectedDayIndex and its modifiers
  const { data: weatherDataHookResult, isLoading, error } = useWeatherData();

  // Initial loading state based on store coordinates (pre-hook data)
  if (latitude === null || longitude === null) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div>Loading location data from store...</div>
      </div>
    );
  }

  // Loading state from the useWeatherData hook
  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div>Loading weather data...</div>
      </div>
    );
  }

  // Error state from the useWeatherData hook
  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center max-w-2xl mx-auto">
        <div className="text-red-500 text-center">Error loading weather data: {error.message}</div>
      </div>
    );
  }

  // Ensure we have data and the specific days we need
  // primaryDayData will now be based on selectedDayIndex
  const primaryDayData = weatherDataHookResult?.days?.[0];
  const secondaryDayData = weatherDataHookResult?.days?.[weatherDataHookResult.days.length - 1];

  // Helper to format date string or return a default
  const formatDate = (datetimeEpoch: number | undefined) => {
    if (datetimeEpoch === undefined) return "Selected Day";
    const date = new Date(datetimeEpoch * 1000);
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const primaryDayDateString = primaryDayData ? formatDate(primaryDayData.datetimeEpoch) : "Selected Day";
  const secondaryDayDateString = secondaryDayData ? formatDate(secondaryDayData.datetimeEpoch) : "Selected Day Next Week";

  return (
    <div className="min-h-screen max-w-screen p-6">
      <div className="max-w-7xl mx-auto">
        <WeatherControls />

        <Separator className="my-8 bg-black" />

        {/* Weather Cards Section with Carousel */}
        <div className="mt-8">
          <Carousel
            opts={{
              align: "start",
              loop: false, // We handle loop prevention via store actions
            }}
            className="w-full"
          >
            <CarouselContent>
              {/* We will display one primary card, controlled by selectedDayIndex */}
              {primaryDayData ? (
                <CarouselItem className="w-full md:basis-1/2"> {/* Ensure it takes up appropriate space */}
                  <WeatherCard dayData={primaryDayData} isPrimaryCard={true} />
                </CarouselItem>
              ) : (
                 <CarouselItem className="w-full md:basis-1/2">
                    <div className="text-center p-4 h-full flex items-center justify-center">No data for {primaryDayDateString}.</div>
                 </CarouselItem>
              )}
              {/* Optionally, you could show more cards here if needed, but the request focuses on one primary card changing */}
               {secondaryDayData && primaryDayData?.datetimeEpoch !== secondaryDayData.datetimeEpoch ? ( // Only show if different from primary
                <CarouselItem className="w-full md:basis-1/2">
                  <WeatherCard dayData={secondaryDayData} isPrimaryCard={false} />
                </CarouselItem>
              ) : !secondaryDayData ? (
                 <CarouselItem className="w-full md:basis-1/2">
                   <div className="text-center p-4 h-full flex items-center justify-center">No data for {secondaryDayDateString}.</div>
                 </CarouselItem>
              ) : null}
            </CarouselContent>
            <CarouselPrevious onClick={decrementDayIndex} disabled={selectedDayIndex === 0} />
            <CarouselNext onClick={incrementDayIndex} disabled={selectedDayIndex === 6} />
          </Carousel>
        </div>
        
        {/* Fallback display if no primary data, in case carousel structure above doesn't render it */}
        {!primaryDayData && !isLoading && !error && (
          <div className="text-center p-4 mt-8">No weather data available for the selected day.</div>
        )}
      </div>
    </div>
  );
}
