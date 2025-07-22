
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { AddCustomerDialog } from "@/components/customers/AddCustomerDialog";
import { useCustomers } from "@/contexts/CustomerContext";
import { useTenant } from "@/contexts/TenantContext";

interface CustomerSelectorProps {
  tenantCustomers: any[];
  selectedCustomer: string;
  setSelectedCustomer: (customerId: string) => void;
}

export function CustomerSelector({
  tenantCustomers,
  selectedCustomer,
  setSelectedCustomer
}: CustomerSelectorProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { getCustomersByTenant } = useCustomers();
  const { currentTenant } = useTenant();

  // Get fresh customer list
  const customers = currentTenant ? getCustomersByTenant(currentTenant.id) : [];

  const handleCustomerAdded = (customerId: string) => {
    setSelectedCustomer(customerId);
    setShowAddDialog(false);
  };

  return (
    <div className="space-y-3">
      <Select 
        value={selectedCustomer} 
        onValueChange={setSelectedCustomer}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a customer" />
        </SelectTrigger>
        <SelectContent>
          {customers.map(customer => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name} - {customer.phone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        className="w-full h-12 text-sm font-medium"
        onClick={() => setShowAddDialog(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Customer
      </Button>

      <AddCustomerDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCustomerAdded={handleCustomerAdded}
      />
    </div>
  );
}
