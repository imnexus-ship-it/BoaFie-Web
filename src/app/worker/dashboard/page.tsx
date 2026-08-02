'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Wallet, CheckCircle2, ShieldCheck, Search, MapPin, ArrowRight, Briefcase, Sparkles, X } from 'lucide-react';
import { StatsGrid } from '@/components/admin/StatsGrid';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { PhoneVerification } from '@/components/verification/PhoneVerification';
import { useDashboard } from '@/lib/api/hooks/useDashboard';
import { useContracts } from '@/lib/api/hooks/useContracts';
import { useWallet } from '@/lib/api/hooks/useWallet';
import { useMyProposals } from '@/lib/api/hooks/useProposals';
import { useRecommendedJobs } from '@/lib/api/hooks/useJobs';
import { useVerificationStatus } from '@/lib/api/hooks/useVerification';
import { useNotifications } from '@/lib/api/hooks/useNotifications';
import { formatCurrency, formatBudgetRange } from '@/lib/utils/currency';
import { timeAgo } from '@/lib/utils/date';
import { Contract } from '@/lib/api/types';
import { getPlan, PENDING_PLAN_STORAGE_KEY } from '@/lib/constants/plans';
import { JUST_SIGNED_UP_KEY } from '@/lib/api/hooks/useAuth';

const STATUS_BADGE: Record<string, { variant: 'green' | 'gold' | 'danger' | 'muted'; label: string }> = {
  in_progress: { variant: 'gold', label: 'In Progress' },
  completed: { variant: 'green', label: 'Completed' },
  disputed: { variant: 'danger', label: 'Disputed' },
  cancelled: { variant: 'muted', label: 'Cancelled' },
};

function otherParty(contract: Contract) {
  return contract.client;
}

