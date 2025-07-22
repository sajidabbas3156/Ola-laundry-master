
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { CustomerSelector } from "@/components/pos/CustomerSelector";

interface PosCustomerSectionProps {
  tenantCustomers: any[];
  selectedCustomer: string;
  setSelectedCustomer: (customerId: string) => void;
}

export function PosCustomerSection({
  tenantCustomers,
  selectedCustomer,
  setSelectedCustomer
}: PosCustomerSectionProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg py-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Users className="h-6 w-6" />
          Customer Management
          {selectedCustomer && (
            <Badge variant="secondary" className="bg-white/20 text-white">
              Customer Selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <CustomerSelector
          tenantCustomers={tenantCustomers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
        {selectedCustomer && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              ✓ Customer selected: {tenantCustomers.find(c => c.id === selectedCustomer)?.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
