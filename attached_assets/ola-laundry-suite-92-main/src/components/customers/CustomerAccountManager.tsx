
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, UserPlus, LogIn } from "lucide-react";
import { useCustomers } from "@/contexts/CustomerContext";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "@/components/ui/sonner";

interface CustomerAccountManagerProps {
  onCustomerSelected: (customerId: string) => void;
}

export function CustomerAccountManager({ onCustomerSelected }: CustomerAccountManagerProps) {
  const [mode, setMode] = useState<"select" | "register" | "login">("select");
  const [loginData, setLoginData] = useState({ phone: "", email: "" });
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  
  const { getCustomersByTenant, addCustomer } = useCustomers();
  const { currentTenant } = useTenant();
  
  const customers = currentTenant ? getCustomersByTenant(currentTenant.id) : [];

  const handleCustomerLogin = () => {
    const customer = customers.find(c => 
      c.phone === loginData.phone || c.email === loginData.email
    );
    
    if (customer) {
      onCustomerSelected(customer.id);
      toast.success(`Welcome back, ${customer.name}!`);
      setMode("select");
    } else {
      toast.error("Customer not found. Please register as a new customer.");
      setMode("register");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "select" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setMode("register")}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                First Time Customer
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setMode("login")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Returning Customer
              </Button>
            </div>
            
            {customers.length > 0 && (
              <div>
                <Label className="text-sm text-gray-600">Recent Customers</Label>
                <div className="space-y-1 mt-1">
                  {customers.slice(0, 3).map(customer => (
                    <Button
                      key={customer.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => onCustomerSelected(customer.id)}
                    >
                      {customer.name} - {customer.phone}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {mode === "login" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="login-phone">Phone or Email</Label>
              <Input
                id="login-phone"
                placeholder="Enter phone number or email"
                value={loginData.phone}
                onChange={(e) => setLoginData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCustomerLogin} className="flex-1">
                Login
              </Button>
              <Button variant="outline" onClick={() => setMode("select")}>
                Back
              </Button>
            </div>
          </div>
        )}

        {mode === "register" && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <UserPlus className="h-4 w-4 inline mr-1" />
                Creating account for first-time customer
              </p>
            </div>
            <Button variant="outline" onClick={() => setMode("select")}>
              Back to Selection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
