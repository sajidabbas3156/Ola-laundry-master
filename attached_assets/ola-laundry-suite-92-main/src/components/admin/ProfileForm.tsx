
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { profileUpdateSchema, sanitizeInput } from "@/lib/validation";

export function ProfileForm() {
  const { currentUser, updateProfile, error, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    try {
      profileUpdateSchema.parse(profileForm);
      setFormErrors({});
      return true;
    } catch (err: any) {
      const errors: Record<string, string> = {};
      err.errors?.forEach((error: any) => {
        errors[error.path[0]] = error.message;
      });
      setFormErrors(errors);
      return false;
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Sanitize inputs
      const sanitizedName = sanitizeInput(profileForm.name);
      const sanitizedEmail = sanitizeInput(profileForm.email);
      
      const success = await updateProfile(sanitizedName, sanitizedEmail);
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (err) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              disabled={isLoading || isSubmitting}
              className={formErrors.name ? "border-red-500" : ""}
              autoComplete="name"
              required
            />
            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              disabled={isLoading || isSubmitting}
              className={formErrors.email ? "border-red-500" : ""}
              autoComplete="email"
              required
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>
          
          {error && (
            <div className="text-sm font-medium text-red-500">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
