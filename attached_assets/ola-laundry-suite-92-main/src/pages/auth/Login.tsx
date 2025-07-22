
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, sanitizeInput, checkRateLimit } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { tenantSlug } = useParams();
  const navigate = useNavigate();
  const { login, isAuthenticated, error, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/tenant/${tenantSlug}/dashboard`);
    }
  }, [isAuthenticated, navigate, tenantSlug]);

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Enhanced rate limiting check
    const clientIP = "user"; // In production, this would be the actual client IP
    if (!checkRateLimit(`login_${clientIP}`, 5, 15 * 60 * 1000)) {
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Sanitize inputs to prevent XSS
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = sanitizeInput(password);
      
      const success = await login(sanitizedEmail, sanitizedPassword, tenantSlug);
      if (success) {
        // Clear form data for security
        setEmail("");
        setPassword("");
        navigate(`/tenant/${tenantSlug}/dashboard`);
      }
    } catch (err) {
      // Don't expose internal error details
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tenantName = tenantSlug ? tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1) : "Demo";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to {tenantName}</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
          <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <strong>Demo Credentials:</strong><br />
            Email: demo@demo.com<br />
            Password: demo123
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isSubmitting}
                className={formErrors.email ? "border-red-500" : ""}
                autoComplete="email"
                required
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isSubmitting}
                className={formErrors.password ? "border-red-500" : ""}
                autoComplete="current-password"
                required
              />
              {formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>
            
            {error && (
              <div className="text-sm font-medium text-red-500">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate("/select-tenant")}
              disabled={isSubmitting}
            >
              Back to Tenant Selection
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
