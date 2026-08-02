'use client';

import { Suspense, useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { CategoryFilter } from '@/components/marketplace/CategoryFilter';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { JobCard } from '@/components/marketplace/JobCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useJobs } from '@/lib/api/hooks/useJobs';

function FindJobsContent() {
  const params = useSearchParams();
  const [category, setCategory] = useState<string | undefined>(params.get('category') ?? undefined);
  const [location, setLocation] = useState(params.get('location') ?? '');

  const { data: categories } = useCategories();
  const jobs = useJobs({ category, location });

  return (
    <div>
      <h1 className="font-head text-2xl font-bold text-charcoal">Find jobs</h1>
      <p className="mb-6 text-sm text-muted">Browse open jobs matching your trade or skills.</p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchBar placeholder="Search by location…" defaultValue={location} onSearch={setLocation} />
      </div>

      {categories && categories.length > 0 && (
        <CategoryFilter categories={categories} active={category} onChange={setCategory} />
      )}

      {jobs.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : jobs.isError ? (
        <ErrorState message={jobs.error?.message} onRetry={() => jobs.refetch()} />
      ) : (jobs.data?.data || []).length === 0 ? (
        <EmptyState icon={Search} title="No jobs found" description="Try a different category or location." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.data!.data.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FindJobsPage() {
  return (
    <Suspense fallback={null}>
      <FindJobsContent />
    </Suspense>
  );
}
