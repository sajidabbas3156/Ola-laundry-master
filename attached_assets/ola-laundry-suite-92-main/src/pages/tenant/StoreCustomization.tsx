
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Save, Eye } from "lucide-react";
import { toast } from "sonner";
import { useTenant } from "@/contexts/TenantContext";

interface CustomizationSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
  logo: string;
  favicon: string;
  storeName: string;
  tagline: string;
  heroImage: string;
  customCSS: string;
  fontFamily: string;
  buttonStyle: "rounded" | "square" | "pill";
  enableAnimations: boolean;
  showPoweredBy: boolean;
  customDomain: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    whatsapp: string;
  };
}

export default function StoreCustomization() {
  const { currentTenant } = useTenant();
  
  const [settings, setSettings] = useState<CustomizationSettings>({
    primaryColor: "#0ea5e9",
    secondaryColor: "#06b6d4",
    backgroundColor: "#ffffff",
    accentColor: "#10b981",
    logo: "",
    favicon: "",
    storeName: currentTenant?.name || "",
    tagline: "",
    heroImage: "",
    customCSS: "",
    fontFamily: "Inter",
    buttonStyle: "rounded",
    enableAnimations: true,
    showPoweredBy: true,
    customDomain: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      whatsapp: currentTenant?.phone || ""
    }
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = (colorType: keyof Pick<CustomizationSettings, 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'accentColor'>, value: string) => {
    setSettings(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof CustomizationSettings['socialLinks'], value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleSave = () => {
    console.log("Saving customization settings:", settings);
    toast.success("Store customization saved successfully!");
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
    toast.info(previewMode ? "Preview mode disabled" : "Preview mode enabled");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Store Customization</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Disable Preview" : "Preview"}
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input 
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
                    placeholder="Enter store name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input 
                    id="tagline"
                    value={settings.tagline}
                    onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Enter store tagline"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input 
                  id="logo"
                  value={settings.logo}
                  onChange={(e) => setSettings(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                />
                {settings.logo && (
                  <div className="mt-2">
                    <img 
                      src={settings.logo} 
                      alt="Logo preview" 
                      className="h-16 object-contain border rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x80?text=Invalid+URL";
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'primaryColor' as const, label: 'Primary Color', description: 'Main brand color' },
                  { key: 'secondaryColor' as const, label: 'Secondary Color', description: 'Supporting color' },
                  { key: 'backgroundColor' as const, label: 'Background Color', description: 'Page background' },
                  { key: 'accentColor' as const, label: 'Accent Color', description: 'Highlight color' }
                ].map((color) => (
                  <div key={color.key} className="space-y-2">
                    <Label htmlFor={color.key}>{color.label}</Label>
                    <p className="text-sm text-gray-500">{color.description}</p>
                    <div className="flex items-center gap-4">
                      <Input 
                        id={color.key}
                        type="color" 
                        className="w-16 h-10 p-1" 
                        value={settings[color.key]}
                        onChange={(e) => handleColorChange(color.key, e.target.value)}
                      />
                      <Input 
                        type="text" 
                        value={settings[color.key]} 
                        onChange={(e) => handleColorChange(color.key, e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Layout & Typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <select 
                  id="fontFamily"
                  value={settings.fontFamily}
                  onChange={(e) => setSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="Inter">Inter (Modern)</option>
                  <option value="Roboto">Roboto (Clean)</option>
                  <option value="Open Sans">Open Sans (Friendly)</option>
                  <option value="Playfair Display">Playfair Display (Elegant)</option>
                  <option value="Poppins">Poppins (Round)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAnimations">Enable Animations</Label>
                  <p className="text-sm text-gray-500">Smooth transitions and animations</p>
                </div>
                <Switch 
                  id="enableAnimations"
                  checked={settings.enableAnimations}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAnimations: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Social Media & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(settings.socialLinks).map(([platform, url]) => (
                  <div key={platform} className="space-y-2">
                    <Label htmlFor={platform} className="capitalize">{platform}</Label>
                    <Input 
                      id={platform}
                      value={url}
                      onChange={(e) => handleSocialLinkChange(platform as keyof CustomizationSettings['socialLinks'], e.target.value)}
                      placeholder={`${platform === 'whatsapp' ? 'WhatsApp number' : `${platform} URL`}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
