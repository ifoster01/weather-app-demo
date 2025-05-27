import { create } from 'zustand';

export interface WeatherStore {
  locationName: string | null;
  latitude: number | null;
  longitude: number | null;
  selectedDayIndex: number;
  selectedTimeOfDayIndex: number;
  setLocationAndCoordinates: (name: string, lat: number, lng: number) => void;
  setSelectedDayIndex: (dayIndex: number) => void;
  setSelectedTimeOfDayIndex: (timeOfDayIndex: number) => void;
  incrementDayIndex: () => void;
  decrementDayIndex: () => void;
}

const DEFAULT_LATITUDE = 37.7749;
const DEFAULT_LONGITUDE = -122.4194;
const DEFAULT_LOCATION_NAME = 'San Francisco, CA';
const getCurrentWeekday = () => new Date().getDay();

export const useWeatherStore = create<WeatherStore>((set) => ({
  locationName: DEFAULT_LOCATION_NAME,
  latitude: DEFAULT_LATITUDE,
  longitude: DEFAULT_LONGITUDE,
  selectedDayIndex: getCurrentWeekday(),
  selectedTimeOfDayIndex: 0,

  setLocationAndCoordinates: (name, lat, lng) => 
    set({
      locationName: name,
      latitude: lat,
      longitude: lng,
    }),
  setSelectedDayIndex: (dayIndex) => set({ selectedDayIndex: dayIndex }),
  setSelectedTimeOfDayIndex: (timeOfDayIndex) => set({ selectedTimeOfDayIndex: timeOfDayIndex }),
  incrementDayIndex: () => 
    set((state) => ({ 
      selectedDayIndex: Math.min(state.selectedDayIndex + 1, 6) 
    })),
  decrementDayIndex: () => 
    set((state) => ({ 
      selectedDayIndex: Math.max(state.selectedDayIndex - 1, 0) 
    })),
}));