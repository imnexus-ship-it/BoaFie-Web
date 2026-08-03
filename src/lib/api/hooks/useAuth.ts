'use client';

import { useMutation } from '@tanstack/react-query';
import { api, ApiError } from '../client';
import { useAuthStore, AuthUser } from '../../store/auth-store';

interface AuthResponse {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

/**
 * Legacy flag the worker dashboard still reads (and clears) to prompt
 * phone verification right after signup — see
 * components/verification/PhoneVerification.tsx. No longer set here: the
 * multi-step signup wizard now verifies phone and email inline (see
 * components/auth/signup/VerifyContactStep.tsx) before the user ever
 * reaches the dashboard, so setting it again here would just produce a
 * redundant "verify your phone" nudge for something already done. Kept
 * exported since the dashboard still imports it for its read/clear guard.
 */
export const JUST_SIGNED_UP_KEY = 'boafie-just-signed-up';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation<AuthResponse, ApiError, { email: string; password: string }>({
    mutationFn: (body) => api.post<AuthResponse>('/auth/login', body, { auth: false }),
    onSuccess: (data) => setSession(data.user, data.access_token, data.refresh_token),
  });
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  role: 'client' | 'artisan' | 'freelancer';
  phone?: string;
  country_of_residence?: string;
  region?: string;
  city?: string;
  date_of_birth?: string;
  gender?: string;
  referral_code?: string;
  preferred_contact_method?: string;
  marketing_opt_in?: boolean;
  accepted_terms: true;
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation<AuthResponse, ApiError, RegisterInput>({
    mutationFn: (body) => api.post<AuthResponse>('/auth/register', body, { auth: false }),
    onSuccess: (data) => setSession(data.user, data.access_token, data.refresh_token),
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  return () => {
    clearSession();
    api.post('/auth/logout', undefined, { auth: false }).catch(() => undefined);
  };
}

export function useGoogleLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation<AuthResponse, ApiError, { id_token: string; role?: 'client' | 'artisan' | 'freelancer' }>({
    mutationFn: (body) => api.post<AuthResponse>('/auth/google', body, { auth: false }),
    onSuccess: (data) => setSession(data.user, data.access_token, data.refresh_token),
  });
}

/** Completes the Yahoo redirect flow: trades the one-time handoff code (from the callback URL) for real tokens. */
export function useExchangeHandoff() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation<AuthResponse, ApiError, { handoff: string }>({
    mutationFn: (body) => api.post<AuthResponse>('/auth/exchange', body, { auth: false }),
    onSuccess: (data) => setSession(data.user, data.access_token, data.refresh_token),
  });
}
