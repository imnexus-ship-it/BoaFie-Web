'use client';

import { useState } from 'react';
import { Scale } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { useAdminDisputes, useAdminResolveDispute } from '@/lib/api/hooks/useAdmin';

export default function AdminDisputesPage() {
  const { data, isLoading, isError, error, refetch } = useAdminDisputes();
  const resolve = useAdminResolveDispute();
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const disputes = data?.data || [];

  if (isLoading) return <PageSpinner />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Disputes</h1>

      {disputes.length === 0 ? (
        <EmptyState icon={Scale} title="No disputes" description="Contract disputes will show up here for review." />
      ) : (
        <div className="flex flex-col gap-3">
          {disputes.map((d) => (
            <Card key={d.id}>
              <CardBody>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-head text-sm font-semibold text-charcoal">{d.contract?.title || 'Contract'}</p>
                  <Badge variant={d.status === 'open' ? 'gold' : 'muted'}>{d.status.replace('_', ' ')}</Badge>
                </div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">{d.reason}</p>
                <p className="mb-3 text-sm text-charcoal">{d.description}</p>

                {d.status === 'open' && (
                  resolvingId === d.id ? (
                    <div className="flex flex-col gap-2">
                      <Textarea
                        rows={2}
                        placeholder="Resolution note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          loading={resolve.isPending}
                          onClick={() =>
                            resolve.mutate(
                              { id: d.id, outcome: 'resolved_client', resolution_note: note },
                              { onSuccess: () => setResolvingId(null) },
                            )
                          }
                        >
                          Resolve for client
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={resolve.isPending}
                          onClick={() =>
                            resolve.mutate(
                              { id: d.id, outcome: 'resolved_worker', resolution_note: note },
                              { onSuccess: () => setResolvingId(null) },
                            )
                          }
                        >
                          Resolve for worker
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setResolvingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => setResolvingId(d.id)}>
                      Review & resolve
                    </Button>
                  )
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
