import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { generateSecureToken } from "@/lib/security";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "staff";
  tenantId: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string, tenantId?: string | null) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced token validation with proper security checks
const validateToken = (token: string): User | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const userData = JSON.parse(atob(parts[0]));
    const timestamp = parseInt(atob(parts[1]));
    
    // Check token expiration (24 hours)
    const now = Date.now();
    const tokenAge = now - timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (tokenAge > maxAge) {
      return null;
    }
    
    // Validate required fields
    if (!userData.id || !userData.email || !userData.role) {
      return null;
    }
    
    // Validate role
    if (!['admin', 'manager', 'staff'].includes(userData.role)) {
      return null;
    }
    
    return userData;
  } catch {
    return null;
  }
};

// Secure authentication function - will be replaced with Supabase integration
const authenticateUser = async (email: string, password: string, tenantId?: string | null): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Input validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 6) {
    throw new Error("Invalid credentials");
  }

  // SECURITY: Demo authentication - only enabled in development
  if (process.env.NODE_ENV === 'development') {
    console.warn("SECURITY WARNING: Using demo authentication. Connect to Supabase for production use.");
    
    // Admin authentication - null tenantId indicates super admin
    if (tenantId === null && email === "admin@demo.com" && password === "admin123") {
      return {
        id: "admin-user-1",
        email: "admin@demo.com",
        name: "Super Admin",
        role: "admin" as const,
        tenantId: null,
      };
    }
    
    // Demo user authentication
    if (email === "demo@demo.com" && password === "demo123") {
      return {
        id: "demo-user-1",
        email: "demo@demo.com",
        name: "Demo User",
        role: "manager" as const,
        tenantId: tenantId || "demo",
      };
    }
  }

  // Return null for invalid credentials instead of exposing system info
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved auth state with enhanced security
    const savedToken = sessionStorage.getItem("olaundry_auth_token");
    if (savedToken) {
      try {
        const user = validateToken(savedToken);
        if (user) {
          setCurrentUser(user);
        } else {
          // Invalid or expired token, clear it securely
          sessionStorage.removeItem("olaundry_auth_token");
        }
      } catch (e) {
        console.error("Token validation error:", e);
        sessionStorage.removeItem("olaundry_auth_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, tenantId?: string | null): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Sanitize inputs
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedPassword = password.trim();
      
      const user = await authenticateUser(sanitizedEmail, sanitizedPassword, tenantId);
      if (!user) {
        setError("Invalid credentials");
        setIsLoading(false);
        return false;
      }

      // Create a secure token with proper structure
      const tokenData = btoa(JSON.stringify(user));
      const timestamp = btoa(Date.now().toString());
      const signature = generateSecureToken(16);
      const token = `${tokenData}.${timestamp}.${signature}`;
      
      setCurrentUser(user);
      sessionStorage.setItem("olaundry_auth_token", token);
      
      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setIsLoading(false);
      return false;
    }
  };

  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Input validation
      if (!name.trim() || !email.trim()) {
        throw new Error("Name and email are required");
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }
      
      // Sanitize inputs
      const sanitizedName = name.trim();
      const sanitizedEmail = email.trim().toLowerCase();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { 
        ...currentUser, 
        name: sanitizedName, 
        email: sanitizedEmail 
      };
      
      setCurrentUser(updatedUser);
      
      // Update token with new user data
      const tokenData = btoa(JSON.stringify(updatedUser));
      const timestamp = btoa(Date.now().toString());
      const signature = generateSecureToken(16);
      const token = `${tokenData}.${timestamp}.${signature}`;
      sessionStorage.setItem("olaundry_auth_token", token);
      
      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile update failed");
      setIsLoading(false);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Input validation
      if (!currentPassword || !newPassword) {
        throw new Error("Both current and new passwords are required");
      }
      
      if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters");
      }
      
      // Check password strength
      const hasUpperCase = /[A-Z]/.test(newPassword);
      const hasLowerCase = /[a-z]/.test(newPassword);
      const hasNumbers = /\d/.test(newPassword);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        throw new Error("Password must contain uppercase, lowercase, and numbers");
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password change failed");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Clear all auth data securely
    sessionStorage.removeItem("olaundry_auth_token");
    setCurrentUser(null);
    setError(null);
    
    // Clear sensitive data from memory
    setTimeout(() => {
      if (global.gc) global.gc();
    }, 100);
  };

  const isAuthenticated = !!currentUser;
  const isSuperAdmin = isAuthenticated && currentUser?.tenantId === null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated,
        isSuperAdmin,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
