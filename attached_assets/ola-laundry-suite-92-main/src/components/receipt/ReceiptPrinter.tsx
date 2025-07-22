
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Printer, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { CartItem } from "@/types/pos";
import { useTenant } from "@/contexts/TenantContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { ReceiptContent } from "@/components/receipt/ReceiptContent";
import { ReceiptActions } from "@/components/receipt/ReceiptActions";

interface ReceiptData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  date: Date;
  notes?: string;
}

interface ReceiptPrinterProps {
  receiptData: ReceiptData;
  onPrintComplete?: () => void;
}

export function ReceiptPrinter({ receiptData, onPrintComplete }: ReceiptPrinterProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const { currentTenant } = useTenant();
  const { formatCurrency } = useLocalization();

  const generateReceiptHTML = () => {
    return `
      <html>
        <head>
          <title>Receipt - ${receiptData.orderId}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              max-width: 300px; 
              margin: 0 auto; 
              padding: 10px;
              font-size: 12px;
              line-height: 1.4;
            }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .logo { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
            .item { display: flex; justify-content: space-between; margin: 3px 0; }
            .total { border-top: 2px solid #000; padding-top: 5px; margin-top: 10px; font-weight: bold; }
            .footer { text-align: center; margin-top: 15px; font-size: 10px; }
            @media print {
              body { width: 58mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">${currentTenant?.name || "Laundry Service"}</div>
            <div>${currentTenant?.address || ""}</div>
            <div>${currentTenant?.phone || ""}</div>
          </div>
          
          <div>
            <strong>Order #: ${receiptData.orderId}</strong><br>
            <strong>Date:</strong> ${receiptData.date.toLocaleDateString()} ${receiptData.date.toLocaleTimeString()}<br>
            <strong>Customer:</strong> ${receiptData.customerName}<br>
            <strong>Phone:</strong> ${receiptData.customerPhone}
          </div>
          
          <hr style="margin: 10px 0;">
          
          ${receiptData.items.map(item => `
            <div class="item">
              <span>${item.quantity}x ${item.name}</span>
              <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
            ${item.service ? `<div style="font-size: 10px; color: #666; margin-left: 10px;">${item.service.name}</div>` : ''}
          `).join('')}
          
          <div class="total">
            <div class="item">
              <span>TOTAL:</span>
              <span>${formatCurrency(receiptData.total)}</span>
            </div>
          </div>
          
          ${receiptData.notes ? `<div style="margin-top: 10px;"><strong>Notes:</strong> ${receiptData.notes}</div>` : ''}
          
          <div class="footer">
            <div>Thank you for your business!</div>
            <div>Please keep this receipt</div>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(generateReceiptHTML());
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        
        toast.success("Receipt sent to printer");
        onPrintComplete?.();
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

  const handleDownload = () => {
    const receiptHTML = generateReceiptHTML();
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptData.orderId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Receipt downloaded");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
          <Printer className="h-4 w-4 mr-2" />
          Print Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Order Complete
          </DialogTitle>
        </DialogHeader>
        
        <ReceiptContent
          receiptData={receiptData}
          tenantName={currentTenant?.name}
          formatCurrency={formatCurrency}
        />
        
        <ReceiptActions
          onPrint={handlePrint}
          onDownload={handleDownload}
          isPrinting={isPrinting}
        />
      </DialogContent>
    </Dialog>
  );
}
