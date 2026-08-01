'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';
import { Badge, Card, CardBody } from '@/components/ui';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useMyProposals } from '@/lib/api/hooks/useProposals';
import { formatCurrency } from '@/lib/utils/currency';
import { timeAgo } from '@/lib/utils/date';

const STATUS_VARIANT: Record<string, 'green' | 'gold' | 'danger' | 'muted'> = {
  pending: 'gold',
  accepted: 'green',
  rejected: 'danger',
  withdrawn: 'muted',
};

export default function ProposalsPage() {
  const { data, isLoading, isError, error, refetch } = useMyProposals();

  if (isLoading) return <PageSpinner />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">My proposals</h1>

      {(data || []).length === 0 ? (
        <EmptyState
          icon={Send}
          title="No proposals yet"
          description="Browse open jobs and submit your first proposal."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {(data || []).map((p) => (
            <Link key={p.id} href={`/jobs/${p.job_id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardBody className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-head text-sm font-semibold text-charcoal">
                      {p.job?.title || 'Job'}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-muted">{p.cover_letter}</p>
                    <p className="mt-1 text-xs text-muted">Submitted {timeAgo(p.created_at)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="font-head text-sm font-semibold text-green">
                      {formatCurrency(p.proposed_rate)}
                    </span>
                    <Badge variant={STATUS_VARIANT[p.status] || 'muted'}>{p.status}</Badge>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
