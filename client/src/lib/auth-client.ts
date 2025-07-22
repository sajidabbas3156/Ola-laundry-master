// Client-side authentication utilities for the SaaS platform

export function getAuthToken(): string | null {
  // For demo purposes, return a demo token
  // In production, this would get the token from localStorage or secure storage
  return localStorage.getItem('auth_token') || 'demo-token-123';
}

export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Demo login function for development
export async function demoLogin(role: string = 'org_owner'): Promise<void> {
  // This is a demo implementation
  // In production, this would call the actual login API
  setAuthToken('demo-token-123');
  window.location.reload();
}

export async function logout(): Promise<void> {
  removeAuthToken();
  window.location.href = '/';
}