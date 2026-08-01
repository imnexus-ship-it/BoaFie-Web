'use client';

import Link from 'next/link';
import { Send, FileText, Wallet, Bell } from 'lucide-react';
import { StatsGrid } from '@/components/admin/StatsGrid';
import { Button } from '@/components/ui';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDashboard } from '@/lib/api/hooks/useDashboard';
import { useRecommendedJobs } from '@/lib/api/hooks/useJobs';
import { JobCard } from '@/components/marketplace/JobCard';

export default function WorkerDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboard();
  const recommended = useRecommendedJobs();

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-head text-2xl font-bold text-charcoal">Dashboard</h1>
        <Link href="/worker/find-jobs">
          <Button>Find jobs</Button>
        </Link>
      </div>

      <StatsGrid
        stats={[
          { label: 'Active proposals', value: data.active_proposals ?? 0, icon: Send },
          { label: 'Open contracts', value: data.open_contracts ?? 0, icon: FileText },
          { label: 'Wallet balance', value: `GH₵${data.wallet?.balance_ghs ?? 0}`, icon: Wallet },
          { label: 'Unread notifications', value: data.unread_notifications, icon: Bell },
        ]}
      />

      <h2 className="mb-4 mt-10 font-head text-lg font-semibold text-charcoal">Recommended for you</h2>
      {recommended.isLoading ? null : (recommended.data || []).length === 0 ? (
        <EmptyState
          icon={Send}
          title="No recommendations yet"
          description="Complete your profile to get matched with relevant jobs."
          action={
            <Link href="/worker/profile">
              <Button>Complete profile</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(recommended.data || []).slice(0, 6).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
