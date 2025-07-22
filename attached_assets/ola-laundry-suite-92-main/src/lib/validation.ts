
import { z } from "zod";

// Enhanced validation schemas with better security
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format")
  .max(255, "Email too long")
  .refine((email) => {
    // Additional email security checks
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /data:/i,
      /vbscript:/i,
      /%3c/i, // URL encoded <
      /%3e/i, // URL encoded >
      /\0/, // Null byte
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(email));
  }, "Invalid email format");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .refine((password) => {
    // Check for common weak passwords
    const weakPasswords = [
      "password", "12345678", "qwerty123", "admin123",
      "password123", "123456789", "abcdefgh", "letmein",
      "welcome123", "monkey123", "dragon123"
    ];
    return !weakPasswords.includes(password.toLowerCase());
  }, "Password is too common")
  .refine((password) => {
    // Check for common patterns
    const commonPatterns = [
      /(.)\1{3,}/, // 4 or more repeated characters
      /1234|2345|3456|4567|5678|6789|7890/, // Sequential numbers
      /abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz/i, // Sequential letters
    ];
    return !commonPatterns.some(pattern => pattern.test(password));
  }, "Password contains common patterns");

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name too long")
  .regex(/^[a-zA-Z\s\u00C0-\u017F'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
  .refine((name) => {
    // Additional security checks for names
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /%3c/i, // URL encoded <
      /%3e/i, // URL encoded >
      /\0/, // Null byte
      /[<>]/, // HTML tags
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(name));
  }, "Invalid characters in name");

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number format")
  .refine((phone) => {
    // Remove formatting and check length
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  }, "Phone number must contain 10-15 digits");

export const subdomainSchema = z
  .string()
  .min(3, "Subdomain must be at least 3 characters")
  .max(63, "Subdomain too long")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Subdomain can only contain lowercase letters, numbers, and hyphens")
  .refine((subdomain) => {
    // Prevent reserved subdomains
    const reserved = [
      "admin", "api", "www", "mail", "ftp", "localhost", "root",
      "support", "help", "blog", "forum", "shop", "store", "app",
      "dashboard", "secure", "ssl", "vpn", "cdn", "static", "assets"
    ];
    return !reserved.includes(subdomain.toLowerCase());
  }, "This subdomain is reserved");

// Enhanced login form validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").max(128, "Password too long"),
});

// Registration form validation
export const registerSchema = z.object({
  businessName: z.string().min(1, "Business name is required").max(100, "Business name too long"),
  subdomain: subdomainSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile update validation
export const profileUpdateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});

// Password change validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Customer form validation
export const customerSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal("")),
});

// Order form validation
export const orderSchema = z.object({
  customerName: nameSchema,
  customerPhone: phoneSchema,
  customerEmail: emailSchema.optional().or(z.literal("")),
  pickupDate: z.string().min(1, "Pickup date is required"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  deliveryPreference: z.enum(["pickup", "delivery"]),
  notes: z.string().max(500, "Notes too long").optional(),
});

// Enhanced input sanitization utilities
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/\\/g, "&#x5C;")
    .replace(/\0/g, ""); // Remove null bytes
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/%3c/gi, '')
    .replace(/%3e/gi, '')
    .replace(/\0/g, ''); // Remove null bytes
};

// Enhanced CSRF token utilities
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  if (!token || !storedToken || token.length !== storedToken.length) {
    return false;
  }
  
  // Constant-time comparison to prevent timing attacks
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  return result === 0;
};

// Enhanced rate limiting with IP tracking and progressive delays
const rateLimitStore = new Map<string, { 
  count: number; 
  resetTime: number; 
  blocked?: boolean;
  violations: number;
}>();

export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { 
      count: 1, 
      resetTime: now + windowMs,
      violations: record?.violations || 0
    });
    return true;
  }
  
  if (record.blocked) {
    return false;
  }
  
  if (record.count >= limit) {
    // Progressive blocking: longer blocks for repeat violations
    const blockMultiplier = Math.min(record.violations + 1, 5);
    record.blocked = true;
    record.resetTime = now + (windowMs * blockMultiplier);
    record.violations = (record.violations || 0) + 1;
    
    // Log security event
    console.warn(`Rate limit exceeded for key: ${key}, violations: ${record.violations}`);
    return false;
  }
  
  record.count++;
  return true;
};

// Clear blocked status and old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.blocked && now > record.resetTime) {
      // Remove old entries completely after extended period
      if (record.violations > 3 && now > record.resetTime + (24 * 60 * 60 * 1000)) {
        rateLimitStore.delete(key);
      } else {
        record.blocked = false;
        record.count = 0;
        record.resetTime = now + 15 * 60 * 1000; // Reset window
      }
    }
  }
}, 60000); // Clean up every minute

// Data validation for sensitive operations
export const validateSensitiveData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  // Check for potential code injection in object values
  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+=/i,
        /eval\(/i,
        /Function\(/i,
        /setTimeout\(/i,
        /setInterval\(/i,
      ];
      return !suspiciousPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).every(checkValue);
    }
    return true;
  };
  
  return Object.values(data).every(checkValue);
};
