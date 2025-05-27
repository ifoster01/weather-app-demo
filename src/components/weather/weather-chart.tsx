'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import { HourlyData } from '@/lib/types';
import useWeatherData from '@/lib/hooks/useWeatherData';

interface WeatherChartProps {
  lat: number;
  lng: number;
  title: string;
  selectedDay?: number; // Index of the day to display (0 = today, 1 = tomorrow, etc.)
}

interface PayloadEntry {
  color: string;
  name: string;
  value: number | string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: string;
}

export function WeatherChart({ title, selectedDay = 0 }: WeatherChartProps) {
  const { data: weatherData, isLoading, error } = useWeatherData();
  
  // Transform weather API data for the chart
  const chartData = React.useMemo(() => {
    if (!weatherData?.days?.[selectedDay]?.hours) return [];

    return weatherData.days[selectedDay].hours.map((hour: HourlyData) => {
      // Extract hour from datetime (e.g., "14:00:00" -> "2:00 PM")
      const time = new Date(`2000-01-01T${hour.datetime}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      });

      return {
        time,
        temperature: Math.round(hour.temp),
        humidity: Math.round(hour.humidity),
        pressure: Math.round(hour.pressure - 1000), // Normalize pressure for better visualization
        windSpeed: Math.round(hour.windspeed),
        uvIndex: hour.uvindex,
        cloudCover: Math.round(hour.cloudcover),
        originalHour: hour.datetime,
      };
    });
  }, [weatherData, selectedDay]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`Time: ${label}`}</p>
          {payload.map((entry: PayloadEntry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}${getUnit(entry.dataKey)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getUnit = (dataKey: string) => {
    switch (dataKey) {
      case 'temperature': return '°F';
      case 'humidity': return '%';
      case 'pressure': return ' hPa';
      case 'windSpeed': return ' mph';
      case 'uvIndex': return '';
      case 'cloudCover': return '%';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-gray-500">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-red-500">Error loading weather data</div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-gray-500">No weather data available</div>
      </div>
    );
  }

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true
  });

  return (
    <div className="w-full h-80">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title.toUpperCase()}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {weatherData?.days?.[selectedDay]?.datetime && 
            new Date(weatherData.days[selectedDay].datetime).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })
          }
        </p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            interval="preserveStartEnd"
          />

          <YAxis hide />

          <Tooltip content={<CustomTooltip />} />

          {/* Reference line for current time */}
          <ReferenceLine
            x={currentTime}
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="2 2"
          />

          {/* Temperature line - Blue */}
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
            name="Temperature"
          />

          {/* Humidity line - Green */}
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, fill: '#10b981' }}
            name="Humidity"
          />

          {/* Wind Speed line - Purple */}
          <Line
            type="monotone"
            dataKey="windSpeed"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#8b5cf6' }}
            name="Wind Speed"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
