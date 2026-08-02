'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { ProposalCard } from '@/components/jobs/ProposalCard';
import { WorkerCard, WorkerLike } from '@/components/marketplace/WorkerCard';
import { formatBudgetRange } from '@/lib/utils/currency';
import { useJob } from '@/lib/api/hooks/useJobs';
import { useJobProposals } from '@/lib/api/hooks/useProposals';
import { useAcceptProposal, useRejectProposal } from '@/lib/api/hooks/useProposals';
import { useWorkerMatches } from '@/lib/api/hooks/useMatching';

export default function MyJobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const job = useJob(id);
  const proposals = useJobProposals(id);
  const matches = useWorkerMatches(id);
  const accept = useAcceptProposal();
  const reject = useRejectProposal();

  if (job.isLoading) return <PageSpinner />;
  if (job.isError || !job.data) return <ErrorState message={job.error?.message} onRetry={() => job.refetch()} />;

  return (
    <div>
      <Card>
        <CardBody className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-head text-xl font-bold text-charcoal">{job.data.title}</h1>
            <p className="mt-1 text-sm text-muted">
              {formatBudgetRange(job.data.budget_min_ghs, job.data.budget_max_ghs, job.data.currency)}
            </p>
          </div>
          <Badge variant="gold">{job.data.status.replace('_', ' ')}</Badge>
        </CardBody>
      </Card>

      <h2 className="mb-4 mt-8 font-head text-lg font-semibold text-charcoal">Proposals ({proposals.data?.length || 0})</h2>

      {proposals.isLoading ? null : proposals.isError ? (
        <ErrorState message={proposals.error?.message} onRetry={() => proposals.refetch()} />
      ) : (proposals.data || []).length === 0 ? (
        <EmptyState icon={Users} title="No proposals yet" description="Check back soon — proposals will show up here." />
      ) : (
        <div className="flex flex-col gap-4">
          {proposals.data!.map((p) => (
            <ProposalCard
              key={p.id}
              proposal={p}
              actionable
              onAccept={() => accept.mutate(p.id)}
              onReject={() => reject.mutate(p.id)}
            />
          ))}
        </div>
      )}

      {job.data.status === 'open' && (matches.data?.length ?? 0) > 0 && (
        <>
          <h2 className="mb-4 mt-8 font-head text-lg font-semibold text-charcoal">Recommended workers</h2>
          <p className="-mt-2 mb-4 text-sm text-muted">Ranked by fit for this job — category, location, and rate.</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {matches.data!.map((m) => (
              <WorkerCard
                key={m.profile.id}
                worker={{ ...m.profile, kind: m.type } as WorkerLike}
                verified={m.profile.users?.status === 'active'}
              />
            ))}
          </div>
        </>
      )}

      <div className="mt-6">
        <Link href={`/my-jobs/${id}/milestones`}>
          <Button variant="secondary" size="sm">
            View milestones
          </Button>
        </Link>
      </div>
    </div>
  );
}