export default function WorkerDashboardPage() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useDashboard();
  const contracts = useContracts();
  const wallet = useWallet();
  const proposals = useMyProposals();
  const recommended = useRecommendedJobs();
  const verification = useVerificationStatus();
  const notifications = useNotifications();

  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('Accra, Ghana');
  const [pendingPlan, setPendingPlan] = useState<ReturnType<typeof getPlan>>(undefined);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(PENDING_PLAN_STORAGE_KEY);
    if (!raw) return;
    try {
      const { slug } = JSON.parse(raw) as { slug: string };
      setPendingPlan(getPlan(slug));
    } catch {
      localStorage.removeItem(PENDING_PLAN_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(JUST_SIGNED_UP_KEY)) {
      sessionStorage.removeItem(JUST_SIGNED_UP_KEY);
      setShowPhonePrompt(true);
    }
  }, []);

  const dismissPendingPlan = () => {
    localStorage.removeItem(PENDING_PLAN_STORAGE_KEY);
    setPendingPlan(undefined);
  };

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <ErrorState message={error?.message} onRetry={() => refetch()} />;
  if (contracts.isError) {
    return <ErrorState message={contracts.error?.message} onRetry={() => contracts.refetch()} />;
  }

  const allContracts = contracts.data?.data ?? [];
  const activeContracts = allContracts.filter((c) => c.status === 'in_progress');
  const completedContracts = allContracts.filter((c) => c.status === 'completed');
  const pendingProposals = (proposals.data ?? []).filter((p) => p.status === 'pending');
  const recentActivity = notifications.data?.data.slice(0, 5) ?? [];

  const verificationStages = verification.data
    ? [
        verification.data.phone_status,
        verification.data.id_status,
        verification.data.selfie_status,
        verification.data.location_status,
        verification.data.trade_cert_status,
      ]
    : [];
  const verifiedCount = verificationStages.filter((s) => s === 'verified').length;

  return (
    <div className="mx-auto flex max-w-7xl gap-6">
      <div className="min-w-0 flex-1 space-y-6">
        {pendingPlan && (
          <div className="flex items-center gap-3 rounded-lg border border-gold/30 bg-gold-3 p-4">
            <Sparkles className="h-5 w-5 shrink-0 text-gold" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-charcoal">
                You selected <span className="font-semibold">{pendingPlan.name}</span> ({pendingPlan.price}
                {pendingPlan.priceSuffix}) at signup.
              </p>
              <p className="text-xs text-muted">Upgrades aren't live yet — we'll email you as soon as you can switch to it.</p>
            </div>
            <button
              onClick={dismissPendingPlan}
              aria-label="Dismiss"
              className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Hero */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-navy to-green p-8 text-white">
          <div className="relative z-10 max-w-lg">
            <h1 className="font-head text-3xl font-bold leading-tight">
              Find your next job.
              <br />
              <span className="text-gold-2">Get paid securely.</span>
            </h1>
            <p className="mt-3 text-sm text-white/80">Verified clients. Escrow-backed payments. Work that matches your skills.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const params = new URLSearchParams();
                if (category.trim()) params.set('category', category.trim().toLowerCase());
                if (location.trim()) params.set('location', location.trim());
                router.push(`/worker/find-jobs?${params.toString()}`);
              }}
              className="mt-6 flex flex-col gap-2 rounded-lg bg-white p-2 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-muted" />
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Plumbing, Web Development…"
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
                Find Jobs <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <div className="pointer-events-none absolute -right-6 top-1/2 hidden h-48 w-48 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/10 font-head text-8xl font-bold text-white/10 sm:flex">
            B
          </div>
        </div>

        {/* Stats — earning/funnel framed for a worker, not passive counts */}
        <StatsGrid
          stats={[
            {
              label: 'Ready to Withdraw',
              value: wallet.data ? formatCurrency(wallet.data.balance_ghs) : '—',
              icon: Wallet,
              iconBg: 'bg-green-3',
              iconColor: 'text-green',
              href: '/worker/earnings',
            },
            {
              label: 'Awaiting Response',
              value: pendingProposals.length,
              icon: Send,
              iconBg: 'bg-gold-3',
              iconColor: 'text-gold',
              href: '/worker/proposals',
            },
            {
              label: 'Active Contracts',
              value: activeContracts.length,
              icon: Briefcase,
              iconBg: 'bg-green-3',
              iconColor: 'text-green',
              href: '/worker/contracts',
            },
            {
              label: 'Completed Jobs',
              value: completedContracts.length,
              icon: CheckCircle2,
              iconBg: 'bg-navy/10',
              iconColor: 'text-navy',
              href: '/worker/contracts',
            },
          ]}
        />

        {/* Active Contracts */}
        <div className="rounded-lg border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-head text-base font-semibold text-charcoal">Active Contracts</h2>
            <Link href="/worker/contracts" className="text-sm font-medium text-green hover:underline">
              View all
            </Link>
          </div>

          {activeContracts.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={Briefcase}
                title="No active contracts"
                description="Submit proposals on jobs to start working with clients."
                action={
                  <Link href="/worker/find-jobs">
                    <Button>Find jobs</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activeContracts.slice(0, 5).map((c) => {
                const badge = STATUS_BADGE[c.status] ?? { variant: 'muted' as const, label: c.status };
                const client = otherParty(c);
                return (
                  <Link
                    key={c.id}
                    href={`/worker/contracts/${c.id}`}
                    className="flex items-center gap-4 p-5 transition-colors hover:bg-cream"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-3">
                      <Briefcase className="h-5 w-5 text-green" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-head text-sm font-semibold text-charcoal">{c.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{client?.full_name ?? 'Client'}</p>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <p className="w-24 shrink-0 text-right font-head text-sm font-semibold text-charcoal">
                      {formatCurrency(c.agreed_amount)}
                    </p>
                    <Avatar src={client?.avatar_url} name={client?.full_name} size={36} />
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3 border-t border-border bg-green-3/40 p-5">
            <ShieldCheck className="h-8 w-8 shrink-0 text-green" />
            <div className="min-w-0 flex-1">
              <p className="font-head text-sm font-semibold text-charcoal">Get paid securely with BoaFie Escrow</p>
              <p className="text-xs text-muted">
                Clients fund each contract upfront — your payment is released as soon as milestones are approved.
              </p>
            </div>
            <Link href="/worker/earnings" className="shrink-0 text-sm font-medium text-green hover:underline">
              Learn more →
            </Link>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="hidden w-80 shrink-0 space-y-6 xl:block">
        {(() => {
          const incomplete = verification.data && !verification.data.overall_verified;

          const earningsCard = (
            <div key="earnings" className="rounded-lg bg-gradient-to-br from-navy to-green p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/80">My Earnings</span>
                <Link href="/worker/earnings" className="text-xs font-medium text-gold-2 hover:underline">
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
              <p className="mt-2 text-xs text-white/60">
                Lifetime earned: {wallet.data ? formatCurrency(wallet.data.lifetime_earned, wallet.data.currency) : '—'}
              </p>
              <Link href="/worker/earnings" className="mt-4 block">
                <Button variant="secondary" className="w-full !bg-white !text-navy">
                  View Earnings
                </Button>
              </Link>
            </div>
          );

          const verificationCard = (
            <div
              key="verification"
              className={
                incomplete
                  ? 'rounded-lg border-2 border-gold bg-gold-3 p-5'
                  : 'rounded-lg border border-border bg-white p-5'
              }
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-charcoal">Verification Status</p>
                {verification.data?.overall_verified && <Badge variant="green">Verified</Badge>}
              </div>
              {verification.data ? (
                <>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-border">
                    <div
                      className={incomplete ? 'h-full bg-gold' : 'h-full bg-green'}
                      style={{ width: `${(verifiedCount / verificationStages.length) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {verifiedCount} of {verificationStages.length} checks complete
                  </p>
                  {incomplete && (
                    <>
                      <p className="mt-2 text-xs text-charcoal">
                        Unverified profiles get fewer job matches and can't withdraw earnings.
                      </p>
                      <Link href="/worker/verification" className="mt-3 block">
                        <Button size="sm" className="w-full !bg-gold hover:!bg-gold-2">
                          Complete verification
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <p className="mt-3 text-xs text-muted">Loading…</p>
              )}
            </div>
          );

          return incomplete ? [verificationCard, earningsCard] : [earningsCard, verificationCard];
        })()}

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-charcoal">Recommended Jobs</p>
            <Link href="/worker/find-jobs" className="text-xs font-medium text-green hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {recommended.isError ? (
              <p className="text-xs text-muted">Couldn't load recommendations.</p>
            ) : (recommended.data ?? []).length === 0 && !recommended.isLoading ? (
              <p className="text-xs text-muted">No recommendations yet — complete your profile to get matched.</p>
            ) : (
              (recommended.data ?? []).slice(0, 4).map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block">
                  <p className="truncate text-sm font-medium text-charcoal">{job.title}</p>
                  <p className="truncate text-xs text-muted">
                    {formatBudgetRange(job.budget_min_ghs, job.budget_max_ghs)} · {job.location_text ?? 'Remote'}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-charcoal">Recent Activity</p>
            <Link href="/worker/settings" className="text-xs font-medium text-green hover:underline">
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
      </div>

      <Modal
        open={showPhonePrompt && verification.data?.phone_status !== 'verified'}
        onClose={() => setShowPhonePrompt(false)}
        title="Verify your phone number"
      >
        <p className="mb-4 text-sm text-muted">
          You'll need this before you can withdraw your earnings. Takes a minute — or skip it for now and do it later
          from Verification.
        </p>
        <PhoneVerification onVerified={() => setShowPhonePrompt(false)} />
        <button
          type="button"
          onClick={() => setShowPhonePrompt(false)}
          className="mt-4 text-sm font-medium text-muted hover:text-charcoal"
        >
          Skip for now
        </button>
      </Modal>
    </div>
  );
}
