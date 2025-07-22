
import { useState } from "react";
import { Customer } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CustomerSearch } from "./CustomerSearch";
import { AddCustomerDialog } from "@/components/customers/AddCustomerDialog";
import { useCustomers } from "@/contexts/CustomerContext";

interface StorefrontCustomerSelectorProps {
  selectedCustomer: Customer | null;
  shouldShowCustomerDialog: () => boolean;
  onSelectCustomer: (customer: Customer) => void;
  onClearCustomer: () => void;
  onNewCustomerCreated: (customer: Customer) => void;
}

export function StorefrontCustomerSelector({
  selectedCustomer,
  shouldShowCustomerDialog,
  onSelectCustomer,
  onClearCustomer,
  onNewCustomerCreated
}: StorefrontCustomerSelectorProps) {
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const { customers } = useCustomers();

  const handleCustomerAdded = (customerId: string) => {
    const newCustomer = customers.find(c => c.id === customerId);
    if (newCustomer) {
      onNewCustomerCreated(newCustomer);
    }
    setShowNewCustomerDialog(false);
  };

  if (selectedCustomer) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
        <div>
          <p className="text-sm font-medium">{selectedCustomer.name}</p>
          <p className="text-xs text-gray-500">{selectedCustomer.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onClearCustomer}>
          Clear Customer
        </Button>
      </div>
    );
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild disabled={!shouldShowCustomerDialog()}>
          <Button variant="outline">Select Customer</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select Existing Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Search for an existing customer or create a new customer to
              continue with the order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <CustomerSearch onSelect={onSelectCustomer} />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="secondary" onClick={() => setShowNewCustomerDialog(true)}>
              New Customer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddCustomerDialog
        open={showNewCustomerDialog}
        onOpenChange={setShowNewCustomerDialog}
        onCustomerAdded={handleCustomerAdded}
      />
    </>
  );
}
