'use client';

import { useMutation } from '@tanstack/react-query';
import { api, ApiError } from '../client';
import { useAuthStore, AuthUser } from '../../store/auth-store';

interface AuthResponse {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation<AuthResponse, ApiError, { email: string; password: string }>({
    mutationFn: (body) => api.post<AuthResponse>('/auth/login', body, { auth: false }),
    onSuccess: (data) => setSession(data.user, data.access_token, data.refresh_token),
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation<
    AuthResponse,
    ApiError,
    { email: string; password: string; full_name: string; role: 'client' | 'artisan' | 'freelancer'; phone?: string }
  >({
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
