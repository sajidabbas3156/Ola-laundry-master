
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LocationPicker, GoogleMapsLoader, Location } from "@/components/maps/LocationPicker";
import { useTenant } from "@/contexts/TenantContext";

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSave: (location: Location) => void;
  initialLocation?: Location;
}

export function LocationDialog({ 
  open, 
  onOpenChange, 
  onLocationSave, 
  initialLocation 
}: LocationDialogProps) {
  const { currentTenant } = useTenant();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation || null);

  const handleSave = () => {
    if (selectedLocation) {
      onLocationSave(selectedLocation);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Customer Location</DialogTitle>
        </DialogHeader>

        <GoogleMapsLoader apiKey={currentTenant?.googleMapsApiKey}>
          <LocationPicker
            onLocationSelect={setSelectedLocation}
            initialLocation={initialLocation}
            placeholder="Search for customer address..."
          />
        </GoogleMapsLoader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedLocation}>
            Save Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
