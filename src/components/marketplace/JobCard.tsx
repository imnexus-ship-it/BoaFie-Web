import Link from 'next/link';
import { Clock, Globe2, MapPin } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatBudgetRange } from '@/lib/utils/currency';
import { timeAgo } from '@/lib/utils/date';
import { Job } from '@/lib/api/types';

export function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardBody className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-head text-[15px] font-semibold leading-snug text-charcoal">{job.title}</h3>
            {job.urgency === 'emergency' && <Badge variant="danger">Urgent</Badge>}
          </div>

          <p className="line-clamp-2 text-sm text-muted">{job.description}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="capitalize">{job.category}</span>
            {job.location_text && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {job.location_text}
              </span>
            )}
            {job.is_diaspora_job && (
              <span className="flex items-center gap-1 text-gold">
                <Globe2 className="h-3 w-3" /> Diaspora
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {timeAgo(job.created_at)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-head text-sm font-semibold text-green">
              {formatBudgetRange(job.budget_min_ghs, job.budget_max_ghs, job.currency)}
            </span>
            <span className="text-xs text-muted">{job.proposal_count || 0} proposals</span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
