
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { Users, Plus, Edit, Trash2, Shield } from "lucide-react";
import { Staff, StaffRole } from "@/types/business-admin";

const defaultRoles: StaffRole[] = [
  { id: "manager", name: "Manager", description: "Full access", permissions: ["all"], color: "blue" },
  { id: "washer", name: "Washer", description: "Washing operations", permissions: ["pos", "inventory"], color: "green" },
  { id: "delivery", name: "Delivery Staff", description: "Delivery operations", permissions: ["delivery", "pos"], color: "orange" },
  { id: "ironing", name: "Ironing Staff", description: "Ironing operations", permissions: ["pos"], color: "purple" },
  { id: "customer-service", name: "Customer Service", description: "Customer interactions", permissions: ["pos", "customers"], color: "pink" }
];

const availablePermissions = ["pos", "inventory", "reports", "customers", "delivery", "staff_management", "settings"];

export function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<StaffRole[]>(defaultRoles);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    hourlyRate: "",
    emergencyContact: ""
  });

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    color: "blue"
  });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role || !newStaff.hourlyRate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedRole = roles.find(r => r.id === newStaff.role);
    if (!selectedRole) {
      toast.error("Please select a valid role");
      return;
    }

    const staffMember: Staff = {
      id: Date.now().toString(),
      name: newStaff.name,
      role: selectedRole,
      email: newStaff.email,
      phone: newStaff.phone,
      hourlyRate: parseFloat(newStaff.hourlyRate),
      permissions: selectedRole.permissions,
      isActive: true,
      hireDate: new Date(),
      emergencyContact: newStaff.emergencyContact
    };

    setStaff(prev => [...prev, staffMember]);
    setNewStaff({ name: "", email: "", phone: "", role: "", hourlyRate: "", emergencyContact: "" });
    setIsAddStaffOpen(false);
    toast.success("Staff member added successfully!");
  };

  const handleAddRole = () => {
    if (!newRole.name || newRole.permissions.length === 0) {
      toast.error("Please provide role name and at least one permission");
      return;
    }

    const role: StaffRole = {
      id: newRole.name.toLowerCase().replace(/\s+/g, '-'),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      color: newRole.color
    };

    setRoles(prev => [...prev, role]);
    setNewRole({ name: "", description: "", permissions: [], color: "blue" });
    setIsRoleDialogOpen(false);
    toast.success("Role created successfully!");
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    toast.success("Staff member removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Staff Management</h2>
        <div className="flex gap-2">
          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Manage Roles
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Role Name</Label>
                  <Input
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    placeholder="Enter role name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newRole.description}
                    onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    placeholder="Role description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availablePermissions.map(permission => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          checked={newRole.permissions.includes(permission)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewRole(prev => ({...prev, permissions: [...prev.permissions, permission]}));
                            } else {
                              setNewRole(prev => ({...prev, permissions: prev.permissions.filter(p => p !== permission)}));
                            }
                          }}
                        />
                        <Label className="capitalize">{permission.replace(/_/g, ' ')}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddRole} className="flex-1">
                    Create Role
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role *</Label>
                    <Select value={newStaff.role} onValueChange={(value) => setNewStaff({...newStaff, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hourly Rate *</Label>
                    <Input
                      type="number"
                      step="0.50"
                      value={newStaff.hourlyRate}
                      onChange={(e) => setNewStaff({...newStaff, hourlyRate: e.target.value})}
                      placeholder="15.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Contact</Label>
                    <Input
                      value={newStaff.emergencyContact}
                      onChange={(e) => setNewStaff({...newStaff, emergencyContact: e.target.value})}
                      placeholder="Emergency contact"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsAddStaffOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddStaff} className="flex-1">
                    Add Staff
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {member.name}
                <Badge 
                  variant="outline" 
                  style={{ color: member.role.color }}
                >
                  {member.role.name}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> {member.email}</p>
                <p><strong>Phone:</strong> {member.phone}</p>
                <p><strong>Rate:</strong> ${member.hourlyRate}/hr</p>
                <p><strong>Hire Date:</strong> {member.hireDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {member.permissions.map(permission => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteStaff(member.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {staff.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No staff members yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first staff member to get started with staff management.
            </p>
            <Button onClick={() => setIsAddStaffOpen(true)}>
              Add First Staff Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
