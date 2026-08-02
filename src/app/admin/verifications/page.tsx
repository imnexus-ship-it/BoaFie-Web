'use client';

import { useState } from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import {
  AdminVerification,
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

const REJECTION_REASONS = [
  'Blurry or unclear photo',
  'Document appears expired',
  "Name doesn't match account",
  'Document type not accepted',
  "Selfie doesn't match ID photo",
  'Other',
];

function DocumentLinks({ v }: { v: AdminVerification }) {
  const docs = [
    { label: 'ID front', url: v.id_front_url },
    { label: 'ID back', url: v.id_back_url },
    { label: 'Selfie', url: v.selfie_url },
    { label: 'Trade cert', url: v.trade_cert_url },
  ].filter((d) => d.url);

  if (docs.length === 0) return null;

  return (
    <div className="mb-3 flex flex-wrap gap-3">
      {docs.map((d) => (
        <a
          key={d.label}
          href={d.url!}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs font-medium text-green hover:underline"
        >
          {d.label} <ExternalLink className="h-3 w-3" />
        </a>
      ))}
    </div>
  );
}

export default function AdminVerificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useAdminPendingVerifications(page);
  const approve = useAdminApproveVerification();
  const reject = useAdminRejectVerification();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reasonPreset, setReasonPreset] = useState(REJECTION_REASONS[0]);
  const [reason, setReason] = useState('');

  if (isLoading) return <PageSpinner />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  const items = data?.data || [];

  const startRejecting = (id: string) => {
    setRejectingId(id);
    setReasonPreset(REJECTION_REASONS[0]);
    setReason(REJECTION_REASONS[0]);
  };

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Verification queue</h1>

      {items.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Nothing pending" description="All verification submissions are up to date." />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((v) => (
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
                      <Badge
                        key={key}
                        variant={(v as any)[key] === 'verified' ? 'green' : (v as any)[key] === 'pending' ? 'gold' : 'muted'}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <DocumentLinks v={v} />

                {rejectingId === v.id ? (
                  <div className="flex flex-col gap-2">
                    <Select
                      value={reasonPreset}
                      onChange={(e) => {
                        setReasonPreset(e.target.value);
                        if (e.target.value !== 'Other') setReason(e.target.value);
                        else setReason('');
                      }}
                    >
                      {REJECTION_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </Select>
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
                        disabled={!reason.trim()}
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
                    <Button size="sm" variant="secondary" onClick={() => startRejecting(v.id)}>
                      Reject
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {data?.meta && <Pagination page={page} limit={data.meta.limit} total={data.meta.total} onChange={setPage} />}
    </div>
  );
}
