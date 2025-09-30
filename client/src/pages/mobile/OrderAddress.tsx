import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Search,
  Loader2
} from "lucide-react";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface AddressData {
  latitude: number;
  longitude: number;
  streetAddress: string;
  buildingNumber: string;
  additionalNotes: string;
  fullAddress: string;
  serviceType: string;
}

// Component to handle map click events
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function OrderAddress() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const mapRef = useRef<L.Map | null>(null);
  
  // Get selected service from session storage
  const selectedService = sessionStorage.getItem("selectedService") || "wash";
  
  // Map state
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Form state
  const [searchQuery, setSearchQuery] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  // Default center (Bahrain)
  const defaultCenter: [number, number] = [26.0667, 50.5577];

  // Get current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        description: "Geolocation is not supported by your browser"
      });
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setPosition([lat, lng]);
        
        // Reverse geocode to get address
        await reverseGeocode(lat, lng);
        
        // Center map on current location
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 16);
        }
        
        setIsLoadingLocation(false);
        toast({
          description: "Location detected successfully"
        });
      },
      (error) => {
        setIsLoadingLocation(false);
        toast({
          variant: "destructive",
          description: "Unable to retrieve your location. Please enable location services."
        });
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        const address = data.address || {};
        const street = address.road || address.street || "";
        const houseNumber = address.house_number || "";
        const city = address.city || address.town || address.village || "";
        const country = address.country || "";
        
        const fullAddress = data.display_name;
        const streetAddr = street ? `${houseNumber} ${street}`.trim() : fullAddress.split(',')[0];
        
        setStreetAddress(streetAddr || fullAddress);
        setBuildingNumber(houseNumber);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  // Search for address
  const searchAddress = async () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        description: "Please enter an address to search"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}, Bahrain&addressdetails=1&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        setPosition([lat, lng]);
        
        // Parse address details
        const address = result.address || {};
        const street = address.road || address.street || "";
        const houseNumber = address.house_number || "";
        
        const streetAddr = street ? `${houseNumber} ${street}`.trim() : result.display_name.split(',')[0];
        
        setStreetAddress(streetAddr || result.display_name);
        setBuildingNumber(houseNumber);
        
        // Center map on search result
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 16);
        }
        
        toast({
          description: "Address found"
        });
      } else {
        toast({
          variant: "destructive",
          description: "Address not found. Please try a different search."
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        variant: "destructive",
        description: "Error searching for address"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle map click
  const handleMapClick = async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    await reverseGeocode(lat, lng);
  };

  // Handle continue button
  const handleContinue = () => {
    if (!position || !streetAddress) {
      toast({
        variant: "destructive",
        description: "Please select a delivery address"
      });
      return;
    }

    // Store address data (in real app, this would be stored in context or state management)
    const addressData: AddressData = {
      latitude: position[0],
      longitude: position[1],
      streetAddress,
      buildingNumber,
      additionalNotes,
      fullAddress: `${streetAddress}, ${buildingNumber ? buildingNumber + ', ' : ''}Bahrain`.trim(),
      serviceType: selectedService
    };
    
    // Store the complete order data in sessionStorage for next steps
    sessionStorage.setItem("orderAddress", JSON.stringify(addressData));

    // Log the data for demo purposes
    console.log("Address data:", addressData);
    
    toast({
      description: "Address saved successfully"
    });

    // Navigate to next step (for now, back to customer app)
    setLocation("/customer-app");
  };

  // Set map ref when map is ready
  const setMapInstance = (map: L.Map | null) => {
    mapRef.current = map;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-[1000]">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/customer-app/new-order")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-foreground">Delivery Address</h1>
            <p className="text-xs text-muted-foreground">Select where to deliver your order</p>
          </div>
        </div>
      </header>

      <div className="pb-20">
        {/* Search Bar */}
        <div className="p-4 bg-card border-b">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for an address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchAddress()}
                className="pl-10"
                data-testid="input-address-search"
              />
            </div>
            <Button
              onClick={searchAddress}
              disabled={isSearching}
              data-testid="button-search"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-[400px] w-full">
          <MapContainer
            center={position || defaultCenter}
            zoom={13}
            className="h-full w-full z-0"
            ref={setMapInstance}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {position && <Marker position={position} />}
            <MapClickHandler onLocationSelect={handleMapClick} />
          </MapContainer>
          
          {/* Current Location Button */}
          <Button
            className="absolute bottom-4 right-4 z-[400] shadow-lg"
            size="icon"
            variant="secondary"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            data-testid="button-current-location"
          >
            {isLoadingLocation ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Navigation className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Address Form */}
        <div className="p-4 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="street-address">Street Address</Label>
                    <Input
                      id="street-address"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Enter street address"
                      data-testid="input-street-address"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="building-number">Building/Apartment Number</Label>
                    <Input
                      id="building-number"
                      value={buildingNumber}
                      onChange={(e) => setBuildingNumber(e.target.value)}
                      placeholder="e.g., Apt 4B, Building 12"
                      data-testid="input-building-number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="additional-notes">Additional Notes/Landmarks</Label>
                    <Textarea
                      id="additional-notes"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="e.g., Near the blue gate, opposite the mosque"
                      rows={3}
                      data-testid="input-additional-notes"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {position && (
            <div className="text-sm text-muted-foreground">
              <p>📍 Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button
          className="w-full"
          size="lg"
          disabled={!position || !streetAddress}
          onClick={handleContinue}
          data-testid="button-continue"
        >
          Continue to Order Details
        </Button>
      </div>
    </div>
  );
}