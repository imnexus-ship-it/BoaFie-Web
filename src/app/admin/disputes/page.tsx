'use client';

import { useState } from 'react';
import { Scale } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Modal } from '@/components/ui/Modal';
import { PageSpinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { useAdminDisputes, useAdminResolveDispute } from '@/lib/api/hooks/useAdmin';

const OUTCOME_LABEL: Record<string, string> = {
  resolved_client: 'Resolve for client',
  resolved_worker: 'Resolve for worker',
  escalated: 'Escalate',
};

export default function AdminDisputesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useAdminDisputes(page);
  const resolve = useAdminResolveDispute();
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [confirming, setConfirming] = useState<{ id: string; outcome: 'resolved_client' | 'resolved_worker' | 'escalated' } | null>(
    null,
  );

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
                <p className="mb-2 text-xs text-muted">
                  <span className="font-medium text-charcoal">{d.raised_by_user?.full_name ?? 'Unknown'}</span> raised this
                  against{' '}
                  <span className="font-medium text-charcoal">{d.against_user_user?.full_name ?? 'Unknown'}</span>
                </p>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">{d.reason}</p>
                <p className="mb-3 text-sm text-charcoal">{d.description}</p>
                {d.status !== 'open' && d.resolution_note && (
                  <p className="mb-3 rounded-lg bg-cream p-3 text-sm text-charcoal">
                    <span className="font-medium">Resolution: </span>
                    {d.resolution_note}
                  </p>
                )}

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
                          disabled={!note.trim()}
                          onClick={() => setConfirming({ id: d.id, outcome: 'resolved_client' })}
                        >
                          Resolve for client
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={!note.trim()}
                          onClick={() => setConfirming({ id: d.id, outcome: 'resolved_worker' })}
                        >
                          Resolve for worker
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={!note.trim()}
                          onClick={() => setConfirming({ id: d.id, outcome: 'escalated' })}
                        >
                          Escalate
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

      {data?.meta && <Pagination page={page} limit={data.meta.limit} total={data.meta.total} onChange={setPage} />}

      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title={confirming ? OUTCOME_LABEL[confirming.outcome] + '?' : undefined}
      >
        {confirming && (
          <>
            <p className="text-sm text-charcoal">
              This can't be undone.{' '}
              {confirming.outcome === 'resolved_worker' && "Any remaining escrow on this contract is released to the worker's wallet now (minus their commission rate)."}
              {confirming.outcome === 'resolved_client' && "Any remaining escrow on this contract is refunded to the client's wallet now."}
              {confirming.outcome === 'escalated' && 'The dispute is marked escalated — no funds move yet.'}
              {' '}Both parties are notified with your note below.
            </p>
            <p className="mt-3 rounded-lg bg-cream p-3 text-sm text-charcoal">{note}</p>
            {resolve.isError && <p className="mt-2 text-sm text-red-600">{resolve.error.message}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setConfirming(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={resolve.isPending}
                onClick={() =>
                  resolve.mutate(
                    { id: confirming.id, outcome: confirming.outcome, resolution_note: note },
                    {
                      onSuccess: () => {
                        setResolvingId(null);
                        setConfirming(null);
                        setNote('');
                      },
                    },
                  )
                }
              >
                Confirm
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
