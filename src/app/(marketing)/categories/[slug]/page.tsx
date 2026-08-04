'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Star, Users } from 'lucide-react';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { WorkerCard, WorkerLike } from '@/components/marketplace/WorkerCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useArtisans } from '@/lib/api/hooks/useArtisans';
import { useFreelancers } from '@/lib/api/hooks/useFreelancers';
import { categoryIcon } from '@/lib/constants/categoryIcons';
import { CATEGORY_COMMON_SERVICES, CATEGORY_SAFETY_TIPS } from '@/lib/constants/categoryContent';

const RATING_OPTIONS = [
  { value: '', label: 'Any rating' },
  { value: '4.5', label: '4.5+ stars' },
  { value: '4', label: '4+ stars' },
  { value: '3', label: '3+ stars' },
];

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const category = categories?.find((c) => c.slug === slug);

  const [location, setLocation] = useState('');
  const [ratingMin, setRatingMin] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const isFreelancerCategory = category?.type === 'freelancer';

  const artisans = useArtisans({
    category: !isFreelancerCategory ? slug : undefined,
    location: location || undefined,
    rating_min: ratingMin ? Number(ratingMin) : undefined,
    verified: verifiedOnly || undefined,
  });
  const freelancers = useFreelancers({
    skills: isFreelancerCategory ? slug : undefined,
    rating_min: ratingMin ? Number(ratingMin) : undefined,
    verified: verifiedOnly || undefined,
  });

  const active = isFreelancerCategory ? freelancers : artisans;
  const workers = useMemo<WorkerLike[]>(() => {
    if (isFreelancerCategory) {
      return (freelancers.data?.data || []).map((w) => ({ ...w, kind: 'freelancer' as const }));
    }
    return (artisans.data?.data || []).map((w) => ({ ...w, kind: 'artisan' as const }));
  }, [artisans.data, freelancers.data, isFreelancerCategory]);

  if (categoriesLoading) return <PageSpinner />;
  if (!categoriesLoading && categories && !category) return notFound();
  if (!category) return null;

  const Icon = categoryIcon(category.icon);
  const commonServices = CATEGORY_COMMON_SERVICES[slug] ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-lg bg-gradient-to-br from-navy to-green p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Icon className="h-6 w-6 text-gold-2" />
          </div>
          <div>
            <h1 className="font-head text-2xl font-bold">{category.name}</h1>
            {category.description && <p className="mt-1 max-w-xl text-sm text-white/70">{category.description}</p>}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link href={isFreelancerCategory ? '/explore?tab=freelancers' : '/post-job'}>
            <Button className="!bg-gold hover:!bg-gold-2">
              {isFreelancerCategory ? 'Browse professionals' : 'Post a job'}
            </Button>
          </Link>
          <Link href="/signup?role=artisan">
            <Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
              Offer this service
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Professionals + filters */}
        <div>
          <h2 className="mb-3 font-head text-lg font-semibold text-charcoal">Available professionals</h2>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <SearchBar placeholder="Filter by location…" defaultValue={location} onSearch={setLocation} />
            <div className="w-full sm:w-48">
              <Select label="Rating" value={ratingMin} onChange={(e) => setRatingMin(e.target.value)}>
                {RATING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
            <label className="flex items-center gap-2 pb-2.5 text-sm text-charcoal sm:pb-3">
              <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
              Verified only
            </label>
          </div>

          {active.isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : active.isError ? (
            <ErrorState message={active.error?.message} onRetry={() => active.refetch()} />
          ) : workers.length === 0 ? (
            <EmptyState icon={Users} title="No professionals found" description="Try widening your filters." />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {workers.map((w) => (
                <WorkerCard key={w.id} worker={w} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: guidance */}
        <div className="flex flex-col gap-5">
          <Card>
            <CardBody>
              <h3 className="mb-2 font-head text-sm font-semibold text-charcoal">Pricing & quotations</h3>
              <p className="text-sm text-muted">
                {isFreelancerCategory
                  ? 'Most professionals in this category charge hourly. Message them directly to request a quotation for your specific project before hiring.'
                  : 'Professionals in this category typically charge hourly, daily, or a fixed price depending on the job. Request a quotation through messaging before agreeing on a contract — nothing is billed until you accept a proposal.'}
              </p>
            </CardBody>
          </Card>

          {commonServices.length > 0 && (
            <Card>
              <CardBody>
                <h3 className="mb-2 font-head text-sm font-semibold text-charcoal">Common services</h3>
                <ul className="flex flex-col gap-1.5">
                  {commonServices.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-charcoal">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green" /> {s}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          <Card className="border-green/20 bg-green-3/30">
            <CardBody>
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green" />
                <h3 className="font-head text-sm font-semibold text-charcoal">Hiring safely</h3>
              </div>
              <ul className="flex flex-col gap-2">
                {CATEGORY_SAFETY_TIPS.map((tip) => (
                  <li key={tip} className="text-xs text-charcoal">
                    {tip}
                  </li>
                ))}
              </ul>
              <Link href="/trust-safety" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-green hover:underline">
                Read more about trust & safety
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gold-2" />
              <p className="text-xs text-muted">
                Ratings shown here come from real, verified reviews left after a job is marked complete.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
