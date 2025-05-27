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
  Text,
} from 'recharts';
import { HourlyData } from '@/lib/types';
import { useWeatherStore } from '@/lib/store';

interface WeatherChartProps {
  hours?: HourlyData[];
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

interface HourDef {
  start: number;
  end: number;
  spansMidnight: boolean;
}

interface TimeSlotConfig {
  main: HourDef;
  buffer: HourDef;
}

interface TickPayload {
  coordinate: number;
  value: string;
  index: number;
  offset: number;
  tickCoord: number;
  isShow: boolean;
}

interface CustomXAxisTickProps {
  textAnchor: string;
  verticalAnchor: string;
  orientation: string;
  width: number;
  height: number;
  x: number;
  y: number;
  className: string;
  stroke: string;
  fill: string;
  index: number;
  payload: TickPayload;
  visibleTicksCount: number;
}

const timeSlotConfigs: Record<number, TimeSlotConfig> = {
  0: {
    main:   { start: 8,  end: 12, spansMidnight: false },
    buffer: { start: 6,  end: 14, spansMidnight: false },
  },
  1: {
    main:   { start: 13, end: 17, spansMidnight: false },
    buffer: { start: 11, end: 19, spansMidnight: false },
  },
  2: {
    main:   { start: 17, end: 21, spansMidnight: false },
    buffer: { start: 15, end: 23, spansMidnight: false },
  }
};

const isHourInDef = (hourNum: number, def: HourDef): boolean => {
  if (def.spansMidnight) {
    return hourNum >= def.start || hourNum <= def.end;
  }
  return hourNum >= def.start && hourNum <= def.end;
};

const formatHourToChartTime = (hourNum24: number): string => {
  const date = new Date(2000, 0, 1, hourNum24, 0, 0);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
};

export function WeatherChart({ hours }: WeatherChartProps) {
  const { selectedTimeOfDayIndex } = useWeatherStore();

  const chartData = React.useMemo(() => {
    if (!hours) return [];

    const currentTargetSlot = timeSlotConfigs[selectedTimeOfDayIndex];
    if (!currentTargetSlot) {
      return hours.map((hour: HourlyData) => ({
        time: new Date(`2000-01-01T${hour.datetime}`).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: Math.round(hour.temp),
        humidity: Math.round(hour.humidity),
        pressure: Math.round(hour.pressure - 1000),
        precipProb: Math.round(hour.precipprob),
        uvIndex: hour.uvindex,
        cloudCover: Math.round(hour.cloudcover),
        originalHour: hour.datetime,
        isBufferZoneOnly: false,
      }));
    }

    const { buffer: bufferRange, main: mainRange } = currentTargetSlot;

    const filteredHours = hours.filter(hour => {
      const hourNum = parseInt(hour.datetime.substring(0, 2), 10);
      return isHourInDef(hourNum, bufferRange);
    });

    return filteredHours.map((hour: HourlyData) => {
      const time = new Date(`2000-01-01T${hour.datetime}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      });
      const hourNum = parseInt(hour.datetime.substring(0, 2), 10);
      const isMain = isHourInDef(hourNum, mainRange);
      
      return {
        time,
        temperature: Math.round(hour.temp),
        humidity: Math.round(hour.humidity),
        pressure: Math.round(hour.pressure - 1000),
        precipProb: Math.round(hour.precipprob),
        uvIndex: hour.uvindex,
        cloudCover: Math.round(hour.cloudcover),
        originalHour: hour.datetime,
        isBufferZoneOnly: !isMain,
      };
    });
  }, [hours, selectedTimeOfDayIndex]);

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

  const CustomXAxisTick = (props: CustomXAxisTickProps) => {
    const { x, y, payload } = props;
    
    const calculateIsBufferOnly = (value: string) => {
      // convert value from am/pm to 24 hr time
      let hour = parseInt(value.substring(0, 2), 10);
      const isPM = value.includes('PM');
      if (isPM) {
        hour += 12;
      }
      const currentTargetSlot = timeSlotConfigs[selectedTimeOfDayIndex];
      const { main: mainRange } = currentTargetSlot;
      return !isHourInDef(hour, mainRange);
    };
    const isBufferOnly = calculateIsBufferOnly(payload.value);

    return (
      <g transform={`translate(${x},${y})`}>
        <Text x={0} y={0} dy={16} textAnchor="middle" fontSize={12} fill={isBufferOnly ? 'gray' : 'black'}>
          {payload.value}
        </Text>
      </g>
    );
  };

  const getUnit = (dataKey: string) => {
    switch (dataKey) {
      case 'temperature': return '°F';
      case 'humidity': return '%';
      case 'pressure': return ' hPa';
      case 'precipProb': return '%';
      case 'uvIndex': return '';
      case 'cloudCover': return '%';
      default: return '';
    }
  };

  if (!chartData.length) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-gray-500">No weather data available</div>
      </div>
    );
  }

  let refLineXStart = '';
  let refLineXEnd = '';
  const currentTargetSlot = timeSlotConfigs[selectedTimeOfDayIndex];

  if (currentTargetSlot && chartData.length > 0) {
    const { main: mainRange } = currentTargetSlot;
    refLineXStart = formatHourToChartTime(mainRange.start);
    refLineXEnd = formatHourToChartTime((mainRange.end) % 24);
  }

  return (
    <div className="w-full h-80">
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
            tick={CustomXAxisTick}
            interval="preserveStartEnd"
          />

          <YAxis hide />

          <Tooltip content={<CustomTooltip />} />

          {refLineXStart && chartData.some(d => d.time === refLineXStart) && (
            <ReferenceLine 
              x={refLineXStart} 
              stroke="black" 
              strokeDasharray="3 3" 
              strokeWidth={2} 
            />
          )}
          {refLineXEnd && chartData.some(d => d.time === refLineXEnd) && (
            <ReferenceLine 
              x={refLineXEnd} 
              stroke="black" 
              strokeDasharray="3 3" 
              strokeWidth={2} 
            />
          )}

          <Line
            type="monotone"
            dataKey="temperature"
            stroke="oklch(63.7% 0.237 25.331)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, fill: 'oklch(63.7% 0.237 25.331)' }}
            name="Temperature"
          />

          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, fill: '#10b981' }}
            name="Humidity"
          />

          <Line
            type="monotone"
            dataKey="precipProb"
            stroke="oklch(62.3% 0.214 259.815)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: 'oklch(62.3% 0.214 259.815)' }}
            name="Precipitation Probability"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
