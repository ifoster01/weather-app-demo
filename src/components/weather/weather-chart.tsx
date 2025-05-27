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
} from 'recharts';
import { WeatherData } from '@/lib/store';

interface WeatherChartProps {
  data: WeatherData[];
  title: string;
}

export function WeatherChart({ data, title }: WeatherChartProps) {
  // Transform data for the chart
  const chartData = data.map(item => ({
    time: item.time,
    temperature: item.temperature,
    humidity: item.humidity,
    pressure: (item.pressure - 1000) * 10, // Scale pressure for visibility
    windSpeed: item.windSpeed * 5, // Scale wind speed for visibility
  }));

  // Custom dot component for the current time indicator
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.time === '3:00') {
      // Highlighting 3:00 as in the design
      return (
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="white"
          stroke="#10b981"
          strokeWidth={3}
        />
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title.toUpperCase()}
        </h3>
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
          />

          {/* Reference lines for time periods */}
          <ReferenceLine
            x="3:00"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="2 2"
          />
          <ReferenceLine
            x="7:00"
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
          />

          {/* Humidity line - Green */}
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#10b981"
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={{ r: 4, fill: '#10b981' }}
          />

          {/* Pressure line - Red */}
          <Line
            type="monotone"
            dataKey="pressure"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, fill: '#ef4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
