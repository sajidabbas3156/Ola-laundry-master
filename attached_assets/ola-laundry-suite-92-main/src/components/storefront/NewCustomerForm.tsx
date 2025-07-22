
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from "@/lib/mockData";
import { useCustomers } from "@/contexts/CustomerContext";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "@/components/ui/sonner";

interface NewCustomerFormProps {
  onCustomerCreated: (customer: Customer) => void;
  onClose: () => void;
}

export function NewCustomerForm({ onCustomerCreated, onClose }: NewCustomerFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const { addCustomer } = useCustomers();
  const { currentTenant } = useTenant();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim() || !currentTenant?.id) {
      toast.error("Name and phone are required");
      return;
    }

    try {
      const newCustomer = addCustomer({
        tenantId: currentTenant.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim()
      });

      onCustomerCreated(newCustomer);
      toast.success("Customer created successfully!");
    } catch (error) {
      toast.error("Failed to create customer");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Create New Customer</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Customer address"
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={!name.trim() || !phone.trim()}>
          Create Customer
        </Button>
      </form>
    </div>
  );
}
