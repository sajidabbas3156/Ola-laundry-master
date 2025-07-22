
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
  placeholder?: string;
}

// Google Maps Loader Component
export const GoogleMapsLoader: React.FC<{ children: React.ReactNode; apiKey?: string }> = ({ children, apiKey }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey || 'YOUR_API_KEY'}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey]);

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return <>{children}</>;
};

export function LocationPicker({ onLocationSelect, initialLocation, placeholder = "Search for a location..." }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState(
    initialLocation || { lat: -34.397, lng: 150.644, address: '' }
  );

  const initializeMap = () => {
    if (!mapRef.current || !(window as any).google) return;

    const googleMaps = (window as any).google.maps;
    
    const mapInstance = new googleMaps.Map(mapRef.current, {
      center: currentLocation,
      zoom: 15,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    const markerInstance = new googleMaps.Marker({
      position: currentLocation,
      map: mapInstance,
      draggable: true,
      title: 'Selected Location'
    });

    markerInstance.addListener('dragend', () => {
      const position = markerInstance.getPosition();
      const newLocation = {
        lat: position.lat(),
        lng: position.lng(),
        address: ''
      };
      setCurrentLocation(newLocation);
      reverseGeocode(newLocation);
    });

    mapInstance.addListener('click', (event: any) => {
      const newLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        address: ''
      };
      setCurrentLocation(newLocation);
      markerInstance.setPosition(event.latLng);
      reverseGeocode(newLocation);
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const reverseGeocode = (location: { lat: number; lng: number; address: string }) => {
    if (!(window as any).google) return;

    const geocoder = new (window as any).google.maps.Geocoder();
    
    geocoder.geocode(
      { location: new (window as any).google.maps.LatLng(location.lat, location.lng) },
      (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          const fullLocation: Location = {
            ...location,
            address: results[0].formatted_address
          };
          setCurrentLocation(fullLocation);
          onLocationSelect(fullLocation);
        }
      }
    );
  };

  const searchLocation = () => {
    if (!searchQuery || !(window as any).google) return;

    const geocoder = new (window as any).google.maps.Geocoder();
    
    geocoder.geocode({ address: searchQuery }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const newLocation: Location = {
          lat: location.lat(),
          lng: location.lng(),
          address: results[0].formatted_address
        };
        
        setCurrentLocation(newLocation);
        map?.setCenter(location);
        marker?.setPosition(location);
        
        onLocationSelect(newLocation);
      }
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: ''
          };
          setCurrentLocation(newLocation);
          map?.setCenter(newLocation);
          marker?.setPosition(newLocation);
          reverseGeocode(newLocation);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  useEffect(() => {
    if ((window as any).google) {
      initializeMap();
    }
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
          />
          <Button onClick={searchLocation}>Search</Button>
        </div>
        
        <Button onClick={getCurrentLocation} variant="outline" className="w-full">
          Use Current Location
        </Button>
        
        <div
          ref={mapRef}
          className="w-full h-64 rounded-lg border"
          onLoad={initializeMap}
        />
        
        <div className="text-sm text-gray-600">
          <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
          <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
          {currentLocation.address && <p>Address: {currentLocation.address}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
