
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Customer } from "@/lib/mockData";

interface RecentCustomersProps {
  customers: Customer[];
}

export function RecentCustomers({ customers }: RecentCustomersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>New customers joined recently</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.slice(0, 3).map((customer) => (
            <div key={customer.id} className="border rounded-md p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-ola-100 flex items-center justify-center">
                  <span className="font-medium text-ola-600">{customer.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <p className="text-gray-500">{customer.phone}</p>
                <p className="text-gray-500 truncate">{customer.address}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
