'use client';

import { MapPin, Clock } from 'lucide-react';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLoadScript, Libraries } from '@react-google-maps/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useWeatherStore } from '@/lib/store';

const weekdays = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function WeatherControls() {
  const {
    locationName,
    selectedDayIndex,
    setLocationAndCoordinates,
    setSelectedDayIndex,
  } = useWeatherStore();
  
  const [searchInput, setSearchInput] = useState(locationName || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const libraries: Libraries = ['places'];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries,
  });

  useEffect(() => {
    setSearchInput(locationName || '');
  }, [locationName]);

  const handlePlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place?.geometry?.location || !place.formatted_address) {
      console.log('No valid place selected/place object invalid');
      return;
    }
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setLocationAndCoordinates(place.formatted_address, lat, lng); // Global store update
    setSearchInput(place.formatted_address);
  }, [setLocationAndCoordinates]);

  useEffect(() => {
    if (!isLoaded || loadError || !inputRef.current) return;
    const options: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry', 'name'],
      types: ['geocode'], // Geocode is generally better for cities/addresses
    };
    if (!autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, options);
    }
    const listener = autocompleteRef.current.addListener('place_changed', handlePlaceChanged);
    return () => {
      if (google?.maps?.event && listener) google.maps.event.removeListener(listener);
    };
  }, [isLoaded, loadError, handlePlaceChanged]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <MapPin className="w-5 h-5 text-gray-600 absolute left-2 top-1/2 -translate-y-1/2" />
          <Input
            ref={inputRef}
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Search location..."
            className="w-64 text-lg font-medium pl-8"
            disabled={!isLoaded}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-500" />
        <Select 
          value={selectedDayIndex.toString()} 
          onValueChange={(value) => setSelectedDayIndex(parseInt(value, 10))}
        >
          <SelectTrigger className="w-40 border-none shadow-none bg-transparent">
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent>
            {weekdays.map(day => (
              <SelectItem key={day.value} value={day.value.toString()}>{day.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
