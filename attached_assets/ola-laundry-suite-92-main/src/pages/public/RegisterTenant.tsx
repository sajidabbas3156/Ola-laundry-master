
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function RegisterTenant() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [businessName, setBusinessName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSubdomain = (value: string) => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(value);
    
    if (value && !validateSubdomain(value)) {
      setErrors({ ...errors, subdomain: "Subdomain can only contain lowercase letters, numbers, and hyphens" });
    } else {
      const { subdomain, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBusinessName(value);
    
    if (value && !subdomain) {
      // Auto-generate subdomain from business name
      const generatedSubdomain = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setSubdomain(generatedSubdomain);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    
    if (!subdomain.trim()) {
      newErrors.subdomain = "Subdomain is required";
    } else if (!validateSubdomain(subdomain)) {
      newErrors.subdomain = "Subdomain can only contain lowercase letters, numbers, and hyphens";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Tenant created successfully!",
        description: `Your account has been created. You'll be redirected to login.`,
      });
      
      // In a real app, this would redirect to the new tenant's domain
      setTimeout(() => {
        navigate(`/tenant/${subdomain}/login`);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-ola-50 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Start Your 14-Day Free Trial</CardTitle>
          <CardDescription>No credit card required. Cancel anytime.</CardDescription>
        </CardHeader>
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register New Business</TabsTrigger>
            <TabsTrigger value="features">Features & Benefits</TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g. Clean Drop Laundry"
                    value={businessName}
                    onChange={handleBusinessNameChange}
                    disabled={isLoading}
                    className={errors.businessName ? "border-red-500" : ""}
                  />
                  {errors.businessName && (
                    <p className="text-sm font-medium text-red-500">{errors.businessName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <div className="flex items-center">
                    <Input
                      id="subdomain"
                      placeholder="your-business"
                      value={subdomain}
                      onChange={handleSubdomainChange}
                      disabled={isLoading}
                      className={errors.subdomain ? "border-red-500 rounded-r-none" : "rounded-r-none"}
                    />
                    <div className="bg-gray-100 border border-l-0 border-input px-3 py-2 rounded-r-md text-sm text-gray-500">
                      .olaorders.site
                    </div>
                  </div>
                  {errors.subdomain ? (
                    <p className="text-sm font-medium text-red-500">{errors.subdomain}</p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      This will be your custom URL: https://{subdomain || "your-business"}.olaorders.site
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm font-medium text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password ? (
                    <p className="text-sm font-medium text-red-500">{errors.password}</p>
                  ) : (
                    <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm font-medium text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Creating Your Account..." : "Create Account & Start Free Trial"}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-500 mt-6">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-ola-600 hover:text-ola-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-ola-600 hover:text-ola-700">
                  Privacy Policy
                </a>
              </div>
            </CardContent>
          </TabsContent>
          <TabsContent value="features">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Customer Management</h3>
                    <p className="text-gray-600 text-sm">Store customer details, order history, and preferences for personalized service.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Order Tracking</h3>
                    <p className="text-gray-600 text-sm">Track orders from intake to delivery with real-time status updates.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Delivery Management</h3>
                    <p className="text-gray-600 text-sm">Schedule pickups and deliveries with route optimization.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Inventory Management</h3>
                    <p className="text-gray-600 text-sm">Track laundry items, supplies, and equipment inventory.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Billing & Invoicing</h3>
                    <p className="text-gray-600 text-sm">Generate professional invoices and manage customer payments.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Reports & Analytics</h3>
                    <p className="text-gray-600 text-sm">Gain insights into your business performance with detailed reports.</p>
                  </div>
                </div>
                
                <div className="bg-ola-50 rounded-lg p-4 border border-ola-100">
                  <h3 className="font-medium text-lg mb-2 text-ola-700">All Plans Include:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Custom subdomain (yourbusiness.olaorders.site)
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Email notifications for orders
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Responsive design for desktop and mobile
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Customer support
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => {
                const registerTab = document.querySelector('button[value="register"]');
                if (registerTab instanceof HTMLElement) {
                  registerTab.click();
                }
              }}>
                Start Your Free Trial
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
