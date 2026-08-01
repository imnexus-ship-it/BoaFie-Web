'use client';

import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui';
import { formatBudgetRange } from '@/lib/utils/currency';
import { useMyPostedJobs } from '@/lib/api/hooks/useJobs';

const STATUS_VARIANT: Record<string, 'green' | 'gold' | 'muted' | 'danger'> = {
  open: 'gold',
  in_progress: 'green',
  completed: 'muted',
  cancelled: 'danger',
  disputed: 'danger',
  draft: 'muted',
};

export default function MyJobsPage() {
  const { data, isLoading, isError, error, refetch } = useMyPostedJobs();

  if (isLoading) return <PageSpinner />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  const jobs = data?.data || [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-head text-2xl font-bold text-charcoal">My jobs</h1>
        <Link href="/post-job">
          <Button size="sm">Post a job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <Link key={job.id} href={`/my-jobs/${job.id}`}>
              <Card className="hover:shadow-md">
                <CardBody className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-head text-sm font-semibold text-charcoal">{job.title}</p>
                    <p className="text-xs text-muted">{formatBudgetRange(job.budget_min_ghs, job.budget_max_ghs, job.currency)}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[job.status]}>{job.status.replace('_', ' ')}</Badge>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
