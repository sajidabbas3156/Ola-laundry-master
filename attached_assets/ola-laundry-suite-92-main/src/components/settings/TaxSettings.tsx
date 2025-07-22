
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Calculator, Save } from "lucide-react";

export function TaxSettings() {
  const [taxSettings, setTaxSettings] = useState({
    defaultTaxRate: 5.0,
    taxIncluded: false,
    taxDisplayName: "VAT",
    taxNumber: "",
    enableMultipleTaxRates: false,
    taxRatesByCategory: {
      food: 5.0,
      services: 10.0,
      products: 15.0
    }
  });

  const handleSave = () => {
    if (taxSettings.defaultTaxRate < 0 || taxSettings.defaultTaxRate > 100) {
      toast.error("Tax rate must be between 0 and 100");
      return;
    }
    
    localStorage.setItem('tax_settings', JSON.stringify(taxSettings));
    toast.success("Tax settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Tax Configuration
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

        <div className="space-y-2">
          <Label>Tax Registration Number</Label>
          <Input 
            value={taxSettings.taxNumber}
            placeholder="Enter your tax registration number"
            onChange={(e) => 
              setTaxSettings(prev => ({ ...prev, taxNumber: e.target.value }))
            }
          />
        </div>

        <div className="space-y-4">
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

          <div className="flex items-center space-x-2">
            <Switch 
              id="multipleTaxRates" 
              checked={taxSettings.enableMultipleTaxRates}
              onCheckedChange={(checked) => 
                setTaxSettings(prev => ({ ...prev, enableMultipleTaxRates: checked }))
              }
            />
            <Label htmlFor="multipleTaxRates">Enable multiple tax rates by category</Label>
          </div>
        </div>

        {taxSettings.enableMultipleTaxRates && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tax Rates by Category</Label>
            {Object.entries(taxSettings.taxRatesByCategory).map(([category, rate]) => (
              <div key={category} className="flex items-center gap-4">
                <Label className="capitalize w-20">{category}:</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  value={rate}
                  onChange={(e) => 
                    setTaxSettings(prev => ({ 
                      ...prev, 
                      taxRatesByCategory: {
                        ...prev.taxRatesByCategory,
                        [category]: parseFloat(e.target.value)
                      }
                    }))
                  }
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Tax Settings
        </Button>
      </CardContent>
    </Card>
  );
}
