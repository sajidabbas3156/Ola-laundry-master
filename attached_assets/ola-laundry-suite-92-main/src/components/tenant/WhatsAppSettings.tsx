
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Download, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { useTenant } from "@/contexts/TenantContext";

export function WhatsAppSettings() {
  const { currentTenant, updateTenant } = useTenant();
  const [localWhatsAppNumber, setLocalWhatsAppNumber] = useState(currentTenant?.whatsappNumber || "");
  const [useGlobalNumber, setUseGlobalNumber] = useState(!currentTenant?.whatsappNumber);
  const [showQR, setShowQR] = useState(false);
  
  const globalWhatsAppNumber = "123456789"; // This would come from admin settings
  const effectiveWhatsAppNumber = useGlobalNumber ? globalWhatsAppNumber : localWhatsAppNumber;

  const handleSaveWhatsAppSettings = () => {
    const numberToSave = useGlobalNumber ? undefined : localWhatsAppNumber;
    updateTenant({ whatsappNumber: numberToSave });
    toast.success("WhatsApp settings saved successfully");
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("whatsapp-qr") as HTMLCanvasElement;
    if (!canvas) return;
    
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${currentTenant?.name}-whatsapp-QR.png`;
    link.href = url;
    link.click();
  };

  const whatsappUrl = `https://wa.me/${effectiveWhatsAppNumber}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Business Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-global"
              checked={useGlobalNumber}
              onCheckedChange={setUseGlobalNumber}
            />
            <Label htmlFor="use-global">Use Global WhatsApp Number</Label>
          </div>
          
          {useGlobalNumber ? (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                Using global WhatsApp number: <strong>{globalWhatsAppNumber}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This number is managed by the platform administrator
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Your WhatsApp Business Number</Label>
              <Input 
                id="whatsappNumber" 
                placeholder="Enter with country code (e.g., 12345678901)"
                value={localWhatsAppNumber}
                onChange={(e) => setLocalWhatsAppNumber(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Include the country code without any symbols or spaces
              </p>
            </div>
          )}
          
          <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">WhatsApp Features for Your Store</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-green-700">
              <li>Customers can place orders via WhatsApp from your storefront</li>
              <li>Receive customer support requests directly</li>
              <li>Generate QR codes for physical displays</li>
              <li>Automatic order summaries formatted for WhatsApp</li>
            </ul>
          </div>
          
          <Button onClick={handleSaveWhatsAppSettings} className="w-full sm:w-auto">
            Save WhatsApp Settings
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>QR Code for Your Store</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Generate a QR code that customers can scan to start a WhatsApp conversation with your store.
          </p>
          
          <Button 
            variant="outline" 
            onClick={() => setShowQR(!showQR)}
            className="w-full sm:w-auto"
          >
            <QrCode className="mr-2 h-4 w-4" />
            {showQR ? "Hide" : "Generate"} WhatsApp QR Code
          </Button>

          {showQR && effectiveWhatsAppNumber && (
            <div className="flex flex-col items-center p-4 border rounded-lg bg-white">
              <div className="bg-white p-2 rounded">
                <QRCode
                  id="whatsapp-qr"
                  size={200}
                  value={whatsappUrl}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Scan to start WhatsApp chat with {currentTenant?.name}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3" 
                onClick={downloadQRCode}
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
