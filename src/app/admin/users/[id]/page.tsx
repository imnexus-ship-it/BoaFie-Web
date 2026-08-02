'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { Users as UsersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { User } from '@/lib/api/types';
import {
  useAdminBanUser,
  useAdminPromoteToAdmin,
  useAdminReinstateUser,
  useAdminSuspendUser,
} from '@/lib/api/hooks/useAdmin';

export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const queryClient = useQueryClient();

  // There's no GET /admin/users/:id endpoint on the API — this reuses
  // whatever's already cached from the Users list (any filter/page) instead
  // of calling a route that doesn't exist. Works when navigating from the
  // list; a direct link to this page won't have anything cached yet.
  const data = useMemo(() => {
    const cached = queryClient.getQueriesData<{ data: User[] }>({ queryKey: ['admin', 'users'] });
    for (const [, page] of cached) {
      const found = page?.data.find((u) => u.id === id);
      if (found) return found;
    }
    return undefined;
  }, [queryClient, id]);

  const suspend = useAdminSuspendUser();
  const ban = useAdminBanUser();
  const reinstate = useAdminReinstateUser();
  const promote = useAdminPromoteToAdmin();
  const [reason, setReason] = useState('');
  const [confirmBanOpen, setConfirmBanOpen] = useState(false);
  const [confirmPromoteOpen, setConfirmPromoteOpen] = useState(false);

  if (!data) {
    return (
      <EmptyState
        icon={UsersIcon}
        title="Open this user from the Users list"
        description="There's no direct lookup yet, so this page only works when you click through from Users."
        action={
          <Link href="/admin/users">
            <Button>Go to Users</Button>
          </Link>
        }
      />
    );
  }

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
              <Button size="sm" variant="danger" loading={ban.isPending} onClick={() => setConfirmBanOpen(true)}>
                Ban
              </Button>
            )}
          </div>
          {ban.isError && <p className="mt-3 text-sm text-red-600">{ban.error.message}</p>}
        </CardBody>
      </Card>

      {data.role !== 'admin' && (
        <Card className="mt-4 border-gold/40">
          <CardBody>
            <h2 className="mb-1 font-head text-base font-semibold text-charcoal">Admin access</h2>
            <p className="mb-3 text-sm text-muted">
              Grants full admin privileges — user management, moderation, disputes, and financial data.
            </p>
            <Button size="sm" variant="secondary" onClick={() => setConfirmPromoteOpen(true)}>
              Make admin
            </Button>
            {promote.isError && <p className="mt-3 text-sm text-red-600">{promote.error.message}</p>}
          </CardBody>
        </Card>
      )}

      <Modal open={confirmPromoteOpen} onClose={() => setConfirmPromoteOpen(false)} title="Grant admin access?">
        <p className="text-sm text-charcoal">
          {data.full_name} will get full admin access to this platform — every user's data, every dispute, every
          transaction. Only do this for someone you trust completely; there's no way to remove admin access from
          this UI yet.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setConfirmPromoteOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={promote.isPending}
            onClick={() => promote.mutate(id, { onSuccess: () => setConfirmPromoteOpen(false) })}
          >
            Confirm — make admin
          </Button>
        </div>
      </Modal>

      <Modal open={confirmBanOpen} onClose={() => setConfirmBanOpen(false)} title="Ban this user?">
        <p className="text-sm text-charcoal">
          This immediately suspends {data.full_name}'s access and blocks their ID number from registering a new
          account. Make sure the reason above is accurate before continuing.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setConfirmBanOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={ban.isPending}
            onClick={() => {
              ban.mutate({ id, reason }, { onSuccess: () => setConfirmBanOpen(false) });
            }}
          >
            Confirm ban
          </Button>
        </div>
      </Modal>
    </div>
  );
}
