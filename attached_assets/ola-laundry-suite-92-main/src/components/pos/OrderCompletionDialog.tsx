
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { CartItem } from "@/types/pos";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { OrderActionButtons } from "./OrderActionButtons";

interface OrderCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    orderId: string;
    customerName: string;
    customerPhone: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    date: Date;
  } | null;
  tenantName?: string;
  formatCurrency: (amount: number) => string;
}

export function OrderCompletionDialog({
  isOpen,
  onClose,
  orderData,
  tenantName,
  formatCurrency
}: OrderCompletionDialogProps) {
  if (!orderData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Order Completed Successfully!
          </DialogTitle>
        </DialogHeader>

        <OrderSummaryCard
          orderData={orderData}
          tenantName={tenantName}
          formatCurrency={formatCurrency}
        />

        <div className="space-y-3">
          <OrderActionButtons
            orderData={orderData}
            tenantName={tenantName || "Laundry Service"}
            formatCurrency={formatCurrency}
          />

          <Button onClick={onClose} className="w-full">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
