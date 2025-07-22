
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Palette, Monitor, Sun, Moon } from "lucide-react";

interface AppearanceSettingsTabProps {
  platformName: string;
  primaryColor: string;
  setPrimaryColor: (value: string) => void;
  secondaryColor: string;
  setSecondaryColor: (value: string) => void;
}

export function AppearanceSettingsTab({
  platformName,
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor
}: AppearanceSettingsTabProps) {
  const handleSaveAppearance = () => {
    console.log("Saving appearance settings:", { primaryColor, secondaryColor });
    toast.success("Appearance settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Global Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Brand Color</Label>
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

          <div className="space-y-4">
            <Label className="text-base font-medium">Theme Preferences</Label>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-medium">Light Mode Default</h4>
                  <p className="text-sm text-gray-500">Set light mode as default for all users</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-medium">Dark Mode Support</h4>
                  <p className="text-sm text-gray-500">Allow users to switch to dark mode</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-medium">System Theme Detection</h4>
                  <p className="text-sm text-gray-500">Automatically detect user's system theme preference</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="borderRadius">Border Radius Style</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sharp (0px)</SelectItem>
                <SelectItem value="small">Small (4px)</SelectItem>
                <SelectItem value="medium">Medium (8px)</SelectItem>
                <SelectItem value="large">Large (12px)</SelectItem>
                <SelectItem value="xl">Extra Large (16px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 border rounded-lg" style={{ backgroundColor: primaryColor + '10' }}>
            <h3 className="font-medium mb-2" style={{ color: primaryColor }}>
              Theme Preview - {platformName}
            </h3>
            <p className="text-sm" style={{ color: secondaryColor }}>
              This is how your platform will look with the selected colors and theme settings.
            </p>
            <div className="mt-3 flex gap-2">
              <div 
                className="w-8 h-8 rounded border" 
                style={{ backgroundColor: primaryColor }}
              ></div>
              <div 
                className="w-8 h-8 rounded border" 
                style={{ backgroundColor: secondaryColor }}
              ></div>
            </div>
          </div>
          
          <Button onClick={handleSaveAppearance} className="w-full sm:w-auto">
            Save Appearance Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
