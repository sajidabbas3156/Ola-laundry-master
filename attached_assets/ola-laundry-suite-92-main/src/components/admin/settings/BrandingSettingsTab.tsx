
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Palette, Image } from "lucide-react";

interface BrandingSettingsTabProps {
  platformName: string;
  platformLogo: string;
  setPlatformLogo: (value: string) => void;
  primaryColor: string;
  setPrimaryColor: (value: string) => void;
  secondaryColor: string;
  setSecondaryColor: (value: string) => void;
}

export function BrandingSettingsTab({
  platformName,
  platformLogo,
  setPlatformLogo,
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor
}: BrandingSettingsTabProps) {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPlatformLogo(result);
        toast.success("Logo uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBrandingSettings = () => {
    console.log("Saving branding settings:", { primaryColor, secondaryColor, platformLogo });
    toast.success("Branding settings saved successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Branding & Appearance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center gap-2">
            <Image className="h-4 w-4" />
            Platform Logo Management
          </Label>
          
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {platformLogo ? (
                  <img 
                    src={platformLogo} 
                    alt="Current Logo" 
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <Image className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a logo image (PNG, JPG, SVG recommended)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platformLogoUrl">Or enter logo URL</Label>
              <Input 
                id="platformLogoUrl" 
                value={platformLogo}
                onChange={(e) => setPlatformLogo(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="primaryColor" 
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-10"
              />
              <Input 
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="secondaryColor" 
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-16 h-10"
              />
              <Input 
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg" style={{ backgroundColor: primaryColor + '10' }}>
          <div className="flex items-center gap-3 mb-3">
            {platformLogo && (
              <img 
                src={platformLogo} 
                alt="Logo Preview" 
                className="h-8 w-auto"
              />
            )}
            <h3 className="font-medium" style={{ color: primaryColor }}>
              {platformName}
            </h3>
          </div>
          <p className="text-sm" style={{ color: secondaryColor }}>
            This is how your platform will look with the selected logo and colors.
          </p>
        </div>
        
        <Button onClick={handleSaveBrandingSettings} className="w-full sm:w-auto">
          Save Branding Settings
        </Button>
      </CardContent>
    </Card>
  );
}
