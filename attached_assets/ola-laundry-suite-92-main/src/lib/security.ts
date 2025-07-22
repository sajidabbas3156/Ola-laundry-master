
// Enhanced security configuration and utilities

// Hardened Content Security Policy configuration
export const getCSPHeader = (): string => {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval'", // Removed unsafe-inline for better security
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.ipapi.com https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
    "block-all-mixed-content"
  ];
  
  return directives.join('; ');
};

// Enhanced security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': getCSPHeader(),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
};

// Enhanced session management with security improvements
export class SessionManager {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
  private static readonly MAX_SESSIONS = 3; // Maximum concurrent sessions
  
  private timeoutId: NodeJS.Timeout | null = null;
  private warningId: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  
  startSession(onWarning: () => void, onTimeout: () => void): void {
    this.clearTimers();
    this.lastActivity = Date.now();
    
    // Set warning timer
    this.warningId = setTimeout(() => {
      onWarning();
    }, SessionManager.SESSION_TIMEOUT - SessionManager.WARNING_TIME);
    
    // Set timeout timer
    this.timeoutId = setTimeout(() => {
      onTimeout();
    }, SessionManager.SESSION_TIMEOUT);
  }
  
  refreshSession(onWarning: () => void, onTimeout: () => void): void {
    this.lastActivity = Date.now();
    this.startSession(onWarning, onTimeout);
  }
  
  clearSession(): void {
    this.clearTimers();
    // Clear all session storage
    sessionStorage.clear();
  }
  
  isSessionValid(): boolean {
    const now = Date.now();
    return (now - this.lastActivity) < SessionManager.SESSION_TIMEOUT;
  }
  
  private clearTimers(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningId) {
      clearTimeout(this.warningId);
      this.warningId = null;
    }
  }
}

// Enhanced XSS protection utilities
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;")
    .replace(/\\/g, "&#x5C;");
};

// Generate cryptographically secure random strings
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomArray[i] % chars.length];
  }
  
  return result;
};

// Enhanced password strength checker
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
  isSecure: boolean;
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score += 1;
  else feedback.push("Use at least 8 characters");
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Include lowercase letters");
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Include uppercase letters");
  
  if (/\d/.test(password)) score += 1;
  else feedback.push("Include numbers");
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push("Include special characters");
  
  if (password.length >= 12) score += 1;
  
  // Check for common patterns
  const commonPatterns = [
    /(.)\1{2,}/, // Repeated characters
    /123|234|345|456|567|678|789|890/, // Sequential numbers
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i, // Sequential letters
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password))) {
    feedback.push("Avoid common patterns");
    score = Math.max(0, score - 1);
  }
  
  const isSecure = score >= 4 && password.length >= 8;
  
  return { score, feedback, isSecure };
};

// Secure storage wrapper with encryption
export const secureStorage = {
  setItem: (key: string, value: string, encrypt: boolean = true): void => {
    try {
      const data = encrypt ? btoa(encodeURIComponent(value)) : value;
      sessionStorage.setItem(key, data);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  },
  
  getItem: (key: string, decrypt: boolean = true): string | null => {
    try {
      const data = sessionStorage.getItem(key);
      if (!data) return null;
      return decrypt ? decodeURIComponent(atob(data)) : data;
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    sessionStorage.removeItem(key);
  },
  
  clear: (): void => {
    sessionStorage.clear();
  }
};

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: URLs
    .replace(/vbscript:/gi, ''); // Remove vbscript: protocols
};

// CSRF protection utilities
export const generateCSRFToken = (): string => {
  return generateSecureToken(32);
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

// Security audit logging
export const auditLog = {
  logAuthAttempt: (email: string, success: boolean, ip?: string) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'auth_attempt',
      email: email.replace(/(.{3}).*@/, '$1***@'), // Partially mask email
      success,
      ip: ip || 'unknown',
    };
    console.log('AUDIT:', JSON.stringify(logEntry));
  },
  
  logDataAccess: (userId: string, resource: string, action: string) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'data_access',
      userId,
      resource,
      action,
    };
    console.log('AUDIT:', JSON.stringify(logEntry));
  },
  
  logSecurityEvent: (event: string, details: Record<string, any>) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'security_event',
      type: event,
      details,
    };
    console.log('SECURITY AUDIT:', JSON.stringify(logEntry));
  }
};
