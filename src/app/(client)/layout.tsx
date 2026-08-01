'use client';

import { LayoutDashboard, PlusCircle, Briefcase, FileText, Wallet, MessageSquare, Settings } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { PageSpinner } from '@/components/ui/Spinner';

const LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/post-job', label: 'Post a job', icon: PlusCircle },
  { href: '/my-jobs', label: 'My jobs', icon: Briefcase },
  { href: '/contracts', label: 'Contracts', icon: FileText },
  { href: '/payments', label: 'Payments', icon: Wallet },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isReady } = useRequireAuth(['client']);
  if (!isReady) return <PageSpinner />;
  return <DashboardShell links={LINKS}>{children}</DashboardShell>;
}
