
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { passwordChangeSchema, sanitizeInput } from "@/lib/validation";

export function PasswordChangeForm() {
  const { changePassword, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    try {
      passwordChangeSchema.parse(passwordForm);
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Sanitize inputs
      const sanitizedCurrentPassword = sanitizeInput(passwordForm.currentPassword);
      const sanitizedNewPassword = sanitizeInput(passwordForm.newPassword);
      
      const success = await changePassword(sanitizedCurrentPassword, sanitizedNewPassword);
      if (success) {
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      toast({
        title: "Password change failed",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordChange} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              disabled={isLoading || isSubmitting}
              className={formErrors.currentPassword ? "border-red-500" : ""}
              autoComplete="current-password"
              required
            />
            {formErrors.currentPassword && (
              <p className="text-sm text-red-500">{formErrors.currentPassword}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              disabled={isLoading || isSubmitting}
              className={formErrors.newPassword ? "border-red-500" : ""}
              autoComplete="new-password"
              required
            />
            {formErrors.newPassword && (
              <p className="text-sm text-red-500">{formErrors.newPassword}</p>
            )}
            <p className="text-xs text-gray-500">
              Password must be at least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              disabled={isLoading || isSubmitting}
              className={formErrors.confirmPassword ? "border-red-500" : ""}
              autoComplete="new-password"
              required
            />
            {formErrors.confirmPassword && (
              <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
