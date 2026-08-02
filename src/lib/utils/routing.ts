import { UserRole } from '../api/types';

/** Where to land a user right after login/signup, based on their role. */
export function dashboardPathForRole(role: UserRole): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'client') return '/dashboard';
  return '/worker/dashboard'; // artisan | freelancer
}

/** Where a role's self-service profile/settings page lives. Admins have no such page yet. */
export function settingsPathForRole(role: UserRole): string | null {
  if (role === 'client') return '/settings';
  if (role === 'artisan' || role === 'freelancer') return '/worker/settings';
  return null; // admin
}
