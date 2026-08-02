'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth-store';
import { dashboardPathForRole } from '../utils/routing';

/**
 * Client-side guard for the login/signup pages: a user with an active
 * session has no reason to see those forms, so bounce them to their
 * dashboard instead. Mirrors useRequireAuth's hydration handling so it
 * doesn't fire a false redirect before the persisted session loads.
 */
export function useRedirectIfAuthed() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated || !user) return;
    router.replace(dashboardPathForRole(user.role));
  }, [hasHydrated, user, router]);

  return { checking: !hasHydrated || !!user };
}
