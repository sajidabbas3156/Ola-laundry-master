import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => Boolean(get().token && get().user),
    }),
    {
      name: 'laundry-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Demo login for development
export const demoLogin = () => {
  const demoUser: User = {
    id: 1,
    email: 'admin@laundrypro.bh',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  };
  
  const demoToken = 'demo-token-123';
  useAuth.getState().setAuth(demoUser, demoToken);
};