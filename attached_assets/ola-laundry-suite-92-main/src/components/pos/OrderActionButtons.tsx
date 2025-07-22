
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Printer } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { ReceiptGenerator } from "./ReceiptGenerator";
import { CartItem } from "@/types/pos";

interface OrderActionButtonsProps {
  orderData: {
    orderId: string;
    customerName: string;
    customerPhone: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    date: Date;
  };
  tenantName: string;
  formatCurrency: (amount: number) => string;
}

export function OrderActionButtons({
  orderData,
  tenantName,
  formatCurrency
}: OrderActionButtonsProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handleViewReceipt = () => {
    const receiptHTML = ReceiptGenerator.generateHTML(orderData, tenantName, formatCurrency);
    const viewWindow = window.open('', '_blank');
    if (viewWindow) {
      viewWindow.document.write(receiptHTML);
      viewWindow.document.close();
      toast.success("Receipt opened in new window");
    } else {
      toast.error("Could not open receipt window");
    }
  };

  const handlePrintReceipt = async () => {
    setIsPrinting(true);
    try {
      const receiptHTML = ReceiptGenerator.generateHTML(orderData, tenantName, formatCurrency);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        toast.success("Receipt sent to printer");
      } else {
        toast.error("Could not open print window");
      }
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print receipt");
    } finally {
      setIsPrinting(false);
    }
  };

  const whatsappMessage = ReceiptGenerator.generateWhatsAppMessage(
    orderData,
    tenantName,
    formatCurrency
  );

  return (
    <div className="grid grid-cols-3 gap-2">
      <Button
        variant="outline"
        onClick={handleViewReceipt}
        className="flex flex-col items-center p-4 h-auto"
      >
        <Eye className="h-5 w-5 mb-1" />
        <span className="text-xs">View</span>
      </Button>

      <Button
        variant="outline"
        onClick={handlePrintReceipt}
        disabled={isPrinting}
        className="flex flex-col items-center p-4 h-auto"
      >
        <Printer className="h-5 w-5 mb-1" />
        <span className="text-xs">{isPrinting ? "Printing..." : "Print"}</span>
      </Button>

      <WhatsAppButton
        phoneNumber={orderData.customerPhone}
        message={whatsappMessage}
        className="flex flex-col items-center p-4 h-auto"
        variant="outline"
      >
        <span className="text-xl mb-1">📱</span>
        <span className="text-xs">Share</span>
      </WhatsAppButton>
    </div>
  );
}
