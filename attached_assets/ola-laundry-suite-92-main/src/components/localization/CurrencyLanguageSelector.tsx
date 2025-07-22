
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalization, currencies, languages, countries } from "@/contexts/LocalizationContext";
import { Globe, DollarSign, Flag } from "lucide-react";

export function CurrencyLanguageSelector() {
  const { 
    currentCurrency, 
    currentLanguage, 
    currentCountry,
    setCurrency, 
    setLanguage,
    setCountry,
    detectLocationSettings 
  } = useLocalization();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Localization Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <Flag className="h-4 w-4" />
            Country
          </label>
          <Select 
            value={currentCountry?.code || ''} 
            onValueChange={(code) => {
              const country = countries.find(c => c.code === code);
              if (country) setCountry(country);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {countries.map(country => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Currency
          </label>
          <Select 
            value={currentCurrency.code} 
            onValueChange={(code) => {
              const currency = currencies.find(c => c.code === code);
              if (currency) setCurrency(currency);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {currencies.map(currency => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{currency.symbol}</span>
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-muted-foreground">- {currency.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <Globe className="h-4 w-4" />
            Language
          </label>
          <Select 
            value={currentLanguage.code} 
            onValueChange={(code) => {
              const language = languages.find(l => l.code === code);
              if (language) setLanguage(language);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {languages.map(language => (
                <SelectItem key={language.code} value={language.code}>
                  <div className="flex items-center gap-2">
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          onClick={detectLocationSettings}
          className="w-full flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          Auto-detect from Location
        </Button>
      </CardContent>
    </Card>
  );
}
