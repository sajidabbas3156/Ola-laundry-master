import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Upload } from "lucide-react";
import { PrinterSettingsTab } from "@/components/pos/settings/PrinterSettingsTab";
import { ReceiptSettingsTab } from "@/components/pos/settings/ReceiptSettingsTab";
import { TaxSettingsTab } from "@/components/pos/settings/TaxSettingsTab";
import { PaymentMethodsTab } from "@/components/pos/settings/PaymentMethodsTab";
import { StaffRolesTab } from "@/components/pos/settings/StaffRolesTab";
import { ServicesTab } from "@/components/pos/settings/ServicesTab";
import {
  PrinterSettings,
  ReceiptSettings,
  TaxSettings,
  PaymentMethod,
  StaffRole,
  ServiceSettings
} from "@/types/pos-settings";

export default function PosSettings() {
  const [printerSettings, setPrinterSettings] = useState<PrinterSettings>({
    defaultPrinter: "thermal1",
    autoprint: true,
    paperSize: "80mm",
    copies: 1,
    enableCashDrawer: true,
    printSpeed: "normal",
    paperType: "thermal",
    pinEnabled: false,
    pinCode: "",
    requirePinForReprint: false
  });

  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings>({
    businessName: "Your Business Name",
    address: "123 Business Street, City",
    phone: "123-456-7890",
    showLogo: true,
    showCustomerDetails: true,
    footerMessage: "Thank you for your business!"
  });

  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    defaultTaxRate: 5.0,
    taxIncluded: false,
    taxDisplayName: "Tax"
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "cash", name: "Cash", enabled: true, settings: {}, processingFee: 0 },
    { id: "card", name: "Card", enabled: true, settings: {}, processingFee: 2.9 },
    { id: "stripe", name: "Stripe", enabled: false, settings: { publishableKey: "", secretKey: "" }, processingFee: 2.9 },
    { id: "paypal", name: "PayPal", enabled: false, settings: { clientId: "", clientSecret: "" }, processingFee: 3.5 },
    { id: "benefit", name: "Benefit Pay", enabled: true, settings: {}, processingFee: 1.5 }
  ]);

  const [staffRoles, setStaffRoles] = useState<StaffRole[]>([
    { id: "admin", name: "Admin", permissions: ["all", "pos", "inventory", "reports", "settings", "customers", "staff_management"] },
    { id: "cashier", name: "Cashier", permissions: ["pos", "customers"] },
    { id: "manager", name: "Manager", permissions: ["pos", "customers", "inventory", "reports", "staff_management"] },
    { id: "supervisor", name: "Supervisor", permissions: ["pos", "customers", "inventory", "reports"] }
  ]);

  const [serviceSettings, setServiceSettings] = useState<ServiceSettings[]>([
    { id: "standard", name: "Standard", description: "Regular service", priceMultiplier: 1.0, customPrices: {} },
    { id: "express", name: "Express", description: "Same day service", priceMultiplier: 1.5, customPrices: {} },
    { id: "premium", name: "Premium", description: "Premium cleaning", priceMultiplier: 2.0, customPrices: {} }
  ]);

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishAllSettings = async () => {
    setIsPublishing(true);
    try {
      // Save all settings
      localStorage.setItem('pos_printer_settings', JSON.stringify(printerSettings));
      localStorage.setItem('pos_receipt_settings', JSON.stringify(receiptSettings));
      localStorage.setItem('pos_tax_settings', JSON.stringify(taxSettings));
      localStorage.setItem('pos_payment_methods', JSON.stringify(paymentMethods));
      localStorage.setItem('pos_staff_roles', JSON.stringify(staffRoles));
      localStorage.setItem('pos_service_settings', JSON.stringify(serviceSettings));
      
      // Simulate API call to publish settings
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("All POS settings published successfully!");
    } catch (error) {
      toast.error("Failed to publish settings. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">POS Settings</h1>
        <Button 
          onClick={handlePublishAllSettings}
          disabled={isPublishing}
          className="bg-green-600 hover:bg-green-700"
        >
          {isPublishing ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Publish All Settings
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="printer" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="printer">Printer & Security</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="tax">Tax Settings</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="staff">Staff Roles</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="printer">
          <PrinterSettingsTab 
            printerSettings={printerSettings}
            setPrinterSettings={setPrinterSettings}
          />
        </TabsContent>

        <TabsContent value="receipts">
          <ReceiptSettingsTab 
            receiptSettings={receiptSettings}
            setReceiptSettings={setReceiptSettings}
          />
        </TabsContent>

        <TabsContent value="tax">
          <TaxSettingsTab 
            taxSettings={taxSettings}
            setTaxSettings={setTaxSettings}
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentMethodsTab 
            paymentMethods={paymentMethods}
            setPaymentMethods={setPaymentMethods}
          />
        </TabsContent>

        <TabsContent value="staff">
          <StaffRolesTab 
            staffRoles={staffRoles}
            setStaffRoles={setStaffRoles}
          />
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab 
            serviceSettings={serviceSettings}
            setServiceSettings={setServiceSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
