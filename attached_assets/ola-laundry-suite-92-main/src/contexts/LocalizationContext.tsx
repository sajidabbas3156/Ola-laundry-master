
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  language: string;
}

// Comprehensive currency list
export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 2 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimals: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2 },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', decimals: 2 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', decimals: 2 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', decimals: 2 },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', decimals: 0 },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', decimals: 2 },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', decimals: 2 },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', decimals: 2 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', decimals: 2 },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', decimals: 2 },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', decimals: 2 },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', decimals: 2 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', decimals: 2 },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', decimals: 2 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', decimals: 2 },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', decimals: 2 },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', decimals: 2 },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', decimals: 0 },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu', decimals: 2 },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', decimals: 2 },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', decimals: 2 },
  { code: 'ISK', symbol: 'kr', name: 'Icelandic Króna', decimals: 0 },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', decimals: 2 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', decimals: 2 },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', decimals: 0 },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', decimals: 2 },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', decimals: 0 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', decimals: 2 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', decimals: 2 },
  { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal', decimals: 2 },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', decimals: 3 },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', decimals: 3 },
  { code: 'OMR', symbol: '﷼', name: 'Omani Rial', decimals: 3 },
  { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar', decimals: 3 },
  { code: 'LBP', symbol: '£', name: 'Lebanese Pound', decimals: 2 },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound', decimals: 2 },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', decimals: 2 },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso', decimals: 0 },
  { code: 'COP', symbol: '$', name: 'Colombian Peso', decimals: 2 },
  { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', decimals: 2 },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso', decimals: 2 },
  { code: 'UYU', symbol: '$U', name: 'Uruguayan Peso', decimals: 2 },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', decimals: 2 },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', decimals: 2 },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', decimals: 2 },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', decimals: 2 },
  { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham', decimals: 2 },
  { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar', decimals: 3 }
];

// Comprehensive language list
export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
];

// Countries with their default currency and language
export const countries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', language: 'en' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', language: 'en' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', language: 'en' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', language: 'en' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', language: 'de' },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', language: 'fr' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', currency: 'EUR', language: 'it' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', currency: 'EUR', language: 'es' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', currency: 'EUR', language: 'nl' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', language: 'ja' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', currency: 'KRW', language: 'ko' },
  { code: 'CN', name: 'China', flag: '🇨🇳', currency: 'CNY', language: 'zh' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', language: 'hi' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'BRL', language: 'pt' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', currency: 'MXN', language: 'es' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', currency: 'RUB', language: 'ru' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', currency: 'CHF', language: 'de' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', currency: 'SEK', language: 'sv' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', currency: 'NOK', language: 'no' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', currency: 'DKK', language: 'da' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', language: 'en' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', currency: 'HKD', language: 'zh' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', currency: 'NZD', language: 'en' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', language: 'en' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', currency: 'TRY', language: 'tr' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', currency: 'PLN', language: 'pl' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', currency: 'CZK', language: 'cs' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', currency: 'HUF', language: 'hu' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', currency: 'RON', language: 'ro' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', currency: 'THB', language: 'th' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', currency: 'MYR', language: 'ms' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', currency: 'IDR', language: 'id' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', currency: 'PHP', language: 'tl' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', currency: 'VND', language: 'vi' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', language: 'ar' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', language: 'ar' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', currency: 'ILS', language: 'he' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', currency: 'EGP', language: 'ar' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', language: 'en' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', language: 'en' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', language: 'en' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', currency: 'MAD', language: 'ar' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', currency: 'CLP', language: 'es' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', currency: 'COP', language: 'es' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', currency: 'ARS', language: 'es' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', currency: 'PEN', language: 'es' }
];

interface LocalizationContextType {
  currentCurrency: Currency;
  currentLanguage: Language;
  currentCountry: Country | null;
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  setCountry: (country: Country) => void;
  formatCurrency: (amount: number) => string;
  detectLocationSettings: () => Promise<void>;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);

  // Auto-detect user's location and set appropriate currency/language/country
  const detectLocationSettings = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const detectedCountry = countries.find(c => c.code === data.country_code);
      
      if (detectedCountry) {
        setCurrentCountry(detectedCountry);
        
        const detectedCurrency = currencies.find(c => c.code === detectedCountry.currency);
        const detectedLanguage = languages.find(l => l.code === detectedCountry.language);

        if (detectedCurrency) setCurrentCurrency(detectedCurrency);
        if (detectedLanguage) setCurrentLanguage(detectedLanguage);
      }
    } catch (error) {
      console.log('Could not detect location, using defaults');
    }
  };

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    localStorage.setItem('selectedCurrency', JSON.stringify(currency));
  };

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', JSON.stringify(language));
  };

  const setCountry = (country: Country) => {
    setCurrentCountry(country);
    localStorage.setItem('selectedCountry', JSON.stringify(country));
    
    // Auto-set currency and language based on country
    const currency = currencies.find(c => c.code === country.currency);
    const language = languages.find(l => l.code === country.language);
    
    if (currency) setCurrency(currency);
    if (language) setLanguage(language);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currentLanguage.code === 'en' ? 'en-US' : currentLanguage.code, {
      style: 'currency',
      currency: currentCurrency.code,
      minimumFractionDigits: currentCurrency.decimals,
      maximumFractionDigits: currentCurrency.decimals,
    }).format(amount);
  };

  // Load saved preferences on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const savedCountry = localStorage.getItem('selectedCountry');

    if (savedCurrency) {
      try {
        setCurrentCurrency(JSON.parse(savedCurrency));
      } catch (e) {
        console.log('Invalid saved currency');
      }
    }

    if (savedLanguage) {
      try {
        setCurrentLanguage(JSON.parse(savedLanguage));
      } catch (e) {
        console.log('Invalid saved language');
      }
    }

    if (savedCountry) {
      try {
        setCurrentCountry(JSON.parse(savedCountry));
      } catch (e) {
        console.log('Invalid saved country');
      }
    }

    // Auto-detect if no saved preferences
    if (!savedCurrency || !savedLanguage || !savedCountry) {
      detectLocationSettings();
    }
  }, []);

  return (
    <LocalizationContext.Provider
      value={{
        currentCurrency,
        currentLanguage,
        currentCountry,
        setCurrency,
        setLanguage,
        setCountry,
        formatCurrency,
        detectLocationSettings,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error("useLocalization must be used within a LocalizationProvider");
  }
  return context;
}
