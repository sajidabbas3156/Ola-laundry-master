
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Receipt, Save } from "lucide-react";
import { ReceiptSettings } from "@/types/pos-settings";

interface ReceiptSettingsTabProps {
  receiptSettings: ReceiptSettings;
  setReceiptSettings: React.Dispatch<React.SetStateAction<ReceiptSettings>>;
}

export function ReceiptSettingsTab({ receiptSettings, setReceiptSettings }: ReceiptSettingsTabProps) {
  const handleSaveReceiptSettings = () => {
    if (!receiptSettings.businessName.trim()) {
      toast.error("Business name is required");
      return;
    }
    
    localStorage.setItem('pos_receipt_settings', JSON.stringify(receiptSettings));
    toast.success("Receipt settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Receipt Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input 
              value={receiptSettings.businessName}
              onChange={(e) => 
                setReceiptSettings(prev => ({ ...prev, businessName: e.target.value }))
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              value={receiptSettings.phone}
              onChange={(e) => 
                setReceiptSettings(prev => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Business Address</Label>
          <Input 
            value={receiptSettings.address}
            onChange={(e) => 
              setReceiptSettings(prev => ({ ...prev, address: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Footer Message</Label>
          <Input 
            value={receiptSettings.footerMessage}
            onChange={(e) => 
              setReceiptSettings(prev => ({ ...prev, footerMessage: e.target.value }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="showLogo" 
              checked={receiptSettings.showLogo}
              onCheckedChange={(checked) => 
                setReceiptSettings(prev => ({ ...prev, showLogo: checked }))
              }
            />
            <Label htmlFor="showLogo">Show logo on receipt</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="showCustomerDetails" 
              checked={receiptSettings.showCustomerDetails}
              onCheckedChange={(checked) => 
                setReceiptSettings(prev => ({ ...prev, showCustomerDetails: checked }))
              }
            />
            <Label htmlFor="showCustomerDetails">Show customer details</Label>
          </div>
        </div>

        <Button onClick={handleSaveReceiptSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Receipt Settings
        </Button>
      </CardContent>
    </Card>
  );
}
