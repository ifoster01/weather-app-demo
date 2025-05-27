import { create } from 'zustand';

export interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
}

export interface WeatherForecast {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  temperature: number;
  windSpeed: number;
  rainChance: number;
  hourlyData: WeatherData[];
}

export interface WeatherStore {
  location: string;
  selectedDay: string;
  selectedPeriod: 'morning' | 'afternoon' | 'evening';
  forecasts: Record<string, WeatherForecast>;
  setLocation: (location: string) => void;
  setSelectedDay: (day: string) => void;
  setSelectedPeriod: (period: 'morning' | 'afternoon' | 'evening') => void;
  getCurrentForecast: () => WeatherForecast | null;
  getNextForecast: () => WeatherForecast | null;
}

// Mock data for demonstration
const mockForecasts: Record<string, WeatherForecast> = {
  'friday-15th': {
    date: 'This Friday the 15th',
    condition: 'sunny',
    temperature: 71,
    windSpeed: 5,
    rainChance: 0,
    hourlyData: [
      {
        time: '11:00',
        temperature: 68,
        humidity: 45,
        pressure: 1013,
        windSpeed: 4,
      },
      {
        time: '12:00',
        temperature: 70,
        humidity: 42,
        pressure: 1014,
        windSpeed: 5,
      },
      {
        time: '1:00',
        temperature: 71,
        humidity: 40,
        pressure: 1015,
        windSpeed: 5,
      },
      {
        time: '2:00',
        temperature: 72,
        humidity: 38,
        pressure: 1016,
        windSpeed: 6,
      },
      {
        time: '3:00',
        temperature: 73,
        humidity: 37,
        pressure: 1017,
        windSpeed: 6,
      },
      {
        time: '4:00',
        temperature: 72,
        humidity: 39,
        pressure: 1016,
        windSpeed: 5,
      },
      {
        time: '5:00',
        temperature: 70,
        humidity: 42,
        pressure: 1015,
        windSpeed: 4,
      },
      {
        time: '6:00',
        temperature: 68,
        humidity: 45,
        pressure: 1014,
        windSpeed: 3,
      },
      {
        time: '7:00',
        temperature: 66,
        humidity: 48,
        pressure: 1013,
        windSpeed: 2,
      },
      {
        time: '8:00',
        temperature: 64,
        humidity: 52,
        pressure: 1012,
        windSpeed: 2,
      },
    ],
  },
  'next-friday-15th': {
    date: 'Next Friday the 15th',
    condition: 'cloudy',
    temperature: 62,
    windSpeed: 6,
    rainChance: 40,
    hourlyData: [
      {
        time: '11:00',
        temperature: 59,
        humidity: 65,
        pressure: 1008,
        windSpeed: 5,
      },
      {
        time: '12:00',
        temperature: 60,
        humidity: 63,
        pressure: 1009,
        windSpeed: 6,
      },
      {
        time: '1:00',
        temperature: 61,
        humidity: 62,
        pressure: 1010,
        windSpeed: 6,
      },
      {
        time: '2:00',
        temperature: 62,
        humidity: 60,
        pressure: 1011,
        windSpeed: 7,
      },
      {
        time: '3:00',
        temperature: 63,
        humidity: 58,
        pressure: 1012,
        windSpeed: 7,
      },
      {
        time: '4:00',
        temperature: 62,
        humidity: 60,
        pressure: 1011,
        windSpeed: 6,
      },
      {
        time: '5:00',
        temperature: 61,
        humidity: 62,
        pressure: 1010,
        windSpeed: 5,
      },
      {
        time: '6:00',
        temperature: 59,
        humidity: 65,
        pressure: 1009,
        windSpeed: 4,
      },
      {
        time: '7:00',
        temperature: 58,
        humidity: 68,
        pressure: 1008,
        windSpeed: 3,
      },
      {
        time: '8:00',
        temperature: 56,
        humidity: 72,
        pressure: 1007,
        windSpeed: 3,
      },
    ],
  },
};

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  location: 'Dolores Park, SF',
  selectedDay: 'Friday',
  selectedPeriod: 'afternoon',
  forecasts: mockForecasts,

  setLocation: location => set({ location }),
  setSelectedDay: day => set({ selectedDay: day }),
  setSelectedPeriod: period => set({ selectedPeriod: period }),

  getCurrentForecast: () => {
    const { forecasts } = get();
    return forecasts['friday-15th'] || null;
  },

  getNextForecast: () => {
    const { forecasts } = get();
    return forecasts['next-friday-15th'] || null;
  },
}));
