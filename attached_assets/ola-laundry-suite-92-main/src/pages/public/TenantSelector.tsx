
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const demoTenants = [
  { id: "fastwash", name: "FastWash Laundry", subdomain: "fastwash" },
  { id: "cleandrop", name: "CleanDrop Service", subdomain: "cleandrop" },
  { id: "sparkle", name: "Sparkle Clean", subdomain: "sparkle" },
];

export default function TenantSelector() {
  const navigate = useNavigate();

  const handleTenantSelect = (tenant: any) => {
    navigate(`/tenant/${tenant.subdomain}/login`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Select Your Business</CardTitle>
          <CardDescription>Choose a demo tenant to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {demoTenants.map(tenant => (
            <Button
              key={tenant.id}
              variant="outline"
              className="w-full p-4 h-auto justify-start"
              onClick={() => handleTenantSelect(tenant)}
            >
              <div className="text-left">
                <div className="font-medium">{tenant.name}</div>
                <div className="text-sm text-gray-500">@{tenant.subdomain}</div>
              </div>
            </Button>
          ))}
          
          <div className="border-t pt-4 mt-6">
            <p className="text-center text-sm text-gray-600 mb-2">Or</p>
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate("/admin/login")}
            >
              Super Admin Login
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>Don't have an account?</p>
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Start a free trial
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
