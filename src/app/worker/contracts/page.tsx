'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Badge, Card, CardBody } from '@/components/ui';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useContracts } from '@/lib/api/hooks/useContracts';
import { formatCurrency } from '@/lib/utils/currency';

const STATUS_VARIANT: Record<string, 'green' | 'gold' | 'danger' | 'muted'> = {
  in_progress: 'gold',
  completed: 'green',
  cancelled: 'muted',
  disputed: 'danger',
};

export default function WorkerContractsPage() {
  const { data, isLoading, isError, error, refetch } = useContracts();

  if (isLoading) return <PageSpinner />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  const contracts = data?.data || [];

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Contracts</h1>

      {contracts.length === 0 ? (
        <EmptyState icon={FileText} title="No contracts yet" description="Accepted proposals will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {contracts.map((c) => (
            <Link key={c.id} href={`/worker/contracts/${c.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardBody className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-head text-sm font-semibold text-charcoal">{c.title}</p>
                    <p className="mt-1 text-xs text-muted">with {c.client?.full_name || 'client'}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="font-head text-sm font-semibold text-green">
                      {formatCurrency(c.agreed_amount, c.currency)}
                    </span>
                    <Badge variant={STATUS_VARIANT[c.status] || 'muted'}>{c.status.replace('_', ' ')}</Badge>
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
