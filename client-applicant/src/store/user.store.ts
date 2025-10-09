import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      email: null,
      isAuthenticated: false,
      login: (email: string) => set({ email, isAuthenticated: true }),
      logout: () => set({ email: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
);