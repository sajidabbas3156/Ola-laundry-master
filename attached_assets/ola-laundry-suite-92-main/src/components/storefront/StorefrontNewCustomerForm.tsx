
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCustomers } from "@/contexts/CustomerContext";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "@/components/ui/sonner";

interface StorefrontNewCustomerFormProps {
  onCustomerCreated: (customerId: string) => void;
}

export function StorefrontNewCustomerForm({
  onCustomerCreated
}: StorefrontNewCustomerFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const { addCustomer } = useCustomers();
  const { currentTenant } = useTenant();

  const handleCreateCustomer = () => {
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

      onCustomerCreated(newCustomer.id);
      
      // Reset form
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setShowForm(false);
      
      toast.success("Customer created successfully!");
    } catch (error) {
      toast.error("Failed to create customer");
    }
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setShowForm(checked === true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="newCustomer" 
          checked={showForm}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="newCustomer">I'm a new customer</Label>
      </div>
      
      {showForm && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <h4 className="font-medium">Create New Customer Account</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newName">Name *</Label>
              <Input
                id="newName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPhone">Phone *</Label>
              <Input
                id="newPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newEmail">Email</Label>
            <Input
              id="newEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newAddress">Address</Label>
            <Input
              id="newAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Your address"
            />
          </div>
          <Button 
            onClick={handleCreateCustomer}
            disabled={!name.trim() || !phone.trim()}
            className="w-full"
          >
            Create Customer Account
          </Button>
        </div>
      )}
    </div>
  );
}
