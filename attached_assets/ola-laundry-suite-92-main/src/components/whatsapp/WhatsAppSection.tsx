
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { WhatsAppButton } from "./WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "@/components/ui/sonner";
import QRCode from "react-qr-code";

export function WhatsAppSection() {
  const { currentTenant } = useTenant();
  const [showQR, setShowQR] = useState(false);
  
  const tenantName = currentTenant?.name || "Our Laundry";
  // Use a default WhatsApp number if not available in the tenant object
  const phoneNumber = currentTenant?.phone || "1234567890";
  const storeUrl = `${window.location.origin}/${currentTenant?.id || "store"}`;
  
  const whatsappMessage = `Hi! I'd like to place an order with ${tenantName}!`;
  
  // Share functionality using Web Share API
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tenantName} - Laundry Services`,
          text: `Check out ${tenantName} for laundry services!\nClick to order: ${storeUrl}`,
          url: storeUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Couldn't share. Please try again.");
      }
    } else {
      // Fallback for browsers that don't support share API
      toast.info("Sharing not supported by your browser. Copy the link instead.");
    }
  };
  
  // Download QR code as PNG
  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${tenantName}-QR.png`;
    link.href = url;
    link.click();
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Easy Ordering Options</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
          <h3 className="font-medium text-green-800 text-lg mb-2">
            Order via WhatsApp
          </h3>
          <p className="text-green-700 mb-4">
            Place your order quickly through WhatsApp. Our team is ready to assist you!
          </p>
          <div className="flex items-center gap-2">
            <WhatsAppButton 
              phoneNumber={phoneNumber} 
              message={whatsappMessage}
            >
              Place Order on WhatsApp
            </WhatsAppButton>
            <WhatsAppButton 
              phoneNumber={phoneNumber} 
              message="Hi! I have a question about my laundry order."
              className="bg-green-700 hover:bg-green-800"
            >
              Chat with Support
            </WhatsAppButton>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Our Store
          </Button>
          <Button variant="outline" onClick={() => setShowQR(!showQR)}>
            {showQR ? "Hide QR Code" : "Show QR Code"}
          </Button>
        </div>

        {showQR && (
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <div className="bg-white p-4 rounded" id="qr-canvas">
              <QRCode
                id="qr-code-canvas"
                size={200}
                value={storeUrl}
                fgColor="#000000"
                bgColor="#FFFFFF"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Scan to visit our online store
            </p>
            <Button variant="outline" size="sm" className="mt-3" onClick={downloadQRCode}>
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
