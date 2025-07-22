
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickCustomizationProps {
  tenantId: string;
  tenantName: string;
  currentLogo?: string;
  currentPrimaryColor?: string;
}

export function QuickCustomizationPanel({ 
  tenantId, 
  tenantName, 
  currentLogo = "", 
  currentPrimaryColor = "#0ea5e9" 
}: QuickCustomizationProps) {
  const navigate = useNavigate();
  const [quickSettings, setQuickSettings] = useState({
    logo: currentLogo,
    primaryColor: currentPrimaryColor
  });

  const handleQuickSave = () => {
    // In a real app, this would save to backend
    console.log(`Quick customization saved for tenant ${tenantId}:`, quickSettings);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Quick Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quickLogo">Logo URL</Label>
          <Input 
            id="quickLogo"
            value={quickSettings.logo}
            onChange={(e) => setQuickSettings(prev => ({ ...prev, logo: e.target.value }))}
            placeholder="https://example.com/logo.png"
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quickColor">Primary Color</Label>
          <div className="flex gap-2">
            <Input 
              id="quickColor"
              type="color" 
              className="w-12 h-8 p-1" 
              value={quickSettings.primaryColor}
              onChange={(e) => setQuickSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
            />
            <Input 
              type="text" 
              value={quickSettings.primaryColor} 
              onChange={(e) => setQuickSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
              className="flex-1 text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={handleQuickSave} className="flex-1">
            Quick Save
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate(`/admin/customization/${tenantId}`)}
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Full Editor
          </Button>
        </div>

        {/* Preview */}
        <div className="border rounded p-3 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            {quickSettings.logo ? (
              <img 
                src={quickSettings.logo} 
                alt="Logo preview" 
                className="h-6 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div 
                className="h-6 w-6 rounded text-white text-xs flex items-center justify-center font-bold"
                style={{ backgroundColor: quickSettings.primaryColor }}
              >
                {tenantName.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium">{tenantName}</span>
          </div>
          <div 
            className="px-3 py-1 rounded text-white text-xs"
            style={{ backgroundColor: quickSettings.primaryColor }}
          >
            Sample Button
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
