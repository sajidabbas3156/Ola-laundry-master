
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Globe } from "lucide-react";

interface WebsiteSettingsTabProps {
  websiteSettings: {
    landingPageTitle: string;
    landingPageSubtitle: string;
    heroButtonText: string;
    featuresTitle: string;
    pricingTitle: string;
    footerText: string;
    contactEmail: string;
    supportPhone: string;
  };
  setWebsiteSettings: (value: any) => void;
}

export function WebsiteSettingsTab({
  websiteSettings,
  setWebsiteSettings
}: WebsiteSettingsTabProps) {
  const handleSaveWebsiteSettings = () => {
    console.log("Saving website settings:", websiteSettings);
    toast.success("Website settings saved successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Website Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="landingPageTitle">Landing Page Title</Label>
            <Input 
              id="landingPageTitle" 
              value={websiteSettings.landingPageTitle}
              onChange={(e) => setWebsiteSettings(prev => ({ ...prev, landingPageTitle: e.target.value }))}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="heroButtonText">Hero Button Text</Label>
            <Input 
              id="heroButtonText" 
              value={websiteSettings.heroButtonText}
              onChange={(e) => setWebsiteSettings(prev => ({ ...prev, heroButtonText: e.target.value }))}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="landingPageSubtitle">Landing Page Subtitle</Label>
          <Textarea 
            id="landingPageSubtitle" 
            value={websiteSettings.landingPageSubtitle}
            onChange={(e) => setWebsiteSettings(prev => ({ ...prev, landingPageSubtitle: e.target.value }))}
            className="w-full"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="featuresTitle">Features Section Title</Label>
            <Input 
              id="featuresTitle" 
              value={websiteSettings.featuresTitle}
              onChange={(e) => setWebsiteSettings(prev => ({ ...prev, featuresTitle: e.target.value }))}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pricingTitle">Pricing Section Title</Label>
            <Input 
              id="pricingTitle" 
              value={websiteSettings.pricingTitle}
              onChange={(e) => setWebsiteSettings(prev => ({ ...prev, pricingTitle: e.target.value }))}
              className="w-full"
            />
          </div>
        </div>
        
        <Button onClick={handleSaveWebsiteSettings} className="w-full sm:w-auto">
          Save Website Settings
        </Button>
      </CardContent>
    </Card>
  );
}
