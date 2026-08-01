'use client';

import { MapPin, Briefcase } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatCurrency } from '@/lib/utils/currency';
import { useArtisan } from '@/lib/api/hooks/useArtisans';
import { useFreelancer } from '@/lib/api/hooks/useFreelancers';

export default function WorkerProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Profile IDs aren't namespaced by type in the URL, so try artisan first,
  // fall back to freelancer. (A combined /workers/:id lookup on the API would
  // remove this — noted as a good follow-up endpoint.)
  const artisan = useArtisan(id);
  const freelancer = useFreelancer(artisan.isError ? id : undefined);

  if (artisan.isLoading || (artisan.isError && freelancer.isLoading)) return <PageSpinner />;

  const worker = artisan.data || freelancer.data;
  if (!worker) return <ErrorState message="Worker not found" />;

  const isArtisan = !!artisan.data;
  const name = worker.users?.full_name || 'BoaFie worker';
  const heading = isArtisan ? (worker as any).trade_category : (worker as any).title;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <Card>
        <CardBody className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar src={worker.users?.avatar_url} name={name} size={72} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-head text-xl font-bold text-charcoal">{name}</h1>
              <Badge variant="green">Verified</Badge>
            </div>
            <p className="mt-1 capitalize text-muted">{heading}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
              {worker.location_text && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {worker.location_text}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" /> {worker.total_jobs_done} jobs completed
              </span>
            </div>
            {worker.ai_bio && <p className="mt-4 text-sm text-charcoal">{worker.ai_bio}</p>}
          </div>
          <div className="text-right">
            {worker.hourly_rate_ghs && (
              <p className="font-head text-xl font-bold text-green">{formatCurrency(worker.hourly_rate_ghs)}/hr</p>
            )}
            <Button className="mt-3">Contact</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
