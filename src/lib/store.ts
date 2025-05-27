import { create } from 'zustand';

export interface WeatherStore {
  locationName: string | null;
  latitude: number | null;
  longitude: number | null;
  selectedDayIndex: number;
  setLocationAndCoordinates: (name: string, lat: number, lng: number) => void;
  setSelectedDayIndex: (dayIndex: number) => void;
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

  setLocationAndCoordinates: (name, lat, lng) => 
    set({
      locationName: name,
      latitude: lat,
      longitude: lng,
    }),
  setSelectedDayIndex: (dayIndex) => set({ selectedDayIndex: dayIndex }),
}));