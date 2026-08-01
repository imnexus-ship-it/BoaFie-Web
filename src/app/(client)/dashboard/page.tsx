'use client';

import Link from 'next/link';
import { Briefcase, FileText, Bell, Wallet } from 'lucide-react';
import { StatsGrid } from '@/components/admin/StatsGrid';
import { Button } from '@/components/ui';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { useDashboard } from '@/lib/api/hooks/useDashboard';
import { useMyPostedJobs } from '@/lib/api/hooks/useJobs';
import { JobCard } from '@/components/marketplace/JobCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ClientDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboard();
  const myJobs = useMyPostedJobs();

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-head text-2xl font-bold text-charcoal">Dashboard</h1>
        <Link href="/post-job">
          <Button>Post a new job</Button>
        </Link>
      </div>

      <StatsGrid
        stats={[
          { label: 'Active jobs', value: data.active_jobs ?? 0, icon: Briefcase },
          { label: 'Open contracts', value: data.open_contracts ?? 0, icon: FileText },
          { label: 'Wallet balance', value: `GH₵${data.wallet?.balance_ghs ?? 0}`, icon: Wallet },
          { label: 'Unread notifications', value: data.unread_notifications, icon: Bell },
        ]}
      />

      <h2 className="mb-4 mt-10 font-head text-lg font-semibold text-charcoal">Your recent jobs</h2>
      {myJobs.isLoading ? null : (myJobs.data?.data || []).length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs posted yet" description="Post your first job to start receiving proposals." action={<Link href="/post-job"><Button>Post a job</Button></Link>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myJobs.data!.data.slice(0, 6).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
