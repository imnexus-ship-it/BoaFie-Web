'use client';

import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { CategoryFilter } from '@/components/marketplace/CategoryFilter';
import { JobCard } from '@/components/marketplace/JobCard';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useJobs } from '@/lib/api/hooks/useJobs';

export default function JobsPage() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState('');
  const { data: categories } = useCategories();
  const jobs = useJobs({ category, location });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <h1 className="font-head text-2xl font-bold text-charcoal">Find work</h1>
      <p className="mb-6 text-sm text-muted">Open jobs from verified clients across Ghana and the diaspora.</p>

      <div className="mb-6">
        <SearchBar placeholder="Search by location…" onSearch={setLocation} />
      </div>

      {categories && <CategoryFilter categories={categories} active={category} onChange={setCategory} />}

      {jobs.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : jobs.isError ? (
        <ErrorState message={jobs.error?.message} onRetry={() => jobs.refetch()} />
      ) : (jobs.data?.data || []).length === 0 ? (
        <EmptyState icon={Briefcase} title="No open jobs" description="Check back soon, or try a different filter." />
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
