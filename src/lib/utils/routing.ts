import { UserRole } from '../api/types';

/** Where to land a user right after login/signup, based on their role. */
export function dashboardPathForRole(role: UserRole): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'client') return '/dashboard';
  return '/worker/dashboard'; // artisan | freelancer
}
