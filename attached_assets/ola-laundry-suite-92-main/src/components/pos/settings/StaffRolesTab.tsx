
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Users, Plus, Trash2, Save } from "lucide-react";
import { StaffRole } from "@/types/pos-settings";

interface StaffRolesTabProps {
  staffRoles: StaffRole[];
  setStaffRoles: React.Dispatch<React.SetStateAction<StaffRole[]>>;
}

export function StaffRolesTab({ staffRoles, setStaffRoles }: StaffRolesTabProps) {
  const [newRole, setNewRole] = useState({ name: "", permissions: [] as string[] });

  const availablePermissions = ["pos", "inventory", "reports", "settings", "customers", "delivery", "staff_management", "payment_processing"];

  const handleSaveStaffRoles = () => {
    if (staffRoles.length === 0) {
      toast.error("At least one staff role must be configured");
      return;
    }
    
    localStorage.setItem('pos_staff_roles', JSON.stringify(staffRoles));
    toast.success("Staff roles and permissions saved successfully!");
  };

  const handleAddRole = () => {
    if (newRole.name.trim()) {
      const role: StaffRole = {
        id: newRole.name.toLowerCase().replace(/\s+/g, '-'),
        name: newRole.name,
        permissions: newRole.permissions
      };
      setStaffRoles(prev => [...prev, role]);
      setNewRole({ name: "", permissions: [] });
      toast.success("Role added successfully!");
    }
  };

  const handleDeleteRole = (roleId: string) => {
    if (roleId === "admin") {
      toast.error("Cannot delete admin role");
      return;
    }
    setStaffRoles(prev => prev.filter(r => r.id !== roleId));
    toast.success("Role deleted successfully!");
  };

  const handlePermissionToggle = (roleId: string, permission: string) => {
    setStaffRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const newPermissions = role.permissions.includes(permission)
          ? role.permissions.filter(p => p !== permission)
          : [...role.permissions, permission];
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Staff Roles & Permissions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {staffRoles.map((role) => (
          <div key={role.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{role.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{role.permissions.length} permissions</Badge>
                {role.id !== "admin" && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Permissions:</Label>
              <div className="grid grid-cols-2 gap-2">
                {availablePermissions.map(permission => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Switch
                      checked={role.permissions.includes(permission)}
                      onCheckedChange={() => handlePermissionToggle(role.id, permission)}
                      disabled={role.id === "admin" && permission === "all"}
                    />
                    <Label className="capitalize">{permission.replace(/_/g, ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <div className="border rounded-lg p-4 bg-muted/50">
          <h4 className="font-medium mb-3">Add New Role</h4>
          <div className="space-y-3">
            <Input
              placeholder="Role name"
              value={newRole.name}
              onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              {availablePermissions.map(permission => (
                <div key={permission} className="flex items-center space-x-2">
                  <Switch
                    checked={newRole.permissions.includes(permission)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewRole(prev => ({ ...prev, permissions: [...prev.permissions, permission] }));
                      } else {
                        setNewRole(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission) }));
                      }
                    }}
                  />
                  <Label className="capitalize">{permission.replace(/_/g, ' ')}</Label>
                </div>
              ))}
            </div>
            <Button onClick={handleAddRole}>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
        </div>
        
        <Button onClick={handleSaveStaffRoles} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Staff Roles
        </Button>
      </CardContent>
    </Card>
  );
}
