
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Customer } from "@/lib/mockData";
import { useCustomers } from "@/contexts/CustomerContext";
import { useTenant } from "@/contexts/TenantContext";
import { Search, User } from "lucide-react";

interface CustomerSearchProps {
  onSelect: (customer: Customer) => void;
}

export function CustomerSearch({ onSelect }: CustomerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { customers } = useCustomers();
  const { currentTenant } = useTenant();

  const tenantCustomers = currentTenant 
    ? customers.filter(customer => customer.tenantId === currentTenant.id)
    : [];

  const filteredCustomers = tenantCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p className="font-medium">No customers found</p>
            <p className="text-sm mt-1">
              {searchQuery ? "Try adjusting your search" : "No customers available"}
            </p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(customer)}
            >
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.phone}</p>
                {customer.email && (
                  <p className="text-sm text-gray-500">{customer.email}</p>
                )}
              </div>
              <Button variant="outline" size="sm">
                Select
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
