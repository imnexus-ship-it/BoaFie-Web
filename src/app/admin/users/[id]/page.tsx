'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { api } from '@/lib/api/client';
import { User, Verification } from '@/lib/api/types';
import { useAdminBanUser, useAdminReinstateUser, useAdminSuspendUser } from '@/lib/api/hooks/useAdmin';

type AdminUserDetail = User & {
  verifications?: Verification[];
  artisan_profiles?: unknown[];
  freelancer_profiles?: unknown[];
};

export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => api.get<AdminUserDetail>(`/admin/users/${id}`),
  });

  const suspend = useAdminSuspendUser();
  const ban = useAdminBanUser();
  const reinstate = useAdminReinstateUser();
  const [reason, setReason] = useState('');

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-head text-2xl font-bold text-charcoal">{data.full_name}</h1>
          <p className="text-sm text-muted">{data.email}</p>
        </div>
        <Badge variant={data.status === 'active' ? 'green' : data.status === 'banned' ? 'danger' : 'gold'}>
          {data.status || 'active'}
        </Badge>
      </div>

      <Card className="mb-4">
        <CardBody className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted">Role</p>
            <p className="capitalize text-charcoal">{data.role}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Plan</p>
            <p className="capitalize text-charcoal">{data.plan || 'free'}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Phone</p>
            <p className="text-charcoal">{data.phone || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Joined</p>
            <p className="text-charcoal">{data.created_at ? new Date(data.created_at).toLocaleDateString() : '—'}</p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="mb-3 font-head text-base font-semibold text-charcoal">Moderation actions</h2>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional)"
            className="mb-3 w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
          />
          <div className="flex flex-wrap gap-2">
            {data.status !== 'active' && (
              <Button size="sm" variant="secondary" loading={reinstate.isPending} onClick={() => reinstate.mutate(id)}>
                Reinstate
              </Button>
            )}
            {data.status !== 'suspended' && (
              <Button
                size="sm"
                variant="secondary"
                loading={suspend.isPending}
                onClick={() => suspend.mutate({ id, reason })}
              >
                Suspend
              </Button>
            )}
            {data.status !== 'banned' && (
              <Button size="sm" variant="danger" loading={ban.isPending} onClick={() => ban.mutate({ id, reason })}>
                Ban
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
