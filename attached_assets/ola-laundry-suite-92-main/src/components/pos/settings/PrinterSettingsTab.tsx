
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Printer, Save } from "lucide-react";
import { PrinterSettings } from "@/types/pos-settings";

interface PrinterSettingsTabProps {
  printerSettings: PrinterSettings;
  setPrinterSettings: React.Dispatch<React.SetStateAction<PrinterSettings>>;
}

export function PrinterSettingsTab({ printerSettings, setPrinterSettings }: PrinterSettingsTabProps) {
  const handleSavePrinterSettings = () => {
    if (!printerSettings.defaultPrinter) {
      toast.error("Please select a default printer");
      return;
    }
    
    localStorage.setItem('pos_printer_settings', JSON.stringify(printerSettings));
    toast.success("Printer settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          Printer Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Default Printer</Label>
            <Select value={printerSettings.defaultPrinter} onValueChange={(value) => 
              setPrinterSettings(prev => ({ ...prev, defaultPrinter: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select printer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thermal1">Thermal Printer 1</SelectItem>
                <SelectItem value="thermal2">Thermal Printer 2</SelectItem>
                <SelectItem value="laser1">Laser Printer</SelectItem>
                <SelectItem value="inkjet1">Inkjet Printer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Paper Size</Label>
            <Select value={printerSettings.paperSize} onValueChange={(value) => 
              setPrinterSettings(prev => ({ ...prev, paperSize: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="80mm">80mm</SelectItem>
                <SelectItem value="58mm">58mm</SelectItem>
                <SelectItem value="A4">A4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Print Speed</Label>
            <Select value={printerSettings.printSpeed} onValueChange={(value) => 
              setPrinterSettings(prev => ({ ...prev, printSpeed: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Paper Type</Label>
            <Select value={printerSettings.paperType} onValueChange={(value) => 
              setPrinterSettings(prev => ({ ...prev, paperType: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thermal">Thermal</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="autoprint" 
              checked={printerSettings.autoprint}
              onCheckedChange={(checked) => 
                setPrinterSettings(prev => ({ ...prev, autoprint: checked }))
              }
            />
            <Label htmlFor="autoprint">Auto-print receipts</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="cashDrawer" 
              checked={printerSettings.enableCashDrawer}
              onCheckedChange={(checked) => 
                setPrinterSettings(prev => ({ ...prev, enableCashDrawer: checked }))
              }
            />
            <Label htmlFor="cashDrawer">Enable cash drawer</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Number of Copies</Label>
          <Input 
            type="number" 
            min="1" 
            max="5" 
            value={printerSettings.copies}
            onChange={(e) => 
              setPrinterSettings(prev => ({ ...prev, copies: parseInt(e.target.value) }))
            }
            className="w-32"
          />
        </div>

        <Button onClick={handleSavePrinterSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Printer Settings
        </Button>
      </CardContent>
    </Card>
  );
}
