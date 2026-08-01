import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/currency';
import { ArtisanProfile, FreelancerProfile } from '@/lib/api/types';

export type WorkerLike =
  | (ArtisanProfile & { kind: 'artisan' })
  | (FreelancerProfile & { kind: 'freelancer' });

export function WorkerCard({ worker, verified }: { worker: WorkerLike; verified?: boolean }) {
  const href = worker.kind === 'artisan' ? `/explore/${worker.id}` : `/explore/${worker.id}`;
  const name = worker.users?.full_name || 'BoaFie worker';
  const heading = worker.kind === 'artisan' ? worker.trade_category : worker.title;
  const rate = worker.hourly_rate_ghs;
  const location = worker.kind === 'artisan' ? worker.location_text : worker.location_text;

  return (
    <Link href={href}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardBody className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={worker.users?.avatar_url} name={name} size={44} />
            <div className="min-w-0">
              <p className="truncate font-head text-sm font-semibold text-charcoal">{name}</p>
              <p className="truncate text-xs capitalize text-muted">{heading}</p>
            </div>
          </div>

          {location && (
            <p className="flex items-center gap-1 text-xs text-muted">
              <MapPin className="h-3 w-3" /> {location}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            {verified ? <Badge variant="green">Verified</Badge> : <Badge variant="muted">{worker.total_jobs_done} jobs</Badge>}
            {rate ? <span className="font-head text-sm font-semibold text-green">{formatCurrency(rate)}/hr</span> : null}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
