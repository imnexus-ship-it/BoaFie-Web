'use client';

import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Modal } from '@/components/ui/Modal';
import { PageSpinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { useAdminJobs, useAdminRemoveJob } from '@/lib/api/hooks/useAdmin';
import { formatBudgetRange } from '@/lib/utils/currency';

export default function AdminJobsPage() {
  const [status, setStatus] = useState('');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useAdminJobs({
    page,
    status: status || undefined,
    flagged: flaggedOnly || undefined,
  });
  const removeJob = useAdminRemoveJob();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const jobs = data?.data || [];

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Jobs</h1>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="max-w-[180px]"
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="disputed">Disputed</option>
        </Select>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={flaggedOnly}
            onChange={(e) => {
              setFlaggedOnly(e.target.checked);
              setPage(1);
            }}
          />
          Flagged only
        </label>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      ) : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs found" description="Try a different filter." />
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardBody className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-head text-sm font-semibold text-charcoal">{job.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {job.client?.full_name} · {formatBudgetRange(job.budget_min_ghs, job.budget_max_ghs, job.currency)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={job.status === 'open' ? 'green' : 'muted'}>{job.status.replace('_', ' ')}</Badge>
                  {job.status !== 'cancelled' && (
                    <Button size="sm" variant="danger" onClick={() => setConfirmingId(job.id)}>
                      Remove
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {data?.meta && <Pagination page={page} limit={data.meta.limit} total={data.meta.total} onChange={setPage} />}

      <Modal open={!!confirmingId} onClose={() => setConfirmingId(null)} title="Remove this job?">
        <p className="text-sm text-charcoal">
          This cancels the job posting — the client and any active applicants won't be able to proceed with it. This
          can't be undone from here.
        </p>
        {removeJob.isError && <p className="mt-2 text-sm text-red-600">{removeJob.error.message}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setConfirmingId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={removeJob.isPending}
            onClick={() => {
              if (confirmingId) removeJob.mutate(confirmingId, { onSuccess: () => setConfirmingId(null) });
            }}
          >
            Confirm remove
          </Button>
        </div>
      </Modal>
    </div>
  );
}
