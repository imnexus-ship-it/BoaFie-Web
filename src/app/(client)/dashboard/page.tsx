'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Wallet,
  CheckCircle2,
  CircleDollarSign,
  ShieldCheck,
  Search,
  Plus,
  UserSearch,
  MapPin,
  ArrowRight,
  Gift,
  MessageSquare,
  Bookmark,
  LifeBuoy,
} from 'lucide-react';
import { StatsGrid } from '@/components/admin/StatsGrid';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDashboard, useMe } from '@/lib/api/hooks/useDashboard';
import { useContracts } from '@/lib/api/hooks/useContracts';
import { useWallet } from '@/lib/api/hooks/useWallet';
import { useArtisans } from '@/lib/api/hooks/useArtisans';
import { useNotifications } from '@/lib/api/hooks/useNotifications';
import { useConversations } from '@/lib/api/hooks/useMessaging';
import { useSavedProfessionals } from '@/lib/api/hooks/useSavedProfessionals';
import { useAuthStore } from '@/lib/store/auth-store';
import { formatCurrency } from '@/lib/utils/currency';
import { timeAgo } from '@/lib/utils/date';
import { Contract } from '@/lib/api/types';

const STATUS_BADGE: Record<string, { variant: 'green' | 'gold' | 'danger' | 'muted'; label: string }> = {
  in_progress: { variant: 'gold', label: 'In Progress' },
  completed: { variant: 'green', label: 'Completed' },
  disputed: { variant: 'danger', label: 'Disputed' },
  cancelled: { variant: 'muted', label: 'Cancelled' },
};

