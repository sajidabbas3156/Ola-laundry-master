
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Store, LogIn, UserPlus, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EnhancedStorefrontLoginProps {
  onCustomerLogin: (customer: any) => void;
}

export function EnhancedStorefrontLogin({ onCustomerLogin }: EnhancedStorefrontLoginProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    name: "",
    password: ""
  });

  const handleLogin = () => {
    // Simulate login logic
    const mockCustomer = {
      id: `customer_${Date.now()}`,
      name: formData.name || "Customer",
      phone: formData.phone,
      email: formData.email,
      isReturning: loginMode === "login"
    };
    
    onCustomerLogin(mockCustomer);
    setIsLoginOpen(false);
    setFormData({ phone: "", email: "", name: "", password: "" });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button 
            size="lg" 
            className="rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Store className="h-5 w-5 mr-2" />
            Storefront Access
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              {loginMode === "login" ? "Customer Login" : "Create Account"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Mode Selector */}
            <div className="flex rounded-lg border p-1">
              <Button
                variant={loginMode === "login" ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setLoginMode("login")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button
                variant={loginMode === "register" ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setLoginMode("register")}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register
              </Button>
            </div>

            {/* Login Form */}
            {loginMode === "login" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="login-phone">Phone Number</Label>
                  <Input
                    id="login-phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password (Optional)</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter password if set"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <Badge variant="secondary" className="w-full justify-center">
                  <User className="h-3 w-3 mr-1" />
                  Returning Customer Login
                </Badge>
              </div>
            )}

            {/* Registration Form */}
            {loginMode === "register" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input
                    id="reg-name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="reg-phone">Phone Number</Label>
                  <Input
                    id="reg-phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="reg-email">Email (Optional)</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <Badge variant="secondary" className="w-full justify-center">
                  <UserPlus className="h-3 w-3 mr-1" />
                  First Time Customer Registration
                </Badge>
              </div>
            )}

            <Button 
              onClick={handleLogin}
              disabled={!formData.phone || (loginMode === "register" && !formData.name)}
              className="w-full"
            >
              {loginMode === "login" ? "Login to Storefront" : "Create Account & Continue"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
