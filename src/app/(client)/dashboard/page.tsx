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
  MapPin,
  ArrowRight,
  Star,
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

  const [service, setService] = useState('');
  const [location, setLocation] = useState('Accra, Ghana');

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  const allContracts = contracts.data?.data ?? [];
  const activeProjects = allContracts.filter((c) => c.status === 'in_progress');
  const completedProjects = allContracts.filter((c) => c.status === 'completed');
  const totalInEscrow = activeProjects.reduce((sum, c) => sum + Number(c.agreed_amount), 0);
  const totalSpent = completedProjects.reduce((sum, c) => sum + Number(c.agreed_amount), 0);

  const recentActivity = notifications.data?.data.slice(0, 5) ?? [];

  return (
    <div className="mx-auto flex max-w-7xl gap-6">
      <div className="min-w-0 flex-1 space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-navy to-green p-8 text-white">
          <div className="relative z-10 max-w-lg">
            <h1 className="font-head text-3xl font-bold leading-tight">
              Find trusted professionals.
              <br />
              <span className="text-gold-2">Get work done right.</span>
            </h1>
            <p className="mt-3 text-sm text-white/80">Verified experts. Secure payments. Quality work. Real results.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const params = new URLSearchParams();
                if (service.trim()) params.set('category', service.trim().toLowerCase());
                if (location.trim()) params.set('location', location.trim());
                router.push(`/explore?${params.toString()}`);
              }}
              className="mt-6 flex flex-col gap-2 rounded-lg bg-white p-2 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-muted" />
                <input
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="e.g. Plumbing, Electrical…"
                  className="w-full text-sm text-charcoal placeholder:text-muted focus:outline-none"
                />
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-lg border-t border-border px-3 py-2 sm:border-l sm:border-t-0">
                <MapPin className="h-4 w-4 shrink-0 text-muted" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-sm text-charcoal placeholder:text-muted focus:outline-none"
                />
              </div>
              <Button type="submit" className="shrink-0">
                Search Now <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <div className="pointer-events-none absolute -right-6 top-1/2 hidden h-48 w-48 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/10 font-head text-8xl font-bold text-white/10 sm:flex">
            B
          </div>
        </div>

        {/* Stats */}
        <StatsGrid
          stats={[
            {
              label: 'Active Projects',
              value: activeProjects.length,
              icon: Briefcase,
              iconBg: 'bg-green-3',
              iconColor: 'text-green',
              href: '/contracts',
            },
            {
              label: 'In Escrow',
              value: formatCurrency(totalInEscrow),
              icon: CircleDollarSign,
              iconBg: 'bg-gold-3',
              iconColor: 'text-gold',
              href: '/payments',
            },
            {
              label: 'Completed Jobs',
              value: completedProjects.length,
              icon: CheckCircle2,
              iconBg: 'bg-green-3',
              iconColor: 'text-success',
              href: '/contracts',
            },
            {
              label: 'Total Spent',
              value: formatCurrency(totalSpent),
              icon: Wallet,
              iconBg: 'bg-navy/10',
              iconColor: 'text-navy',
              href: '/payments',
            },
          ]}
        />

        {/* Active Projects */}
        <div className="rounded-lg border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-head text-base font-semibold text-charcoal">Active Projects</h2>
            <Link href="/contracts" className="text-sm font-medium text-green hover:underline">
              View all
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={Briefcase}
                title="No active projects"
                description="Hire a professional to see your active projects here."
                action={
                  <Link href="/explore">
                    <Button>Find professionals</Button>
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-3">
                      <Briefcase className="h-5 w-5 text-green" />
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

          <div className="flex items-center gap-3 border-t border-border bg-green-3/40 p-5">
            <ShieldCheck className="h-8 w-8 shrink-0 text-green" />
            <div className="min-w-0 flex-1">
              <p className="font-head text-sm font-semibold text-charcoal">Your payments are protected with BoaFie Escrow</p>
              <p className="text-xs text-muted">We hold your payment securely and release it only when you're satisfied with the work.</p>
            </div>
            <Link href="/payments" className="shrink-0 text-sm font-medium text-green hover:underline">
              Learn more →
            </Link>
          </div>
        </div>

        {/* Trust bar */}
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-white p-5 sm:grid-cols-4">
          {[
            { icon: ShieldCheck, label: 'Verified Professionals', hint: 'Background checked & verified' },
            { icon: CircleDollarSign, label: 'Secure Payments', hint: 'Escrow protection for every job' },
            { icon: Star, label: 'Quality Guaranteed', hint: 'Satisfaction or your money back' },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-2">
              <t.icon className="h-4 w-4 shrink-0 text-green" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-charcoal">{t.label}</p>
                <p className="truncate text-[11px] text-muted">{t.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="hidden w-80 shrink-0 space-y-6 xl:block">
        <div className="rounded-lg bg-gradient-to-br from-navy to-green p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">My Wallet</span>
            <Link href="/payments" className="text-xs font-medium text-gold-2 hover:underline">
              View all
            </Link>
          </div>
          <p className="mt-1 text-xs text-white/60">Available Balance</p>
          <p className="mt-1 font-head text-2xl font-bold">
            {wallet.data ? formatCurrency(wallet.data.balance_ghs, wallet.data.currency) : '—'}
          </p>
          <Link href="/payments" className="mt-4 block">
            <Button variant="secondary" className="w-full !bg-white !text-navy">
              View Payments
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <p className="text-sm font-semibold text-charcoal">Account Summary</p>
          <p className="mt-1 text-xs text-muted">
            {authUser?.full_name?.split(' ')[0]}
            {me.data?.created_at &&
              `, member since ${new Date(me.data.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
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
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-charcoal">Available Professionals</p>
            <Link href="/explore" className="text-xs font-medium text-green hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {(professionals.data?.data ?? []).length === 0 && !professionals.isLoading ? (
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
            {recentActivity.length === 0 ? (
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
      </div>
    </div>
  );
}
