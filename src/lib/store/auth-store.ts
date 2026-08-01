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
  hasHydrated: boolean;
  setSession: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

/**
 * Persisted (localStorage) client-side auth store. The Nest API is stateless
 * JWT — this just remembers the token/user between page loads so the API
 * client (lib/api/client.ts) can attach `Authorization: Bearer <token>`.
 *
 * `hasHydrated` exists because zustand's persist middleware restores
 * localStorage asynchronously: on a hard page load, components mount with
 * the pre-hydration state (user: null) for one tick before the persisted
 * session loads. useRequireAuth waits on this flag so it doesn't redirect
 * a logged-in user to /login just because hydration hasn't finished yet.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,
      setSession: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'boafie-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
