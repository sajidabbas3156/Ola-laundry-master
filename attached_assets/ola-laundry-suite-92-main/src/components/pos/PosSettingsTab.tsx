
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Users, Calculator, CreditCard } from "lucide-react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { toast } from "@/components/ui/sonner";

export function PosSettingsTab() {
  const { formatCurrency } = useLocalization();

  const handleSaveSettings = () => {
    toast.success("POS settings saved successfully!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h2 className="text-2xl font-bold">POS Settings</h2>
      </div>

      <Tabs defaultValue="recipe" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="recipe">Recipe Config</TabsTrigger>
          <TabsTrigger value="staff">Staff & Roles</TabsTrigger>
          <TabsTrigger value="tax">Tax Settings</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="recipe">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Configuration & Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wash-temp">Default Wash Temperature</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select temperature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cold">Cold (30°C)</SelectItem>
                      <SelectItem value="warm">Warm (40°C)</SelectItem>
                      <SelectItem value="hot">Hot (60°C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cycle-time">Default Cycle Time</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="special-instructions">Special Instructions Template</Label>
                <Textarea 
                  id="special-instructions" 
                  placeholder="Enter default special care instructions..."
                  className="min-h-[100px]"
                />
              </div>
              <Button onClick={handleSaveSettings}>Save Recipe Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Access & Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Manager Access</h4>
                    <p className="text-sm text-muted-foreground">Full system access including settings</p>
                  </div>
                  <Badge variant="secondary">Admin</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cashier Access</h4>
                    <p className="text-sm text-muted-foreground">POS and order management only</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Delivery Staff</h4>
                    <p className="text-sm text-muted-foreground">Delivery management and updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Button onClick={handleSaveSettings}>Update Permissions</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Tax Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" defaultValue="8.5" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-name">Tax Name</Label>
                  <Input id="tax-name" defaultValue="Sales Tax" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="tax-inclusive" />
                <Label htmlFor="tax-inclusive">Tax inclusive pricing</Label>
              </div>
              <Button onClick={handleSaveSettings}>Save Tax Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cash Payment</h4>
                    <p className="text-sm text-muted-foreground">Accept cash payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Card Payment</h4>
                    <p className="text-sm text-muted-foreground">Credit/Debit card processing</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cash on Delivery</h4>
                    <p className="text-sm text-muted-foreground">Payment upon delivery</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Benefit Pay</h4>
                    <p className="text-sm text-muted-foreground">Digital wallet payments</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <Button onClick={handleSaveSettings}>Update Payment Methods</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Session Timeout</h4>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Access Logging</h4>
                    <p className="text-sm text-muted-foreground">Log all system access attempts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Button onClick={handleSaveSettings}>Update Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
