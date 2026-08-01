'use client';

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Briefcase,
  Scale,
  Receipt,
  ScrollText,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { PageSpinner } from '@/components/ui/Spinner';

const LINKS = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/verifications', label: 'Verifications', icon: ShieldCheck },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/disputes', label: 'Disputes', icon: Scale },
  { href: '/admin/transactions', label: 'Transactions', icon: Receipt },
  { href: '/admin/audit-log', label: 'Audit log', icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isReady } = useRequireAuth(['admin']);
  if (!isReady) return <PageSpinner />;
  return <DashboardShell links={LINKS}>{children}</DashboardShell>;
}
