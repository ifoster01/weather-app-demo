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
import { Button } from '../ui/button';
import useWeatherData from '@/lib/hooks/useWeatherData';

export function WeatherControls() {
  const {
    location,
    selectedDay,
    selectedPeriod,
    setLocation,
    setSelectedDay,
    setSelectedPeriod,
  } = useWeatherStore();
  
  const [searchInput, setSearchInput] = useState(location || '');
  const [searchCoordinates, setSearchCoordinates] = useState({
    lat: 37.7597,
    lng: -122.4281,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const { data, isLoading, error } = useWeatherData(searchCoordinates.lat, searchCoordinates.lng);
  console.log(data);


  const libraries: Libraries = ['places'];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries,
  });

  useEffect(() => {
    setSearchInput(location || '');
  }, [location]);

  const handlePlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();

    if (
      !place ||
      !place.geometry ||
      !place.formatted_address ||
      !place.geometry.location
    ) {
      console.log('No valid place selected/place object invalid');
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setSearchCoordinates({ lat, lng });
    setLocation(place.formatted_address);
    setSearchInput(place.formatted_address);
  }, [setLocation, setSearchCoordinates]);

  useEffect(() => {
    if (!isLoaded || loadError || !inputRef.current) return;

    const options: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry', 'name'],
      types: ['establishment', 'geocode'],
    };

    if (!autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        options
      );
    }
    const listener = autocompleteRef.current.addListener(
      'place_changed',
      handlePlaceChanged
    );

    return () => {
      if (google && google.maps && google.maps.event && listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [isLoaded, loadError, handlePlaceChanged]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Location Selector - Always an Input now */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <MapPin className="w-5 h-5 text-gray-600 absolute left-2 top-1/2 -translate-y-1/2" />
          <Input
            ref={inputRef}
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Search for a location..."
            className="w-64 text-lg font-medium pl-8"
            onFocus={() => {
              if (
                searchInput === 'No valid place selected/place object invalid'
              )
                setSearchInput('');
            }}
          />
        </div>
      </div>

      {/* Day and Time Selectors */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-36 border-none shadow-none bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monday">Monday</SelectItem>
              <SelectItem value="Tuesday">Tuesday</SelectItem>
              <SelectItem value="Wednesday">Wednesday</SelectItem>
              <SelectItem value="Thursday">Thursday</SelectItem>
              <SelectItem value="Friday">Friday</SelectItem>
              <SelectItem value="Saturday">Saturday</SelectItem>
              <SelectItem value="Sunday">Sunday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select
          value={selectedPeriod}
          onValueChange={value =>
            setSelectedPeriod(value as 'morning' | 'afternoon' | 'evening')
          }
        >
          <SelectTrigger className="w-32 border-none shadow-none bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="afternoon">Afternoon</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
