
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Settings as SettingsIcon } from "lucide-react";

interface GeneralSettingsTabProps {
  platformName: string;
  setPlatformName: (value: string) => void;
  platformDescription: string;
  setPlatformDescription: (value: string) => void;
  websiteSettings: {
    contactEmail: string;
  };
  setWebsiteSettings: (value: any) => void;
}

export function GeneralSettingsTab({
  platformName,
  setPlatformName,
  platformDescription,
  setPlatformDescription,
  websiteSettings,
  setWebsiteSettings
}: GeneralSettingsTabProps) {
  const handleSaveGeneralSettings = () => {
    console.log("Saving general settings:", { platformName, platformDescription });
    toast.success("General settings saved successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          General Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="platformName">Platform Name</Label>
            <Input 
              id="platformName" 
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Support Email</Label>
            <Input 
              id="contactEmail" 
              type="email"
              value={websiteSettings.contactEmail}
              onChange={(e) => setWebsiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="platformDescription">Platform Description</Label>
          <Textarea 
            id="platformDescription" 
            value={platformDescription}
            onChange={(e) => setPlatformDescription(e.target.value)}
            className="w-full"
            rows={3}
          />
        </div>
        
        <Button onClick={handleSaveGeneralSettings} className="w-full sm:w-auto">
          Save General Settings
        </Button>
      </CardContent>
    </Card>
  );
}
