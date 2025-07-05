// components/MapSelector.tsx
"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";

interface MapSelectorProps {
  lat: number;
  lng: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const MapSelector: React.FC<MapSelectorProps> = ({ lat, lng, onLocationSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>({ lat, lng });
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle initial position and current location
  useEffect(() => {
    if (isLoaded) {
      setMarkerPosition({ lat, lng });
    }
  }, [lat, lng, isLoaded]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setMarkerPosition({ lat: newLat, lng: newLng });
    onLocationSelect(newLat, newLng);
  }, [onLocationSelect]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry || !place.geometry.location) return;
      
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      
      setMarkerPosition(location);
      onLocationSelect(location.lat, location.lng);
      mapRef.current?.panTo(location);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMarkerPosition(location);
          onLocationSelect(location.lat, location.lng);
          mapRef.current?.panTo(location);
        },
        () => {
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="relative">
      {/* Search bar - now with pointer-events-none on container and pointer-events-auto on input */}
      <div className=" mt-2 mb-4 right-0 z-10 flex justify-center pointer-events-none">
        <div className="w-full max-w-md bg-[#2a2a2a] rounded-md shadow-md p-0 flex pointer-events-auto">
          <Autocomplete
            onLoad={(autocomplete) => autocompleteRef.current = autocomplete}
            onPlaceChanged={onPlaceChanged}
            className="flex-grow"
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for places..."
              className="w-full p-2 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Autocomplete>
        </div>
      </div>

      {/* Current location button - adjusted position */}
      <div className="absolute bottom-35 right-2 z-10">
        <button
          onClick={handleCurrentLocation}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          title="Use current location"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPosition}
        zoom={15}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </div>
  );
};

export default MapSelector;