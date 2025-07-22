
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Settings, Plus, Trash2 } from "lucide-react";
import { ServiceSettings } from "@/types/pos-settings";

interface ServicesTabProps {
  serviceSettings: ServiceSettings[];
  setServiceSettings: React.Dispatch<React.SetStateAction<ServiceSettings[]>>;
}

export function ServicesTab({ serviceSettings, setServiceSettings }: ServicesTabProps) {
  const [newService, setNewService] = useState({ name: "", description: "", priceMultiplier: 1.0 });

  const handleAddService = () => {
    if (newService.name.trim()) {
      const service: ServiceSettings = {
        id: newService.name.toLowerCase().replace(/\s+/g, '-'),
        name: newService.name,
        description: newService.description,
        priceMultiplier: newService.priceMultiplier,
        customPrices: {}
      };
      setServiceSettings(prev => [...prev, service]);
      setNewService({ name: "", description: "", priceMultiplier: 1.0 });
      toast.success("Service added successfully!");
    }
  };

  const handleDeleteService = (serviceId: string) => {
    setServiceSettings(prev => prev.filter(s => s.id !== serviceId));
    toast.success("Service deleted successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Service Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {serviceSettings.map((service) => (
          <div key={service.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Label>Multiplier:</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={service.priceMultiplier}
                    onChange={(e) => {
                      const newMultiplier = parseFloat(e.target.value);
                      setServiceSettings(prev => prev.map(s => 
                        s.id === service.id ? { ...s, priceMultiplier: newMultiplier } : s
                      ));
                    }}
                    className="w-20"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="border rounded-lg p-4 bg-muted/50">
          <h4 className="font-medium mb-3">Add New Service</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Service name"
              value={newService.name}
              onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Description"
              value={newService.description}
              onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Price multiplier"
              min="0"
              step="0.1"
              value={newService.priceMultiplier}
              onChange={(e) => setNewService(prev => ({ ...prev, priceMultiplier: parseFloat(e.target.value) }))}
            />
            <Button onClick={handleAddService}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
