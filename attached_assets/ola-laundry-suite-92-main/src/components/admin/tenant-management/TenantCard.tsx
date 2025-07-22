
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tenant } from "@/types/tenant-management";
import { TenantFeaturesList } from "./TenantFeaturesList";

interface TenantCardProps {
  tenant: Tenant;
  onFeatureToggle: (tenantId: string, featureId: string, enabled: boolean) => void;
  onStatusChange: (tenantId: string, newStatus: "active" | "inactive" | "trial") => void;
  onSubscriptionChange: (tenantId: string, newPlan: "basic" | "premium" | "enterprise") => void;
  getEnabledFeatureCount: (tenant: Tenant) => number;
  getStatusBadgeVariant: (status: string) => "default" | "secondary" | "destructive" | "outline";
}

export function TenantCard({
  tenant,
  onFeatureToggle,
  onStatusChange,
  onSubscriptionChange,
  getEnabledFeatureCount,
  getStatusBadgeVariant
}: TenantCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {tenant.name.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-xl">{tenant.name}</CardTitle>
              <p className="text-sm text-gray-500">{tenant.email}</p>
              <p className="text-xs text-gray-400">{tenant.subdomain}.olaundry.com</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(tenant.status)}>
              {tenant.status}
            </Badge>
            <Badge variant="outline">
              {tenant.subscriptionPlan}
            </Badge>
            <Badge variant="secondary">
              {getEnabledFeatureCount(tenant)}/9 features
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Manage {tenant.name}</DialogTitle>
                  <DialogDescription>
                    Update tenant status and subscription plan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Status</Label>
                    <div className="flex gap-2 mt-1">
                      {["active", "trial", "inactive"].map((status) => (
                        <Button
                          key={status}
                          variant={tenant.status === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => onStatusChange(tenant.id, status as any)}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Subscription Plan</Label>
                    <div className="flex gap-2 mt-1">
                      {["basic", "premium", "enterprise"].map((plan) => (
                        <Button
                          key={plan}
                          variant={tenant.subscriptionPlan === plan ? "default" : "outline"}
                          size="sm"
                          onClick={() => onSubscriptionChange(tenant.id, plan as any)}
                        >
                          {plan}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TenantFeaturesList tenant={tenant} onFeatureToggle={onFeatureToggle} />
      </CardContent>
    </Card>
  );
}
