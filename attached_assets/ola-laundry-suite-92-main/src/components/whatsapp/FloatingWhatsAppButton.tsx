
import React from "react";
import { MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FloatingWhatsAppButtonProps {
  phoneNumber: string;
  message: string;
}

export function FloatingWhatsAppButton({ phoneNumber, message }: FloatingWhatsAppButtonProps) {
  const isMobile = useIsMobile();
  
  // Format the phone number by removing any non-digit characters
  const formattedPhone = phoneNumber.replace(/\D/g, "");
  
  // Create WhatsApp URL with the message
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  const handleClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed ${isMobile ? 'bottom-24' : 'bottom-8'} right-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 z-50 ${
        isMobile ? 'p-4' : 'p-3'
      }`}
      aria-label="Contact on WhatsApp"
    >
      <MessageSquare size={isMobile ? 28 : 24} />
    </button>
  );
}
