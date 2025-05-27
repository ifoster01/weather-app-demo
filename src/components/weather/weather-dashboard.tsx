'use client';

import React from 'react';
// Removed ChevronLeft, ChevronRight, Button as they are commented out
import { WeatherControls } from './controls';
import { WeatherCard } from './weather-card';
import { WeatherChart } from './weather-chart';
import { useWeatherStore } from '@/lib/store';
import useWeatherData from '@/lib/hooks/useWeatherData'; // Import the hook

export function WeatherDashboard() {
  const { latitude, longitude, locationName, selectedDayIndex = 0 } = useWeatherStore();
  const { data: weatherDataHookResult, isLoading, error } = useWeatherData(); // Call the hook here

  // Calculate the actual index offset from today to the selected day of the week
  const todayDayOfWeek = new Date().getDay(); // 0 for Sunday, ..., 6 for Saturday
  const actualDayIndexOffset = (selectedDayIndex - todayDayOfWeek + 7) % 7;

  // Initial loading state based on store coordinates (pre-hook data)
  if (latitude === null || longitude === null) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div>Loading location data from store...</div>
      </div>
    );
  }

  // Loading state from the useWeatherData hook
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div>Loading weather data...</div>
      </div>
    );
  }

  // Error state from the useWeatherData hook
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-red-500">Error loading weather data: {error.message}</div>
      </div>
    );
  }

  // Ensure we have data and the specific days we need
  const primaryDayData = weatherDataHookResult?.days?.[actualDayIndexOffset];
  const secondaryDayData = weatherDataHookResult?.days?.[actualDayIndexOffset + 7];

  // Helper to format date string or return a default
  const formatDate = (datetimeEpoch: number | undefined) => {
    if (datetimeEpoch === undefined) return "Selected Day";
    const date = new Date(datetimeEpoch * 1000);
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const primaryDayDateString = primaryDayData ? formatDate(primaryDayData.datetimeEpoch) : "Selected Day";
  const secondaryDayDateString = secondaryDayData ? formatDate(secondaryDayData.datetimeEpoch) : "Selected Day Next Week";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <WeatherControls />

        {/* Weather Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8 mt-8">
          {primaryDayData ? (
            <WeatherCard dayData={primaryDayData} isPrimaryCard={true} />
          ) : (
            <div className="text-center p-4">No data for {primaryDayDateString}.</div>
          )}
          {secondaryDayData ? (
            <WeatherCard dayData={secondaryDayData} isPrimaryCard={false} />
          ) : (
            <div className="text-center p-4">No data for {secondaryDayDateString}.</div>
          )}
        </div>

        {/* Charts Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">
          Hourly Forecast for {locationName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Today's Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <WeatherChart
              lat={latitude}
              lng={longitude}
              title={`Hourly for ${primaryDayDateString}`}
              selectedDay={actualDayIndexOffset}
            />
          </div>

          {/* Tomorrow's Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <WeatherChart
              lat={latitude}
              lng={longitude}
              title={`Hourly for ${secondaryDayDateString}`}
              selectedDay={actualDayIndexOffset + 7}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
