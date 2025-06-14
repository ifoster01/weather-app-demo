'use client';

import React from 'react';
import { WeatherControls } from './controls';
import { WeatherCard } from './weather-card';
import { useWeatherStore } from '@/lib/store';
import useWeatherData from '@/lib/hooks/useWeatherData';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { WeatherCardSkeleton } from './weather-card-skeleton';

export function WeatherDashboard() {
  const {
    latitude,
    longitude,
    selectedDayIndex,
    incrementDayIndex,
    decrementDayIndex,
  } = useWeatherStore(); // Added selectedDayIndex and its modifiers
  const { data: weatherDataHookResult, isLoading, error } = useWeatherData();

  // Initial loading state based on store coordinates (pre-hook data)
  if (latitude === null || longitude === null) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div>Loading location data from store...</div>
      </div>
    );
  }

  // Error state from the useWeatherData hook
  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center max-w-2xl mx-auto">
        <div className="text-red-500 text-center">
          Error loading weather data: {error.message}
        </div>
      </div>
    );
  }

  // Ensure we have data and the specific days we need
  // primaryDayData will now be based on selectedDayIndex
  const primaryDayData = weatherDataHookResult?.days?.[0];
  const secondaryDayData =
    weatherDataHookResult?.days?.[weatherDataHookResult.days.length - 1];

  // Helper to format date string or return a default
  const formatDate = (datetimeEpoch: number | undefined) => {
    if (datetimeEpoch === undefined) return 'Selected Day';
    const date = new Date(datetimeEpoch * 1000);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const primaryDayDateString = primaryDayData
    ? formatDate(primaryDayData.datetimeEpoch)
    : 'Selected Day';
  const secondaryDayDateString = secondaryDayData
    ? formatDate(secondaryDayData.datetimeEpoch)
    : 'Selected Day Next Week';

  return (
    <div className="min-h-screen max-w-screen p-6">
      <div className="max-w-6xl mx-auto">
        <WeatherControls />

        <div className="my-8 h-0.5 w-full bg-gray-200 rounded-full" />

        {/* Weather Cards Section with Carousel */}
        <div className="mt-8">
          <Carousel
            opts={{
              align: 'start',
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent>
              {primaryDayData ? (
                <CarouselItem className="w-full md:basis-1/2">
                  <WeatherCard
                    dayData={primaryDayData}
                    isPrimaryCard={true}
                    isLoading={isLoading}
                  />
                </CarouselItem>
              ) : isLoading ? (
                <CarouselItem className="w-full md:basis-1/2">
                  <WeatherCardSkeleton />
                </CarouselItem>
              ) : (
                <CarouselItem className="w-full md:basis-1/2">
                  <div className="text-center p-4 h-full flex items-center justify-center">
                    No data for {primaryDayDateString}.
                  </div>
                </CarouselItem>
              )}
              {secondaryDayData &&
              primaryDayData?.datetimeEpoch !==
                secondaryDayData.datetimeEpoch ? (
                <CarouselItem className="w-full md:basis-1/2">
                  <WeatherCard
                    dayData={secondaryDayData}
                    isPrimaryCard={false}
                    isLoading={isLoading}
                  />
                </CarouselItem>
              ) : isLoading ? (
                <CarouselItem className="w-full md:basis-1/2">
                  <WeatherCardSkeleton />
                </CarouselItem>
              ) : !secondaryDayData ? (
                <CarouselItem className="w-full md:basis-1/2">
                  <div className="text-center p-4 h-full flex items-center justify-center">
                    No data for {secondaryDayDateString}.
                  </div>
                </CarouselItem>
              ) : null}
            </CarouselContent>
            <CarouselPrevious
              className="hidden xl:flex"
              onClick={decrementDayIndex}
              disabled={selectedDayIndex === 0}
            />
            <CarouselNext
              className="hidden xl:flex"
              onClick={incrementDayIndex}
              disabled={selectedDayIndex === 6}
            />
          </Carousel>
          <div className="xl:hidden flex justify-center mt-4 gap-2">
            <Button
              variant="ghost"
              onClick={decrementDayIndex}
              disabled={selectedDayIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="ghost"
              onClick={incrementDayIndex}
              disabled={selectedDayIndex === 6}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="md:hidden text-center text-sm text-gray-500 mt-4">
            Swipe left/right to see next week&apos;s weather.
          </div>
        </div>

        {/* Fallback display if no primary data, in case carousel structure above doesn't render it */}
        {!primaryDayData && !isLoading && !error && (
          <div className="text-center p-4 mt-8">
            No weather data available for the selected day.
          </div>
        )}
      </div>
    </div>
  );
}
