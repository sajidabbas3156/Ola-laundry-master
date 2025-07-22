
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Globe, Languages, Save } from "lucide-react";

export function LocalizationSettings() {
  const [localizationSettings, setLocalizationSettings] = useState({
    defaultLanguage: "en",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    timezone: "UTC",
    numberFormat: "1,234.56"
  });

  const [translations, setTranslations] = useState({
    en: {
      welcome: "Welcome",
      total: "Total",
      thank_you: "Thank you"
    },
    ar: {
      welcome: "أهلاً وسهلاً",
      total: "المجموع",
      thank_you: "شكراً لك"
    }
  });

  const handleSaveLocalization = () => {
    localStorage.setItem('localization_settings', JSON.stringify(localizationSettings));
    toast.success("Localization settings saved successfully!");
  };

  const handleSaveTranslations = () => {
    localStorage.setItem('translations', JSON.stringify(translations));
    toast.success("Translations saved successfully!");
  };

  return (
    <Tabs defaultValue="localization" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="localization">Localization</TabsTrigger>
        <TabsTrigger value="translations">Translations</TabsTrigger>
      </TabsList>

      <TabsContent value="localization">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Localization Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select value={localizationSettings.defaultLanguage} onValueChange={(value) => 
                  setLocalizationSettings(prev => ({ ...prev, defaultLanguage: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية (Arabic)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={localizationSettings.currency} onValueChange={(value) => 
                  setLocalizationSettings(prev => ({ ...prev, currency: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="BHD">BHD - Bahraini Dinar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select value={localizationSettings.dateFormat} onValueChange={(value) => 
                  setLocalizationSettings(prev => ({ ...prev, dateFormat: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (UK)</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Format</Label>
                <Select value={localizationSettings.timeFormat} onValueChange={(value) => 
                  setLocalizationSettings(prev => ({ ...prev, timeFormat: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24 Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={localizationSettings.timezone} onValueChange={(value) => 
                  setLocalizationSettings(prev => ({ ...prev, timezone: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Asia/Bahrain">Asia/Bahrain</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Number Format</Label>
                <Select value={localizationSettings.numberFormat} onValueChange={(value) => 
                  setLocalizationSettings(prev => ({ ...prev, numberFormat: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1,234.56">1,234.56 (US)</SelectItem>
                    <SelectItem value="1.234,56">1.234,56 (EU)</SelectItem>
                    <SelectItem value="1 234,56">1 234,56 (FR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSaveLocalization} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Localization Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="translations">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Translation Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {Object.entries(translations).map(([langCode, langTranslations]) => (
                <div key={langCode} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 capitalize">
                    {langCode === 'en' ? 'English' : langCode === 'ar' ? 'العربية' : langCode}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(langTranslations).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                        <Input 
                          value={value}
                          onChange={(e) => {
                            setTranslations(prev => ({
                              ...prev,
                              [langCode]: {
                                ...prev[langCode as keyof typeof prev],
                                [key]: e.target.value
                              }
                            }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleSaveTranslations} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Translations
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
