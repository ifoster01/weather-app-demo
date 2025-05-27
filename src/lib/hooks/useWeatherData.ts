import { useQuery } from '@tanstack/react-query';
import { WeatherData } from '@/lib/types';
import { useWeatherStore } from '@/lib/store';
import { format, addDays, getDay, startOfToday } from 'date-fns';

const getWeatherData = async (lat: number, lng: number, selectedWeekdayJS: number): Promise<WeatherData> => {
  const today = startOfToday();
  
  let firstOccurrenceDate = today;
  const currentDayOfWeekJS = getDay(today);
  
  let daysToAdd = selectedWeekdayJS - currentDayOfWeekJS;
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }
  firstOccurrenceDate = addDays(today, daysToAdd);
  const secondOccurrenceDate = addDays(firstOccurrenceDate, 7);

  const apiStartDate = format(firstOccurrenceDate, 'yyyy-MM-dd');
  const apiEndDate = format(secondOccurrenceDate, 'yyyy-MM-dd');

  const apiUrl = `/api/getWeather?lat=${lat}&lng=${lng}&startDate=${apiStartDate}&endDate=${apiEndDate}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Failed to fetch weather data. Status:", response.status, "Body:", errorBody, "URL:", apiUrl);
    throw new Error(`Failed to fetch weather data: ${response.statusText} (Status: ${response.status}) for URL: ${apiUrl}`);
  }
  const data = await response.json();
  return data;
};

const useWeatherData = () => {
  const { selectedDayIndex, latitude, longitude } = useWeatherStore();

  const { data, isLoading, error } = useQuery<WeatherData, Error>({
    queryKey: ['weather', latitude, longitude, selectedDayIndex],
    queryFn: () => {
        if (latitude === null || longitude === null) {
            return Promise.reject(new Error("Latitude or longitude is null. Query should not have run."));
        }
        return getWeatherData(latitude, longitude, selectedDayIndex);
    },
    enabled: latitude !== null && longitude !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return { data, isLoading, error };
};

export default useWeatherData;