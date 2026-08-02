'use client';

import { useState } from 'react';
import { Receipt } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { useAdminTransactions } from '@/lib/api/hooks/useAdmin';
import { formatCurrency } from '@/lib/utils/currency';
import { timeAgo } from '@/lib/utils/date';

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useAdminTransactions(page);
  const transactions = data?.data || [];

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Transactions</h1>

      {isLoading ? (
        <PageSpinner />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      ) : transactions.length === 0 ? (
        <EmptyState icon={Receipt} title="No transactions yet" description="Platform transactions will appear here." />
      ) : (
        <Card>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-black/[0.02]">
                  <td className="px-4 py-3 text-charcoal">{t.user?.full_name || '—'}</td>
                  <td className="px-4 py-3 capitalize text-charcoal">{t.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">{formatCurrency(t.amount, t.currency)}</td>
                  <td className="px-4 py-3 text-muted">
                    {t.commission_amount ? formatCurrency(t.commission_amount, t.currency) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={t.status === 'completed' ? 'green' : t.status === 'pending' ? 'gold' : 'muted'}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">{timeAgo(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {data?.meta && <Pagination page={page} limit={data.meta.limit} total={data.meta.total} onChange={setPage} />}
    </div>
  );
}
