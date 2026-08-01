'use client';

import { useState } from 'react';
import { Clock, Globe2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Textarea, Input } from '@/components/ui';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatBudgetRange } from '@/lib/utils/currency';
import { timeAgo } from '@/lib/utils/date';
import { useJob } from '@/lib/api/hooks/useJobs';
import { useSubmitProposal } from '@/lib/api/hooks/useProposals';
import { useAuthStore } from '@/lib/store/auth-store';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: job, isLoading, isError, error, refetch } = useJob(id);
  const { user } = useAuthStore();
  const submitProposal = useSubmitProposal(id);

  const [coverLetter, setCoverLetter] = useState('');
  const [rate, setRate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (isLoading) return <PageSpinner />;
  if (isError || !job) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  const canPropose = user && (user.role === 'artisan' || user.role === 'freelancer');

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-head text-xl font-bold text-charcoal">{job.title}</h1>
            {job.urgency === 'emergency' && <Badge variant="danger">Urgent</Badge>}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <span className="capitalize">{job.category}</span>
            {job.location_text && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {job.location_text}
              </span>
            )}
            {job.is_diaspora_job && (
              <span className="flex items-center gap-1 text-gold">
                <Globe2 className="h-4 w-4" /> Diaspora job
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> Posted {timeAgo(job.created_at)}
            </span>
          </div>

          <p className="whitespace-pre-line text-sm text-charcoal">{job.description}</p>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-head text-lg font-bold text-green">
              {formatBudgetRange(job.budget_min_ghs, job.budget_max_ghs, job.currency)}
            </span>
            <span className="text-xs text-muted">{job.proposal_count || 0} proposals so far</span>
          </div>
        </CardBody>
      </Card>

      {canPropose && job.status === 'open' && (
        <Card className="mt-6">
          <CardBody>
            <h2 className="mb-4 font-head text-base font-semibold text-charcoal">Submit a proposal</h2>
            {submitted ? (
              <p className="rounded-lg bg-green-3 p-4 text-sm text-green">Your proposal has been submitted.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitProposal.mutate(
                    { cover_letter: coverLetter, proposed_rate: Number(rate) },
                    { onSuccess: () => setSubmitted(true) },
                  );
                }}
                className="flex flex-col gap-4"
              >
                <Textarea
                  label="Cover letter"
                  required
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're a great fit for this job."
                />
                <Input
                  label="Your proposed rate (GHS)"
                  type="number"
                  required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
                {submitProposal.isError && <p className="text-sm text-red-600">{submitProposal.error.message}</p>}
                <Button type="submit" loading={submitProposal.isPending}>
                  Submit proposal
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
