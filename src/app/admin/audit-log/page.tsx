'use client';

import { ScrollText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { useAdminAuditLog } from '@/lib/api/hooks/useAdmin';
import { timeAgo } from '@/lib/utils/date';

export default function AdminAuditLogPage() {
  const { data, isLoading, isError, error, refetch } = useAdminAuditLog();
  const entries = data?.data || [];

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Audit log</h1>

      {isLoading ? (
        <PageSpinner />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      ) : entries.length === 0 ? (
        <EmptyState icon={ScrollText} title="No admin actions yet" description="Moderation actions will be logged here." />
      ) : (
        <Card>
          <div className="flex flex-col">
            {entries.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm text-charcoal">
                    <span className="font-medium">{e.admin?.full_name || 'Admin'}</span>{' '}
                    <span className="text-muted">{e.action.replace(/[._]/g, ' ')}</span>{' '}
                    <span className="text-muted">on {e.target_type}</span>
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted">{timeAgo(e.created_at)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
