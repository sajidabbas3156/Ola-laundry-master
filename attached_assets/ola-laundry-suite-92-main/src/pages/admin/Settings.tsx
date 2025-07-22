
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Download, QrCode, Share2 } from "lucide-react";
import QRCode from "react-qr-code";

export default function AdminSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState("123456789");
  const [storeName, setStoreName] = useState("Ola Laundry");
  const [storeDescription, setStoreDescription] = useState("Quality laundry services");
  const [showWhatsAppQR, setShowWhatsAppQR] = useState(false);
  const [showStoreQR, setShowStoreQR] = useState(false);
  
  const handleSaveGeneralSettings = () => {
    console.log("Saving settings:", { storeName, storeDescription, whatsappNumber });
    toast.success("Settings saved successfully");
  };

  const handleSaveWhatsAppSettings = () => {
    console.log("Saving WhatsApp settings:", { whatsappNumber });
    toast.success("WhatsApp settings saved successfully");
  };

  const downloadQRCode = (type: 'whatsapp' | 'store') => {
    const canvas = document.getElementById(`qr-${type}`) as HTMLCanvasElement;
    if (!canvas) return;
    
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${storeName}-${type}-QR.png`;
    link.href = url;
    link.click();
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const storeUrl = `${window.location.origin}/store`;

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="general" className="text-xs sm:text-sm">General</TabsTrigger>
            <TabsTrigger value="whatsapp" className="text-xs sm:text-sm">WhatsApp</TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs sm:text-sm">Appearance</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input 
                    id="storeName" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Input 
                    id="storeDescription" 
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveGeneralSettings} className="w-full sm:w-auto">
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="whatsapp" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">WhatsApp Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Business Number</Label>
                <Input 
                  id="whatsappNumber" 
                  placeholder="Enter with country code (e.g., 12345678901)"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Include the country code without any symbols or spaces (e.g., 12345678901)
                </p>
              </div>
              
              <div className="p-3 md:p-4 bg-green-50 border border-green-100 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2 text-sm md:text-base">WhatsApp Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-green-700">
                  <li>Customers can place orders via WhatsApp from your storefront</li>
                  <li>Customers can contact support through WhatsApp</li>
                  <li>QR code generation for physical displays</li>
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
              <CardTitle className="text-lg md:text-xl">QR Code Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm md:text-base">
                Generate QR codes that link directly to your store or to start a WhatsApp conversation.
                Print these codes for physical display in your store or on marketing materials.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowStoreQR(!showStoreQR)}
                  className="w-full"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  {showStoreQR ? "Hide" : "Generate"} Store QR Code
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

              {showStoreQR && (
                <div className="flex flex-col items-center p-4 border rounded-lg bg-white">
                  <div className="bg-white p-2 rounded">
                    <QRCode
                      id="qr-store"
                      size={window.innerWidth < 640 ? 150 : 200}
                      value={storeUrl}
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Scan to visit online store
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full sm:w-auto" 
                    onClick={() => downloadQRCode('store')}
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
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 md:py-8">
                <h3 className="text-base md:text-lg font-medium mb-2">Customize Your Store Look</h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base">
                  This section will allow you to customize colors, logos, and other visual elements.
                </p>
                <p className="text-gray-500 text-xs md:text-sm">
                  In the full implementation, you'll be able to upload your logo, select theme colors, 
                  and customize the appearance of your store.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
