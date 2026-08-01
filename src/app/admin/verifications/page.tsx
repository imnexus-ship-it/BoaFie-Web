'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import {
  useAdminApproveVerification,
  useAdminPendingVerifications,
  useAdminRejectVerification,
} from '@/lib/api/hooks/useAdmin';

const STEP_LABELS: Record<string, string> = {
  id_status: 'ID',
  selfie_status: 'Selfie',
  location_status: 'Location',
  trade_cert_status: 'Trade cert',
};

export default function AdminVerificationsPage() {
  const { data, isLoading, isError, error, refetch } = useAdminPendingVerifications();
  const approve = useAdminApproveVerification();
  const reject = useAdminRejectVerification();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  if (isLoading) return <PageSpinner />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  const items = data?.data || [];

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Verification queue</h1>

      {items.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Nothing pending" description="All verification submissions are up to date." />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((v: any) => (
            <Card key={v.id}>
              <CardBody>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-head text-sm font-semibold text-charcoal">{v.users?.full_name}</p>
                    <p className="text-xs text-muted">
                      {v.users?.email} · {v.users?.role}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {Object.entries(STEP_LABELS).map(([key, label]) => (
                      <Badge key={key} variant={v[key] === 'verified' ? 'green' : v[key] === 'pending' ? 'gold' : 'muted'}>
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {rejectingId === v.id ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      rows={2}
                      placeholder="Reason for rejection"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="danger"
                        loading={reject.isPending}
                        onClick={() => reject.mutate({ id: v.id, reason }, { onSuccess: () => setRejectingId(null) })}
                      >
                        Confirm reject
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setRejectingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" loading={approve.isPending} onClick={() => approve.mutate(v.id)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setRejectingId(v.id)}>
                      Reject
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
