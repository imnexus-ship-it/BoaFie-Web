'use client';

import { useRouter } from 'next/navigation';
import { MapPin, Briefcase } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { StarRating } from '@/components/ui/StarRating';
import { formatCurrency } from '@/lib/utils/currency';
import { timeAgo } from '@/lib/utils/date';
import { useArtisan } from '@/lib/api/hooks/useArtisans';
import { useFreelancer } from '@/lib/api/hooks/useFreelancers';
import { useConversations, useCreateConversation } from '@/lib/api/hooks/useMessaging';
import { useWorkerReviews } from '@/lib/api/hooks/useReviews';
import { useAuthStore } from '@/lib/store/auth-store';

const MESSAGES_BASE: Record<string, string> = {
  client: '/messages',
  artisan: '/worker/messages',
  freelancer: '/worker/messages',
};

export default function WorkerProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const conversations = useConversations();
  const createConversation = useCreateConversation();

  // Profile IDs aren't namespaced by type in the URL, so try artisan first,
  // fall back to freelancer. (A combined /workers/:id lookup on the API would
  // remove this — noted as a good follow-up endpoint.)
  const artisan = useArtisan(id);
  const freelancer = useFreelancer(artisan.isError ? id : undefined);
  const reviews = useWorkerReviews(artisan.data?.user_id ?? freelancer.data?.user_id);

  if (artisan.isLoading || (artisan.isError && freelancer.isLoading)) return <PageSpinner />;

  const worker = artisan.data || freelancer.data;
  if (!worker) return <ErrorState message="Worker not found" />;

  const messagesBase = currentUser ? MESSAGES_BASE[currentUser.role] : undefined;

  const handleContact = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    const workerUserId = worker.user_id;
    const existing = conversations.data?.find((c) => c.participant_ids.includes(workerUserId));
    if (existing) {
      router.push(`${messagesBase}/${existing.id}`);
      return;
    }
    const conversation = await createConversation.mutateAsync({ participant_ids: [workerUserId] });
    router.push(`${messagesBase}/${conversation.id}`);
  };

  const isArtisan = !!artisan.data;
  const name = worker.users?.full_name || 'BoaFie worker';
  const heading = isArtisan ? (worker as any).trade_category : (worker as any).title;
  const verified = worker.users?.status === 'active';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <Card>
        <CardBody className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar src={worker.users?.avatar_url} name={name} size={72} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-head text-xl font-bold text-charcoal">{name}</h1>
              {verified && <Badge variant="green">Verified</Badge>}
            </div>
            <p className="mt-1 capitalize text-muted">{heading}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
              {worker.location_text && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {worker.location_text}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" /> {worker.total_jobs_done} jobs completed
              </span>
              {!!reviews.data?.count && (
                <span className="flex items-center gap-1.5">
                  <StarRating value={reviews.data.average_rating ?? 0} size={14} />
                  {reviews.data.average_rating?.toFixed(1)} ({reviews.data.count})
                </span>
              )}
            </div>
            {worker.ai_bio && <p className="mt-4 text-sm text-charcoal">{worker.ai_bio}</p>}
          </div>
          <div className="text-right">
            {worker.hourly_rate_ghs && (
              <p className="font-head text-xl font-bold text-green">{formatCurrency(worker.hourly_rate_ghs)}/hr</p>
            )}
            {(!currentUser || messagesBase) && (
              <Button className="mt-3" loading={createConversation.isPending} onClick={handleContact}>
                Contact
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {!!reviews.data?.items.length && (
        <Card className="mt-6">
          <CardBody>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="font-head text-base font-semibold text-charcoal">Reviews</h2>
              <StarRating value={reviews.data.average_rating ?? 0} size={16} />
              <span className="text-sm text-muted">
                {reviews.data.average_rating?.toFixed(1)} ({reviews.data.count} review{reviews.data.count === 1 ? '' : 's'})
              </span>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {reviews.data.items.map((r) => (
                <div key={r.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <Avatar src={r.reviewer?.avatar_url} name={r.reviewer?.full_name} size={36} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-charcoal">{r.reviewer?.full_name || 'BoaFie user'}</p>
                      <StarRating value={r.rating} size={12} />
                      <span className="text-xs text-muted">{timeAgo(r.created_at)}</span>
                    </div>
                    {r.comment && <p className="mt-1 text-sm text-charcoal">{r.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
