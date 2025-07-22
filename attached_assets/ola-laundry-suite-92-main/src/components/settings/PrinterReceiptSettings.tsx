
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Printer, Receipt, Save, Eye } from "lucide-react";

export function PrinterReceiptSettings() {
  const [printerSettings, setPrinterSettings] = useState({
    defaultPrinter: "thermal1",
    autoprint: true,
    paperSize: "80mm",
    copies: 1,
    enableCashDrawer: true,
    printSpeed: "normal",
    paperType: "thermal"
  });

  const [receiptSettings, setReceiptSettings] = useState({
    businessName: "Your Business Name",
    address: "123 Business Street, City",
    phone: "123-456-7890",
    email: "contact@business.com",
    website: "www.business.com",
    showLogo: true,
    showCustomerDetails: true,
    footerMessage: "Thank you for your business!",
    showBarcode: true,
    showQRCode: false,
    receiptWidth: "300px",
    fontSize: "12px"
  });

  const [customization, setCustomization] = useState({
    headerColor: "#000000",
    textColor: "#000000",
    backgroundColor: "#ffffff",
    fontFamily: "Courier New",
    showBorder: true,
    borderStyle: "solid"
  });

  const handleSavePrinter = () => {
    localStorage.setItem('printer_settings', JSON.stringify(printerSettings));
    toast.success("Printer settings saved successfully!");
  };

  const handleSaveReceipt = () => {
    localStorage.setItem('receipt_settings', JSON.stringify(receiptSettings));
    toast.success("Receipt settings saved successfully!");
  };

  const handleSaveCustomization = () => {
    localStorage.setItem('receipt_customization', JSON.stringify(customization));
    toast.success("Receipt customization saved successfully!");
  };

  const handlePreviewReceipt = () => {
    toast.success("Receipt preview opened in new window");
    // This would open a preview window
  };

  return (
    <Tabs defaultValue="printer" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="printer">Printer Config</TabsTrigger>
        <TabsTrigger value="receipt">Receipt Settings</TabsTrigger>
        <TabsTrigger value="customization">Customization</TabsTrigger>
      </TabsList>

      <TabsContent value="printer">
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
                    <SelectValue />
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
                <Label>Number of Copies</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="5" 
                  value={printerSettings.copies}
                  onChange={(e) => 
                    setPrinterSettings(prev => ({ ...prev, copies: parseInt(e.target.value) }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={printerSettings.autoprint}
                  onCheckedChange={(checked) => 
                    setPrinterSettings(prev => ({ ...prev, autoprint: checked }))
                  }
                />
                <Label>Auto-print receipts</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={printerSettings.enableCashDrawer}
                  onCheckedChange={(checked) => 
                    setPrinterSettings(prev => ({ ...prev, enableCashDrawer: checked }))
                  }
                />
                <Label>Enable cash drawer</Label>
              </div>
            </div>

            <Button onClick={handleSavePrinter} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Printer Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="receipt">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Receipt Settings
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
              <Textarea 
                value={receiptSettings.address}
                onChange={(e) => 
                  setReceiptSettings(prev => ({ ...prev, address: e.target.value }))
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={receiptSettings.email}
                  onChange={(e) => 
                    setReceiptSettings(prev => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>Website</Label>
                <Input 
                  value={receiptSettings.website}
                  onChange={(e) => 
                    setReceiptSettings(prev => ({ ...prev, website: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Footer Message</Label>
              <Textarea 
                value={receiptSettings.footerMessage}
                onChange={(e) => 
                  setReceiptSettings(prev => ({ ...prev, footerMessage: e.target.value }))
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={receiptSettings.showLogo}
                  onCheckedChange={(checked) => 
                    setReceiptSettings(prev => ({ ...prev, showLogo: checked }))
                  }
                />
                <Label>Show logo on receipt</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={receiptSettings.showCustomerDetails}
                  onCheckedChange={(checked) => 
                    setReceiptSettings(prev => ({ ...prev, showCustomerDetails: checked }))
                  }
                />
                <Label>Show customer details</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={receiptSettings.showBarcode}
                  onCheckedChange={(checked) => 
                    setReceiptSettings(prev => ({ ...prev, showBarcode: checked }))
                  }
                />
                <Label>Show barcode</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={receiptSettings.showQRCode}
                  onCheckedChange={(checked) => 
                    setReceiptSettings(prev => ({ ...prev, showQRCode: checked }))
                  }
                />
                <Label>Show QR code</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveReceipt} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Receipt Settings
              </Button>
              <Button onClick={handlePreviewReceipt} variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="customization">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Customization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select value={customization.fontFamily} onValueChange={(value) => 
                  setCustomization(prev => ({ ...prev, fontFamily: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select value={receiptSettings.fontSize} onValueChange={(value) => 
                  setReceiptSettings(prev => ({ ...prev, fontSize: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10px">10px</SelectItem>
                    <SelectItem value="12px">12px</SelectItem>
                    <SelectItem value="14px">14px</SelectItem>
                    <SelectItem value="16px">16px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Header Color</Label>
                <Input 
                  type="color"
                  value={customization.headerColor}
                  onChange={(e) => 
                    setCustomization(prev => ({ ...prev, headerColor: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <Input 
                  type="color"
                  value={customization.textColor}
                  onChange={(e) => 
                    setCustomization(prev => ({ ...prev, textColor: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Background Color</Label>
                <Input 
                  type="color"
                  value={customization.backgroundColor}
                  onChange={(e) => 
                    setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={customization.showBorder}
                onCheckedChange={(checked) => 
                  setCustomization(prev => ({ ...prev, showBorder: checked }))
                }
              />
              <Label>Show border around receipt</Label>
            </div>

            <Button onClick={handleSaveCustomization} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Customization
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
