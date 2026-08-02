'use client';

import { Suspense, useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { CategoryFilter } from '@/components/marketplace/CategoryFilter';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { WorkerCard, WorkerLike } from '@/components/marketplace/WorkerCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useArtisans } from '@/lib/api/hooks/useArtisans';
import { useFreelancers } from '@/lib/api/hooks/useFreelancers';

function ExploreContent() {
  const params = useSearchParams();
  const initialTab = params.get('tab') === 'freelancers' ? 'freelancers' : 'artisans';

  const [category, setCategory] = useState<string | undefined>(params.get('category') ?? undefined);
  const [location, setLocation] = useState(params.get('location') ?? '');
  const [tab, setTab] = useState<'artisans' | 'freelancers'>(initialTab);

  const { data: categories } = useCategories();
  const artisans = useArtisans({ category: tab === 'artisans' ? category : undefined, location });
  const freelancers = useFreelancers({ skills: tab === 'freelancers' ? category : undefined });

  const active = tab === 'artisans' ? artisans : freelancers;
  const workers = useMemo<WorkerLike[]>(() => {
    if (tab === 'artisans') {
      const rows = artisans.data?.data || [];
      return rows.map((w) => ({ ...w, kind: 'artisan' as const }));
    }
    const rows = freelancers.data?.data || [];
    return rows.map((w) => ({ ...w, kind: 'freelancer' as const }));
  }, [artisans.data, freelancers.data, tab]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <h1 className="font-head text-2xl font-bold text-charcoal">Explore verified workers</h1>
      <p className="mb-6 text-sm text-muted">Every profile here has gone through BoaFie's verification process.</p>

      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-white p-1 max-w-xs">
        {(['artisans', 'freelancers'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setCategory(undefined);
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-green text-white' : 'text-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchBar placeholder="Search by location…" defaultValue={location} onSearch={setLocation} />
      </div>

      {categories && categories.filter((c) => c.type === (tab === 'artisans' ? 'artisan' : 'freelancer') || c.type === 'both').length > 0 && (
        <CategoryFilter
          categories={categories.filter((c) => c.type === (tab === 'artisans' ? 'artisan' : 'freelancer') || c.type === 'both')}
          active={category}
          onChange={setCategory}
        />
      )}

      {active.isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : active.isError ? (
        <ErrorState message={active.error?.message} onRetry={() => active.refetch()} />
      ) : workers.length === 0 ? (
        <EmptyState icon={Users} title="No workers found" description="Try a different category or location." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {workers.map((w) => (
            <WorkerCard key={w.id} worker={w} verified={(w as any).users?.status === 'active'} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreContent />
    </Suspense>
  );
}
