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
 *
 * `enabled` (default true) lets the multi-step signup wizard turn this off
 * once it's past the first step — registration happens mid-wizard there,
 * so `user` goes non-null while later steps (contact verification,
 * professional info) still need to render instead of bouncing to the
 * dashboard the instant the account is created.
 */
export function useRedirectIfAuthed(enabled = true) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!enabled || !hasHydrated || !user) return;
    router.replace(dashboardPathForRole(user.role));
  }, [enabled, hasHydrated, user, router]);

  return { checking: enabled && (!hasHydrated || !!user) };
}
