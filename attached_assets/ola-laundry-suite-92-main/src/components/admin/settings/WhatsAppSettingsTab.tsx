
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Download, QrCode } from "lucide-react";
import QRCode from "react-qr-code";

interface WhatsAppSettingsTabProps {
  whatsappNumber: string;
  setWhatsappNumber: (value: string) => void;
  platformName: string;
}

export function WhatsAppSettingsTab({
  whatsappNumber,
  setWhatsappNumber,
  platformName
}: WhatsAppSettingsTabProps) {
  const [showWhatsAppQR, setShowWhatsAppQR] = useState(false);
  const [showPlatformQR, setShowPlatformQR] = useState(false);

  const handleSaveWhatsAppSettings = () => {
    console.log("Saving WhatsApp settings:", { whatsappNumber });
    toast.success("WhatsApp settings saved successfully");
  };

  const downloadQRCode = (type: 'whatsapp' | 'platform') => {
    const canvas = document.getElementById(`qr-${type}`) as HTMLCanvasElement;
    if (!canvas) return;
    
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${platformName}-${type}-QR.png`;
    link.href = url;
    link.click();
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const platformUrl = `${window.location.origin}`;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">WhatsApp Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">Global WhatsApp Business Number</Label>
            <Input 
              id="whatsappNumber" 
              placeholder="Enter with country code (e.g., 12345678901)"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              This will be the default WhatsApp number for all tenants
            </p>
          </div>
          
          <div className="p-3 md:p-4 bg-green-50 border border-green-100 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2 text-sm md:text-base">Global WhatsApp Features</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-green-700">
              <li>All tenants can inherit this WhatsApp number</li>
              <li>Tenants can override with their own numbers</li>
              <li>Global support and customer service</li>
              <li>Centralized order management via WhatsApp</li>
            </ul>
          </div>
          
          <Button onClick={handleSaveWhatsAppSettings} className="w-full sm:w-auto">
            Save WhatsApp Settings
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm md:text-base">
            Generate QR codes for global WhatsApp support and platform access.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPlatformQR(!showPlatformQR)}
              className="w-full"
            >
              <QrCode className="mr-2 h-4 w-4" />
              {showPlatformQR ? "Hide" : "Generate"} Platform QR Code
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowWhatsAppQR(!showWhatsAppQR)}
              className="w-full"
            >
              <QrCode className="mr-2 h-4 w-4" />
              {showWhatsAppQR ? "Hide" : "Generate"} WhatsApp QR Code
            </Button>
          </div>

          {showPlatformQR && (
            <div className="flex flex-col items-center p-4 border rounded-lg bg-white">
              <div className="bg-white p-2 rounded">
                <QRCode
                  id="qr-platform"
                  size={window.innerWidth < 640 ? 150 : 200}
                  value={platformUrl}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Scan to visit platform
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 w-full sm:w-auto" 
                onClick={() => downloadQRCode('platform')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          )}

          {showWhatsAppQR && (
            <div className="flex flex-col items-center p-4 border rounded-lg bg-white">
              <div className="bg-white p-2 rounded">
                <QRCode
                  id="qr-whatsapp"
                  size={window.innerWidth < 640 ? 150 : 200}
                  value={whatsappUrl}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Scan to start WhatsApp chat
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 w-full sm:w-auto" 
                onClick={() => downloadQRCode('whatsapp')}
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
