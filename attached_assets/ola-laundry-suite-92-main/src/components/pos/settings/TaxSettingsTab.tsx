
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Calculator, Save } from "lucide-react";
import { TaxSettings } from "@/types/pos-settings";

interface TaxSettingsTabProps {
  taxSettings: TaxSettings;
  setTaxSettings: React.Dispatch<React.SetStateAction<TaxSettings>>;
}

export function TaxSettingsTab({ taxSettings, setTaxSettings }: TaxSettingsTabProps) {
  const handleSaveTaxSettings = () => {
    if (taxSettings.defaultTaxRate < 0 || taxSettings.defaultTaxRate > 100) {
      toast.error("Tax rate must be between 0 and 100");
      return;
    }
    
    localStorage.setItem('pos_tax_settings', JSON.stringify(taxSettings));
    toast.success("Tax settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Tax Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Default Tax Rate (%)</Label>
            <Input 
              type="number" 
              step="0.1" 
              value={taxSettings.defaultTaxRate}
              onChange={(e) => 
                setTaxSettings(prev => ({ ...prev, defaultTaxRate: parseFloat(e.target.value) }))
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tax Display Name</Label>
            <Input 
              value={taxSettings.taxDisplayName}
              onChange={(e) => 
                setTaxSettings(prev => ({ ...prev, taxDisplayName: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="taxIncluded" 
            checked={taxSettings.taxIncluded}
            onCheckedChange={(checked) => 
              setTaxSettings(prev => ({ ...prev, taxIncluded: checked }))
            }
          />
          <Label htmlFor="taxIncluded">Tax included in item prices</Label>
        </div>

        <Button onClick={handleSaveTaxSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Tax Settings
        </Button>
      </CardContent>
    </Card>
  );
}
