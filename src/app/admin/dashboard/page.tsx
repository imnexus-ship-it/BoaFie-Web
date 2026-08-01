'use client';

import { Users, Briefcase, FileText, Scale, Coins, UserCog } from 'lucide-react';
import { StatsGrid } from '@/components/admin/StatsGrid';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAdminStats } from '@/lib/api/hooks/useAdmin';
import { formatCurrency } from '@/lib/utils/currency';

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useAdminStats();

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Platform overview</h1>

      <StatsGrid
        stats={[
          { label: 'Total users', value: data.total_users, icon: Users },
          { label: 'Artisans', value: data.total_artisans, icon: UserCog },
          { label: 'Freelancers', value: data.total_freelancers, icon: UserCog },
          { label: 'Open jobs', value: data.open_jobs, icon: Briefcase },
          { label: 'Active contracts', value: data.active_contracts, icon: FileText },
          { label: 'Open disputes', value: data.open_disputes, icon: Scale },
          {
            label: 'Commission earned',
            value: formatCurrency(data.total_commission_earned_ghs),
            icon: Coins,
          },
        ]}
      />
    </div>
  );
}
