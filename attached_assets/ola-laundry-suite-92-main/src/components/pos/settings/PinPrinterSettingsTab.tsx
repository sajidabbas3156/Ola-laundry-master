
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Lock, Save } from "lucide-react";
import { PrinterSettings } from "@/types/pos-settings";

interface PinPrinterSettingsTabProps {
  printerSettings: PrinterSettings;
  setPrinterSettings: React.Dispatch<React.SetStateAction<PrinterSettings>>;
}

export function PinPrinterSettingsTab({ printerSettings, setPrinterSettings }: PinPrinterSettingsTabProps) {
  const handleSavePinSettings = () => {
    if (printerSettings.pinEnabled && !printerSettings.pinCode.trim()) {
      toast.error("Please set a PIN code");
      return;
    }
    
    localStorage.setItem('pos_pin_printer_settings', JSON.stringify(printerSettings));
    toast.success("PIN printer settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          PIN & Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="pinEnabled" 
            checked={printerSettings.pinEnabled}
            onCheckedChange={(checked) => 
              setPrinterSettings(prev => ({ ...prev, pinEnabled: checked }))
            }
          />
          <Label htmlFor="pinEnabled">Enable PIN protection for printer access</Label>
        </div>

        {printerSettings.pinEnabled && (
          <>
            <div className="space-y-2">
              <Label>PIN Code</Label>
              <Input 
                type="password"
                placeholder="Enter 4-6 digit PIN"
                value={printerSettings.pinCode}
                onChange={(e) => 
                  setPrinterSettings(prev => ({ ...prev, pinCode: e.target.value }))
                }
                maxLength={6}
                className="w-40"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="requirePinForReprint" 
                checked={printerSettings.requirePinForReprint}
                onCheckedChange={(checked) => 
                  setPrinterSettings(prev => ({ ...prev, requirePinForReprint: checked }))
                }
              />
              <Label htmlFor="requirePinForReprint">Require PIN for receipt reprints</Label>
            </div>
          </>
        )}

        <Button onClick={handleSavePinSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save PIN Settings
        </Button>
      </CardContent>
    </Card>
  );
}
