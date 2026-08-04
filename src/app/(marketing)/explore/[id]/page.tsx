'use client';

import { useRouter } from 'next/navigation';
import { Award, Bookmark, Briefcase, Clock, ExternalLink, MapPin, ShieldCheck } from 'lucide-react';
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
import { usePublicPortfolio } from '@/lib/api/hooks/usePortfolio';
import { useSavedProfessionals, useSaveProfessional, useUnsaveProfessional } from '@/lib/api/hooks/useSavedProfessionals';
import { useAuthStore } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils/cn';

const MESSAGES_BASE: Record<string, string> = {
  client: '/messages',
  artisan: '/worker/messages',
  freelancer: '/worker/messages',
};

const AVAILABILITY_LABEL: Record<string, { label: string; variant: 'green' | 'gold' | 'muted' }> = {
  available: { label: 'Available now', variant: 'green' },
  busy: { label: 'Currently busy', variant: 'gold' },
  unavailable: { label: 'Unavailable', variant: 'muted' },
};

function rateLabel(worker: any): string | null {
  if (worker.pricing_model === 'hourly' && worker.hourly_rate_ghs) return `${formatCurrency(worker.hourly_rate_ghs)}/hr`;
  if (worker.pricing_model === 'daily' && worker.daily_rate_ghs) return `${formatCurrency(worker.daily_rate_ghs)}/day`;
  if (worker.pricing_model === 'fixed' && worker.fixed_rate_min_ghs) return `From ${formatCurrency(worker.fixed_rate_min_ghs)}`;
  return null;
}

export default function WorkerProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const conversations = useConversations();
  const createConversation = useCreateConversation();
  const isClient = currentUser?.role === 'client';
  const savedProfessionals = useSavedProfessionals();
  const saveProfessional = useSaveProfessional();
  const unsaveProfessional = useUnsaveProfessional();

  // Profile IDs aren't namespaced by type in the URL, so try artisan first,
  // fall back to freelancer. (A combined /workers/:id lookup on the API would
  // remove this — noted as a good follow-up endpoint.)
  const artisan = useArtisan(id);
  const freelancer = useFreelancer(artisan.isError ? id : undefined);
  const reviews = useWorkerReviews(artisan.data?.user_id ?? freelancer.data?.user_id);
  const portfolio = usePublicPortfolio(artisan.data?.user_id ?? freelancer.data?.user_id);

  if (artisan.isLoading || (artisan.isError && freelancer.isLoading)) return <PageSpinner />;

  const worker = artisan.data || (freelancer.data as any);
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
  const heading = isArtisan ? worker.trade_category : worker.title;
  const verified = !!worker.verified;
  const skills: string[] = worker.skills || worker.trade_subcategories || [];
  const availability = AVAILABILITY_LABEL[worker.availability as string];
  const rate = rateLabel(worker);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <Card>
        <CardBody className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar src={worker.users?.avatar_url} name={name} size={72} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-head text-xl font-bold text-charcoal">{name}</h1>
              {verified && <Badge variant="green">Verified</Badge>}
              {availability && <Badge variant={availability.variant}>{availability.label}</Badge>}
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

            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="rounded-pill bg-black/5 px-2.5 py-1 text-xs text-charcoal">
                    {s}
                  </span>
                ))}
              </div>
            )}

            {isArtisan && worker.trade_cert_verified && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-green">
                <Award className="h-3.5 w-3.5" /> Trade certificate verified
              </p>
            )}
            {!isArtisan && (worker.portfolio_url || worker.linkedin_url || worker.github_url) && (
              <div className="mt-3 flex flex-wrap gap-3">
                {worker.portfolio_url && (
                  <a href={worker.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-green hover:underline">
                    <ExternalLink className="h-3 w-3" /> Portfolio
                  </a>
                )}
                {worker.linkedin_url && (
                  <a href={worker.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-green hover:underline">
                    <ExternalLink className="h-3 w-3" /> LinkedIn
                  </a>
                )}
                {worker.github_url && (
                  <a href={worker.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-green hover:underline">
                    <ExternalLink className="h-3 w-3" /> GitHub
                  </a>
                )}
              </div>
            )}

            {worker.ai_bio && <p className="mt-4 text-sm text-charcoal">{worker.ai_bio}</p>}
          </div>

          <div className="w-full text-right sm:w-auto">
            {rate && <p className="font-head text-xl font-bold text-green">{rate}</p>}

            {/* Trust info sits right next to the primary action, not just up top. */}
            <div className="mt-2 flex flex-col items-end gap-1">
              {verified && (
                <span className="flex items-center gap-1 text-xs font-medium text-green">
                  <ShieldCheck className="h-3.5 w-3.5" /> Identity verified
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock className="h-3.5 w-3.5" /> Escrow-protected payments
              </span>
            </div>

            {(!currentUser || messagesBase) && (
              <Button className="mt-3 w-full sm:w-auto" loading={createConversation.isPending} onClick={handleContact}>
                Message to request a quote
              </Button>
            )}

            {isClient && (() => {
              const saved = savedProfessionals.data?.some((s) => s.worker_user_id === worker.user_id);
              return (
                <button
                  className={cn(
                    'mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium sm:w-auto',
                    saved ? 'border-gold bg-gold-3 text-gold' : 'border-border text-muted hover:border-charcoal hover:text-charcoal',
                  )}
                  disabled={saveProfessional.isPending || unsaveProfessional.isPending}
                  onClick={() =>
                    saved ? unsaveProfessional.mutate(worker.user_id) : saveProfessional.mutate(worker.user_id)
                  }
                >
                  <Bookmark className={cn('h-3.5 w-3.5', saved && 'fill-gold text-gold')} />
                  {saved ? 'Saved' : 'Save professional'}
                </button>
              );
            })()}
          </div>
        </CardBody>
      </Card>

      {!!portfolio.data?.length && (
        <Card className="mt-6">
          <CardBody>
            <h2 className="mb-4 font-head text-base font-semibold text-charcoal">Portfolio</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {portfolio.data.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-lg border border-border">
                  {item.media_urls?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.media_urls[0]} alt={item.title} className="h-32 w-full object-cover" />
                  )}
                  <div className="p-2.5">
                    <p className="truncate text-xs font-medium text-charcoal">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

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
