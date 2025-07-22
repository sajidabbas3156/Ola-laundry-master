
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettingsTab } from "@/components/admin/settings/GeneralSettingsTab";
import { BrandingSettingsTab } from "@/components/admin/settings/BrandingSettingsTab";
import { WebsiteSettingsTab } from "@/components/admin/settings/WebsiteSettingsTab";
import { PricingSettingsTab } from "@/components/admin/settings/PricingSettingsTab";
import { PaymentSettingsTab } from "@/components/admin/settings/PaymentSettingsTab";
import { WhatsAppSettingsTab } from "@/components/admin/settings/WhatsAppSettingsTab";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export default function AdminSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState("123456789");
  const [platformName, setPlatformName] = useState("Ola Laundry");
  const [platformDescription, setPlatformDescription] = useState("Complete laundry management platform");
  const [platformLogo, setPlatformLogo] = useState("/lovable-uploads/d8b7a3ec-1ecf-4f9e-b57a-6329f0b4a2b4.png");
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");
  const [secondaryColor, setSecondaryColor] = useState("#64748b");
  
  // Subscription plans
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([
    {
      id: "basic",
      name: "Basic",
      price: 29,
      features: ["1 Store Location", "Up to 100 orders/month", "Basic Analytics", "Email Support"]
    },
    {
      id: "premium",
      name: "Premium", 
      price: 79,
      features: ["5 Store Locations", "Up to 500 orders/month", "Advanced Analytics", "Priority Support", "Custom Branding"],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199,
      features: ["Unlimited Stores", "Unlimited Orders", "Advanced Analytics", "24/7 Support", "White Label", "API Access"]
    }
  ]);

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    { id: "stripe", name: "Stripe", enabled: true, fee: 2.9 },
    { id: "paypal", name: "PayPal", enabled: true, fee: 3.5 },
    { id: "cash", name: "Cash on Delivery", enabled: true, fee: 0 },
    { id: "bank", name: "Bank Transfer", enabled: false, fee: 0.5 }
  ]);

  // Website customization
  const [websiteSettings, setWebsiteSettings] = useState({
    landingPageTitle: "Professional Laundry Management",
    landingPageSubtitle: "Streamline your laundry business with our comprehensive platform",
    heroButtonText: "Get Started Free",
    featuresTitle: "Everything you need to run your laundry business",
    pricingTitle: "Choose the perfect plan for your business",
    footerText: "© 2024 Ola Laundry. All rights reserved.",
    contactEmail: "support@olaundry.com",
    supportPhone: "+1-800-OLA-WASH"
  });

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Platform Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="general" className="text-xs sm:text-sm">General</TabsTrigger>
            <TabsTrigger value="branding" className="text-xs sm:text-sm">Branding</TabsTrigger>
            <TabsTrigger value="website" className="text-xs sm:text-sm">Website</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs sm:text-sm">Pricing</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs sm:text-sm">Payments</TabsTrigger>
            <TabsTrigger value="whatsapp" className="text-xs sm:text-sm">WhatsApp</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <GeneralSettingsTab
            platformName={platformName}
            setPlatformName={setPlatformName}
            platformDescription={platformDescription}
            setPlatformDescription={setPlatformDescription}
            websiteSettings={websiteSettings}
            setWebsiteSettings={setWebsiteSettings}
          />
        </TabsContent>

        <TabsContent value="branding" className="space-y-4 mt-4">
          <BrandingSettingsTab
            platformName={platformName}
            platformLogo={platformLogo}
            setPlatformLogo={setPlatformLogo}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            secondaryColor={secondaryColor}
            setSecondaryColor={setSecondaryColor}
          />
        </TabsContent>

        <TabsContent value="website" className="space-y-4 mt-4">
          <WebsiteSettingsTab
            websiteSettings={websiteSettings}
            setWebsiteSettings={setWebsiteSettings}
          />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 mt-4">
          <PricingSettingsTab
            pricingPlans={pricingPlans}
            setPricingPlans={setPricingPlans}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4 mt-4">
          <PaymentSettingsTab
            paymentMethods={paymentMethods}
            setPaymentMethods={setPaymentMethods}
          />
        </TabsContent>
        
        <TabsContent value="whatsapp" className="space-y-4 mt-4">
          <WhatsAppSettingsTab
            whatsappNumber={whatsappNumber}
            setWhatsappNumber={setWhatsappNumber}
            platformName={platformName}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
