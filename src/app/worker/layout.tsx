'use client';

import {
  LayoutDashboard,
  Search,
  Send,
  FileText,
  Wallet,
  ShieldCheck,
  MessageSquare,
  Settings,
  Image as ImageIcon,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { SidebarHelpCard } from '@/components/layout/SidebarHelpCard';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { PageSpinner } from '@/components/ui/Spinner';

const LINKS = [
  { href: '/worker/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/worker/find-jobs', label: 'Find jobs', icon: Search },
  { href: '/worker/proposals', label: 'My proposals', icon: Send },
  { href: '/worker/contracts', label: 'Contracts', icon: FileText },
  { href: '/worker/portfolio', label: 'Portfolio', icon: ImageIcon },
  { href: '/worker/earnings', label: 'Earnings', icon: Wallet },
  { href: '/worker/verification', label: 'Verification', icon: ShieldCheck },
  { href: '/worker/messages', label: 'Messages', icon: MessageSquare },
  { href: '/worker/settings', label: 'Settings', icon: Settings },
];

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const { isReady } = useRequireAuth(['artisan', 'freelancer']);
  if (!isReady) return <PageSpinner />;
  return (
    <DashboardShell links={LINKS} messagesHref="/worker/messages" sidebarBottomSlot={<SidebarHelpCard />}>
      {children}
    </DashboardShell>
  );
}
