
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

interface WhatsAppButtonProps extends VariantProps<typeof buttonVariants> {
  phoneNumber: string;
  message: string;
  className?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({ 
  phoneNumber, 
  message, 
  className = "",
  children,
  variant,
  size,
  ...props
}: WhatsAppButtonProps) {
  // Format the phone number by removing any non-digit characters
  const formattedPhone = phoneNumber.replace(/\D/g, "");
  
  // Create WhatsApp URL with the message
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button 
      onClick={handleClick}
      variant={variant || "default"}
      size={size || "sm"}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      {...props}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      {children || "Contact on WhatsApp"}
    </Button>
  );
}
