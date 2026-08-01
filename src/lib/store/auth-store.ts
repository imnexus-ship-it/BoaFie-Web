'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: 'client' | 'artisan' | 'freelancer' | 'admin';
  avatar_url?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
}

/**
 * Persisted (localStorage) client-side auth store. The Nest API is stateless
 * JWT — this just remembers the token/user between page loads so the API
 * client (lib/api/client.ts) can attach `Authorization: Bearer <token>`.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: 'boafie-auth' },
  ),
);
