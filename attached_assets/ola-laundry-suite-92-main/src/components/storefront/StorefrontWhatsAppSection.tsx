
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";

interface StorefrontWhatsAppSectionProps {
  whatsappNumber: string;
  generateWhatsAppOrderMessage: () => string;
  tenantName?: string;
}

export function StorefrontWhatsAppSection({
  whatsappNumber,
  generateWhatsAppOrderMessage,
  tenantName
}: StorefrontWhatsAppSectionProps) {
  return (
    <div className="flex flex-col">
      <div className="bg-green-50 border border-green-100 p-3 rounded-lg mb-4">
        <h4 className="font-medium text-green-800 mb-2">Quick Order via WhatsApp</h4>
        <p className="text-sm text-green-700 mb-3">
          Send your order details directly to us on WhatsApp for faster processing.
        </p>
        <WhatsAppButton 
          phoneNumber={whatsappNumber}
          message={generateWhatsAppOrderMessage()}
          className="w-full"
        >
          Send Order via WhatsApp
        </WhatsAppButton>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Or fill in your details below to place your order through our system:
      </p>
    </div>
  );
}
