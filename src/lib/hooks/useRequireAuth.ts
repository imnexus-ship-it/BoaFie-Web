'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth-store';

/**
 * Client-side guard for dashboard route groups. The API itself is the real
 * authorization boundary (every protected endpoint 401s/403s without a valid
 * token/role) — this hook just gives a fast redirect + no flash-of-wrong-UI
 * in the browser before that response comes back.
 */
export function useRequireAuth(allowedRoles?: Array<'client' | 'artisan' | 'freelancer' | 'admin'>) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return; // persisted session hasn't loaded yet — don't redirect prematurely
    if (!accessToken || !user) {
      router.replace('/login');
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, accessToken, user]);

  return { user, isReady: hasHydrated && !!accessToken && !!user };
}
