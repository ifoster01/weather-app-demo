import { useQuery } from '@tanstack/react-query';

const getWeatherData = async (lat: number, lng: number) => {
  const response = await fetch(`/api/getWeather?lat=${lat}&lng=${lng}`);
  const data = await response.json();
  return data;
};

const useWeatherData = (lat: number, lng: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather', lat, lng],
    queryFn: () => getWeatherData(lat, lng),
  });

  return { data, isLoading, error };
};

export default useWeatherData;