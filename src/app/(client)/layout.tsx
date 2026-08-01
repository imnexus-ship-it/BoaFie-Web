'use client';

import { LayoutDashboard, Search, Briefcase, FileText, MessageSquare, Wallet, User } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { SidebarHelpCard } from '@/components/layout/SidebarHelpCard';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { PageSpinner } from '@/components/ui/Spinner';

const LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/explore', label: 'Find Professionals', icon: Search },
  { href: '/my-jobs', label: 'My Jobs', icon: Briefcase },
  { href: '/contracts', label: 'My Projects', icon: FileText },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/payments', label: 'Escrow & Payments', icon: Wallet },
  { href: '/settings', label: 'My Profile', icon: User },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isReady } = useRequireAuth(['client']);
  if (!isReady) return <PageSpinner />;
  return (
    <DashboardShell links={LINKS} messagesHref="/messages" sidebarBottomSlot={<SidebarHelpCard />}>
      {children}
    </DashboardShell>
  );
}