function otherParty(contract: Contract) {
  return contract.worker;
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const me = useMe();
  const { data, isLoading, isError, error, refetch } = useDashboard();
  const contracts = useContracts();
  const wallet = useWallet();
  const professionals = useArtisans({ limit: 4 });
  const notifications = useNotifications();
  const conversations = useConversations();
  const savedProfessionals = useSavedProfessionals();

  const [service, setService] = useState('');
  const [location, setLocation] = useState('Accra, Ghana');

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <ErrorState message={error?.message} onRetry={() => refetch()} />;
  if (contracts.isError) {
    return <ErrorState message={contracts.error?.message} onRetry={() => contracts.refetch()} />;
  }

  const allContracts = contracts.data?.data ?? [];
  const activeProjects = allContracts.filter((c) => c.status === 'in_progress');
  const completedProjects = allContracts.filter((c) => c.status === 'completed');
  const totalInEscrow = activeProjects.reduce((sum, c) => sum + Number(c.agreed_amount), 0);
  const totalSpent = completedProjects.reduce((sum, c) => sum + Number(c.agreed_amount), 0);

  const recentActivity = notifications.data?.data.slice(0, 5) ?? [];
  const firstName = authUser?.full_name?.split(' ')[0];

  return (
    <div className="mx-auto flex max-w-7xl gap-6">
      <div className="min-w-0 flex-1 space-y-6">
        {/* Hero — hiring action hub, not a search page */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-navy to-navy/80 p-8 text-white">
          <div className="relative z-10 max-w-lg">
            <h1 className="font-head text-3xl font-bold leading-tight">
              Welcome back{firstName ? `, ${firstName}` : ''}.
              <br />
              <span className="text-gold-2">What do you need done?</span>
            </h1>
            <p className="mt-3 text-sm text-white/80">Post a job or browse verified professionals ready to start.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/post-job">
                <Button size="lg" className="!bg-gold hover:!bg-gold-2">
                  <Plus className="h-4 w-4" /> Post a Job
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
                  <UserSearch className="h-4 w-4" /> Browse Professionals
                </Button>
              </Link>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const params = new URLSearchParams();
                if (service.trim()) params.set('category', service.trim().toLowerCase());
                if (location.trim()) params.set('location', location.trim());
                router.push(`/explore?${params.toString()}`);
              }}
              className="mt-5 flex flex-col gap-2 rounded-lg bg-white/10 p-2 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-white/60" />
                <input
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="Or quick-search, e.g. Plumbing…"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
                />
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-lg border-t border-white/10 px-3 py-2 sm:border-l sm:border-t-0">
                <MapPin className="h-4 w-4 shrink-0 text-white/60" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
                />
              </div>
              <Button type="submit" variant="secondary" className="shrink-0 !bg-white !text-navy">
                Search <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Stats — action/risk framed for a hirer, not passive counts. Pending
            actions leads since it's the thing most likely to need this
            client's attention right now (real submitted-milestone count, not
            just a proxy for "has an active project"). */}
        <StatsGrid
          stats={[
            {
              label: 'Pending Actions',
              value: data.pending_actions ?? 0,
              icon: Briefcase,
              iconBg: 'bg-gold-3',
              iconColor: 'text-gold',
              href: '/contracts',
            },
            {
              label: 'Active Projects',
              value: activeProjects.length,
              icon: Briefcase,
              iconBg: 'bg-green-3',
              iconColor: 'text-success',
              href: '/contracts',
            },
            {
              label: 'Held in Escrow',
              value: formatCurrency(totalInEscrow),
              icon: CircleDollarSign,
              iconBg: 'bg-gold-3',
              iconColor: 'text-gold',
              href: '/payments',
            },
            {
              label: 'Completed',
              value: completedProjects.length,
              icon: CheckCircle2,
              iconBg: 'bg-green-3',
              iconColor: 'text-success',
              href: '/contracts',
            },
          ]}
        />

        {/* Your hires */}
        <div className="rounded-lg border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-head text-base font-semibold text-charcoal">Your Hires</h2>
            <Link href="/contracts" className="text-sm font-medium text-green hover:underline">
              View all
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={Briefcase}
                title="No active hires yet"
                description="Post a job or browse professionals to get started."
                action={
                  <Link href="/post-job">
                    <Button>Post a job</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activeProjects.slice(0, 5).map((c) => {
                const badge = STATUS_BADGE[c.status] ?? { variant: 'muted' as const, label: c.status };
                const worker = otherParty(c);
                return (
                  <Link
                    key={c.id}
                    href={`/contracts/${c.id}`}
                    className="flex items-center gap-4 p-5 transition-colors hover:bg-cream"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-3">
                      <Briefcase className="h-5 w-5 text-gold" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-head text-sm font-semibold text-charcoal">{c.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{worker?.full_name ?? 'Unassigned'}</p>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <p className="w-24 shrink-0 text-right font-head text-sm font-semibold text-charcoal">
                      {formatCurrency(c.agreed_amount)}
                    </p>
                    <Avatar src={worker?.avatar_url} name={worker?.full_name} size={36} />
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3 border-t border-border bg-gold-3/60 p-5">
            <ShieldCheck className="h-8 w-8 shrink-0 text-gold" />
            <div className="min-w-0 flex-1">
              <p className="font-head text-sm font-semibold text-charcoal">Your money stays protected</p>
              <p className="text-xs text-muted">Funds are held in escrow and only released once you approve the work.</p>
            </div>
            <Link href="/payments" className="shrink-0 text-sm font-medium text-green hover:underline">
              Learn more →
            </Link>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="hidden w-80 shrink-0 space-y-6 xl:block">
        <div className="rounded-lg bg-gradient-to-br from-navy to-navy/80 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-medium text-white/80">
              <Gift className="h-3.5 w-3.5" /> Wallet & Refunds
            </span>
            <Link href="/payments" className="text-xs font-medium text-gold-2 hover:underline">
              View all
            </Link>
          </div>
          <p className="mt-1 text-xs text-white/60">Available Balance</p>
          <p className="mt-1 font-head text-2xl font-bold">
            {wallet.isError ? (
              <span className="text-base font-normal text-white/60">Couldn't load balance</span>
            ) : wallet.data ? (
              formatCurrency(wallet.data.balance_ghs, wallet.data.currency)
            ) : (
              '—'
            )}
          </p>
          <Link href="/payments" className="mt-4 block">
            <Button variant="secondary" className="w-full !bg-white !text-navy">
              View Payments
            </Button>
          </Link>
        </div>

        {/* Actionable panels come before the passive analytics card below. */}
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-charcoal">
              <MessageSquare className="h-4 w-4 text-muted" /> Messages
            </p>
            <Link href="/messages" className="text-xs font-medium text-green hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {conversations.isError ? (
              <p className="text-xs text-muted">Couldn't load messages.</p>
            ) : (conversations.data ?? []).length === 0 && !conversations.isLoading ? (
              <p className="text-xs text-muted">No conversations yet.</p>
            ) : (
              (conversations.data ?? []).slice(0, 4).map((c) => (
                <Link key={c.id} href={`/messages/${c.id}`} className="flex items-center gap-3">
                  <Avatar src={c.other_participant?.avatar_url} name={c.other_participant?.full_name} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-charcoal">{c.other_participant?.full_name ?? 'BoaFie user'}</p>
                    <p className="truncate text-xs text-muted">{c.last_message?.content ?? 'No messages yet'}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-charcoal">
              <Bookmark className="h-4 w-4 text-muted" /> Saved Professionals
            </p>
            <Link href="/explore" className="text-xs font-medium text-green hover:underline">
              Find more
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {savedProfessionals.isError ? (
              <p className="text-xs text-muted">Couldn't load saved professionals.</p>
            ) : (savedProfessionals.data ?? []).length === 0 && !savedProfessionals.isLoading ? (
              <p className="text-xs text-muted">
                Save a professional's profile to find them here later.
              </p>
            ) : (
              (savedProfessionals.data ?? []).slice(0, 4).map((p) => (
                <Link key={p.id} href={`/explore/${p.profile_id ?? p.worker_user_id}`} className="flex items-center gap-3">
                  <Avatar src={p.avatar_url} name={p.full_name} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-charcoal">{p.full_name}</p>
                    <p className="truncate text-xs capitalize text-muted">{p.heading ?? p.role}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-charcoal">Recommended Professionals</p>
            <Link href="/explore" className="text-xs font-medium text-green hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {professionals.isError ? (
              <p className="text-xs text-muted">Couldn't load professionals.</p>
            ) : (professionals.data?.data ?? []).length === 0 && !professionals.isLoading ? (
              <p className="text-xs text-muted">No professionals to show yet.</p>
            ) : (
              (professionals.data?.data ?? []).map((p) => (
                <Link key={p.id} href={`/explore/${p.id}`} className="flex items-center gap-3">
                  <Avatar src={p.users?.avatar_url} name={p.users?.full_name} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-charcoal">{p.users?.full_name ?? 'BoaFie professional'}</p>
                    <p className="truncate text-xs capitalize text-muted">
                      {p.trade_category} · {p.total_jobs_done} jobs done
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-charcoal">Recent Activity</p>
            <Link href="/settings" className="text-xs font-medium text-green hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-4">
            {notifications.isError ? (
              <p className="text-xs text-muted">Couldn't load recent activity.</p>
            ) : recentActivity.length === 0 ? (
              <p className="text-xs text-muted">Nothing to show yet.</p>
            ) : (
              recentActivity.map((n) => (
                <div key={n.id} className="flex items-start gap-2">
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.is_read ? 'bg-border' : 'bg-gold'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-charcoal">{n.title}</p>
                    <p className="text-[11px] text-muted">{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Secondary analytics — deliberately placed after every actionable panel above. */}
        <div className="rounded-lg border border-border bg-white p-5">
          <p className="text-sm font-semibold text-charcoal">Account Summary</p>
          <p className="mt-1 text-xs text-muted">
            {firstName}
            {me.data?.created_at &&
              `, member since ${new Date(me.data.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <div>
              <p className="font-head text-lg font-bold text-charcoal">{data.active_jobs ?? 0}</p>
              <p className="text-[11px] text-muted">Jobs Posted</p>
            </div>
            <div>
              <p className="font-head text-lg font-bold text-charcoal">{completedProjects.length}</p>
              <p className="text-[11px] text-muted">Completed</p>
            </div>
            <div>
              <p className="font-head text-lg font-bold text-charcoal">{activeProjects.length}</p>
              <p className="text-[11px] text-muted">In Progress</p>
            </div>
            <div>
              <p className="font-head text-lg font-bold text-charcoal">{formatCurrency(totalSpent)}</p>
              <p className="text-[11px] text-muted">Total Invested</p>
            </div>
          </div>
        </div>

        <Link
          href="/contact"
          className="flex items-center gap-3 rounded-lg border border-border bg-white p-4 text-sm font-medium text-charcoal hover:border-green hover:text-green"
        >
          <LifeBuoy className="h-4 w-4 shrink-0" /> Need help? Contact support
        </Link>
      </div>
    </div>
  );
}
