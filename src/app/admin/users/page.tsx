'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users as UsersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { useAdminUsers } from '@/lib/api/hooks/useAdmin';

const STATUS_VARIANT: Record<string, 'green' | 'gold' | 'danger' | 'muted'> = {
  active: 'green',
  suspended: 'gold',
  banned: 'danger',
};

export default function AdminUsersPage() {
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const { data, isLoading, isError, error, refetch } = useAdminUsers({ role: role || undefined, status: status || undefined });

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Users</h1>

      <div className="mb-6 flex gap-3">
        <Select value={role} onChange={(e) => setRole(e.target.value)} className="max-w-[180px]">
          <option value="">All roles</option>
          <option value="client">Client</option>
          <option value="artisan">Artisan</option>
          <option value="freelancer">Freelancer</option>
          <option value="admin">Admin</option>
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="max-w-[180px]">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </Select>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      ) : (data?.data || []).length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users found" description="Try a different filter." />
      ) : (
        <Card>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data || []).map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-black/[0.02]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${u.id}`} className="font-medium text-charcoal hover:text-green">
                      {u.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3 capitalize text-charcoal">{u.role}</td>
                  <td className="px-4 py-3 capitalize text-charcoal">{u.plan || 'free'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[u.status || 'active'] || 'muted'}>{u.status || 'active'}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
