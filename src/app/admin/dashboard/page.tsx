'use client';

import Link from 'next/link';
import { Users, Briefcase, FileText, Scale, Coins, UserCog, ShieldCheck, ScrollText } from 'lucide-react';
import { StatsGrid } from '@/components/admin/StatsGrid';
import { Badge } from '@/components/ui/Badge';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  useAdminStats,
  useAdminPendingVerifications,
  useAdminDisputes,
  useAdminAuditLog,
  useAdminCommissions,
} from '@/lib/api/hooks/useAdmin';
import { formatCurrency } from '@/lib/utils/currency';
import { timeAgo } from '@/lib/utils/date';

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useAdminStats();
  const verifications = useAdminPendingVerifications();
  const disputes = useAdminDisputes();
  const auditLog = useAdminAuditLog();
  const commissions = useAdminCommissions();

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  const pendingVerifications = verifications.data?.data ?? [];
  const openDisputes = disputes.data?.data ?? [];
  const recentAudit = auditLog.data?.data.slice(0, 6) ?? [];

  return (
    <div className="mx-auto flex max-w-7xl gap-6">
      <div className="min-w-0 flex-1 space-y-6">
        <div>
          <h1 className="font-head text-2xl font-bold text-charcoal">Platform overview</h1>
          <p className="text-sm text-muted">Moderation queues, disputes, and platform health at a glance.</p>
        </div>

        <StatsGrid
          stats={[
            { label: 'Total Users', value: data.total_users, icon: Users, iconBg: 'bg-navy/10', iconColor: 'text-navy' },
            { label: 'Artisans', value: data.total_artisans, icon: UserCog, iconBg: 'bg-green-3', iconColor: 'text-green' },
            { label: 'Freelancers', value: data.total_freelancers, icon: UserCog, iconBg: 'bg-green-3', iconColor: 'text-green' },
            { label: 'Open Jobs', value: data.open_jobs, icon: Briefcase, iconBg: 'bg-gold-3', iconColor: 'text-gold' },
            {
              label: 'Active Contracts',
              value: data.active_contracts,
              icon: FileText,
              iconBg: 'bg-gold-3',
              iconColor: 'text-gold',
            },
            {
              label: 'Open Disputes',
              value: data.open_disputes,
              icon: Scale,
              iconBg: data.open_disputes > 0 ? 'bg-red-50' : 'bg-green-3',
              iconColor: data.open_disputes > 0 ? 'text-danger' : 'text-green',
              href: '/admin/disputes',
            },
            {
              label: 'Commission Earned',
              value: formatCurrency(data.total_commission_earned_ghs),
              icon: Coins,
              iconBg: 'bg-navy/10',
              iconColor: 'text-navy',
            },
          ]}
        />

        <div className="rounded-lg border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-head text-base font-semibold text-charcoal">Pending Verifications</h2>
            <Link href="/admin/verifications" className="text-sm font-medium text-green hover:underline">
              View all
            </Link>
          </div>
          {pendingVerifications.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={ShieldCheck} title="No pending verifications" description="You're all caught up." />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {pendingVerifications.slice(0, 5).map((v) => (
                <Link
                  key={v.id}
                  href="/admin/verifications"
                  className="flex items-center gap-4 p-5 transition-colors hover:bg-cream"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-3">
                    <ShieldCheck className="h-5 w-5 text-gold" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-head text-sm font-semibold text-charcoal">{v.users?.full_name}</p>
                    <p className="truncate text-xs capitalize text-muted">{v.users?.role}</p>
                  </div>
                  <Badge variant="gold">Pending review</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-head text-base font-semibold text-charcoal">Open Disputes</h2>
            <Link href="/admin/disputes" className="text-sm font-medium text-green hover:underline">
              View all
            </Link>
          </div>
          {openDisputes.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={Scale} title="No open disputes" description="Nothing needs your attention right now." />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {openDisputes.slice(0, 5).map((d) => (
                <Link key={d.id} href="/admin/disputes" className="flex items-center gap-4 p-5 transition-colors hover:bg-cream">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <Scale className="h-5 w-5 text-danger" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-head text-sm font-semibold text-charcoal">{d.contract?.title ?? 'Contract dispute'}</p>
                    <p className="truncate text-xs text-muted">{d.reason}</p>
                  </div>
                  <Badge variant="danger">{d.status.replace('_', ' ')}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right column */}
      <div className="hidden w-80 shrink-0 space-y-6 xl:block">
        <div className="rounded-lg bg-gradient-to-br from-navy to-green p-5 text-white">
          <span className="text-sm font-medium text-white/80">Commission Summary</span>
          <p className="mt-3 font-head text-2xl font-bold">
            {commissions.data ? formatCurrency(commissions.data.total_commission_ghs) : '—'}
          </p>
          <p className="mt-1 text-xs text-white/60">
            {commissions.data ? `Across ${commissions.data.sample_size} transactions` : 'Loading…'}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-charcoal">Recent Audit Log</p>
            <Link href="/admin/audit-log" className="text-xs font-medium text-green hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-4">
            {recentAudit.length === 0 ? (
              <p className="text-xs text-muted">No admin actions logged yet.</p>
            ) : (
              recentAudit.map((entry) => (
                <div key={entry.id} className="flex items-start gap-2">
                  <ScrollText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-charcoal">
                      {entry.admin?.full_name ?? 'Admin'} · {entry.action.replace(/_/g, ' ')}
                    </p>
                    <p className="text-[11px] text-muted">{timeAgo(entry.created_at)}</p>
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
