'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils/currency';
import { useContracts } from '@/lib/api/hooks/useContracts';

const STATUS_VARIANT: Record<string, 'green' | 'gold' | 'muted' | 'danger'> = {
  open: 'gold',
  in_progress: 'green',
  completed: 'muted',
  cancelled: 'danger',
  disputed: 'danger',
  draft: 'muted',
};

export default function ContractsPage() {
  const { data, isLoading, isError, error, refetch } = useContracts();

  if (isLoading) return <PageSpinner />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  const contracts = data?.data || [];

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Contracts</h1>
      {contracts.length === 0 ? (
        <EmptyState icon={FileText} title="No contracts yet" description="Contracts appear once you accept a proposal." />
      ) : (
        <div className="flex flex-col gap-3">
          {contracts.map((c) => (
            <Link key={c.id} href={`/contracts/${c.id}`}>
              <Card className="hover:shadow-md">
                <CardBody className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={c.worker?.avatar_url} name={c.worker?.full_name} size={36} />
                    <div>
                      <p className="font-head text-sm font-semibold text-charcoal">{c.title}</p>
                      <p className="text-xs text-muted">with {c.worker?.full_name || 'worker'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-head text-sm font-semibold text-green">{formatCurrency(c.agreed_amount, c.currency)}</span>
                    <Badge variant={STATUS_VARIANT[c.status]}>{c.status.replace('_', ' ')}</Badge>
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
