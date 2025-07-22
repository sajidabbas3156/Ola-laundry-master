
import { useState } from "react";
import { Customer } from "@/lib/mockData";

export function useStorefrontDialogState() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);

  const shouldShowCustomerDialog = (): boolean => {
    return !selectedCustomer && !showNewCustomerForm;
  };

  return {
    selectedCustomer,
    setSelectedCustomer,
    showNewCustomerForm,
    setShowNewCustomerForm,
    showCheckoutDialog,
    setShowCheckoutDialog,
    shouldShowCustomerDialog
  };
}
