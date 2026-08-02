'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { EscrowPanel } from '@/components/escrow/EscrowPanel';
import { formatCurrency } from '@/lib/utils/currency';
import {
  useApproveMilestone,
  useContract,
  useCreateMilestone,
  useMilestones,
  useRejectMilestone,
  useStartMilestone,
  useSubmitMilestone,
} from '@/lib/api/hooks/useContracts';
import { Milestone } from '@/lib/api/types';
import { useAuthStore } from '@/lib/store/auth-store';

const MILESTONE_ICON: Record<string, typeof CheckCircle2> = {
  approved: CheckCircle2,
  submitted: Clock,
  in_progress: Clock,
  pending: Circle,
  rejected: Circle,
};

function MilestoneRow({
  milestone,
  contractId,
  isWorker,
  isClient,
}: {
  milestone: Milestone;
  contractId: string;
  isWorker: boolean;
  isClient: boolean;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const start = useStartMilestone(contractId);
  const submit = useSubmitMilestone(contractId);
  const approve = useApproveMilestone(contractId);
  const reject = useRejectMilestone(contractId);

  const Icon = MILESTONE_ICON[milestone.status] || Circle;
  const done = milestone.status === 'approved';

  return (
    <div className="border-b border-border py-3 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className={done ? 'h-5 w-5 shrink-0 text-green' : 'h-5 w-5 shrink-0 text-muted'} />
        <div className="flex-1">
          <p className="text-sm font-medium text-charcoal">{milestone.title}</p>
          {milestone.description && <p className="text-xs text-muted">{milestone.description}</p>}
        </div>
        <span className="font-head text-sm font-semibold text-charcoal">{formatCurrency(milestone.amount_ghs)}</span>
        <Badge variant={done ? 'green' : 'muted'} className="ml-2">
          {milestone.status.replace('_', ' ')}
        </Badge>
      </div>

      {isWorker && milestone.status === 'pending' && (
        <div className="ml-8 mt-2">
          <Button size="sm" variant="secondary" loading={start.isPending} onClick={() => start.mutate(milestone.id)}>
            Start milestone
          </Button>
        </div>
      )}

      {isWorker && milestone.status === 'in_progress' && (
        <div className="ml-8 mt-3 flex flex-col gap-2">
          {submitting ? (
            <>
              <Textarea
                rows={2}
                placeholder="Describe what you've completed…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  loading={submit.isPending}
                  onClick={() =>
                    submit.mutate(
                      { id: milestone.id, submission_note: note },
                      { onSuccess: () => setSubmitting(false) },
                    )
                  }
                >
                  Submit for approval
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSubmitting(false)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => setSubmitting(true)}>
              Submit milestone
            </Button>
          )}
        </div>
      )}

      {milestone.status === 'submitted' && milestone.submission_note && (
        <p className="ml-8 mt-2 rounded-lg bg-black/[0.03] p-3 text-xs text-charcoal">{milestone.submission_note}</p>
      )}

      {isClient && milestone.status === 'submitted' && (
        <div className="ml-8 mt-3 flex flex-col gap-2">
          {rejecting ? (
            <>
              <Textarea
                rows={2}
                placeholder="What needs to change?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  loading={reject.isPending}
                  onClick={() =>
                    reject.mutate({ id: milestone.id, feedback }, { onSuccess: () => setRejecting(false) })
                  }
                >
                  Send feedback
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setRejecting(false)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" loading={approve.isPending} onClick={() => approve.mutate(milestone.id)}>
                Approve & release funds
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setRejecting(true)}>
                Request changes
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddMilestoneForm({ contractId }: { contractId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const createMilestone = useCreateMilestone(contractId);

  if (!open) {
    return (
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        Add milestone
      </Button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createMilestone.mutate(
          {
            title,
            description: description || undefined,
            amount_ghs: Number(amount),
            due_date: dueDate || undefined,
          },
          {
            onSuccess: () => {
              setTitle('');
              setDescription('');
              setAmount('');
              setDueDate('');
              setOpen(false);
            },
          },
        );
      }}
      className="flex flex-col gap-3 rounded-lg border border-border p-4"
    >
      <Input
        label="Milestone title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Frame and cut wood"
      />
      <Textarea
        label="Description (optional)"
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Amount (GHS)"
          type="number"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          label="Due date (optional)"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      {createMilestone.isError && <p className="text-sm text-red-600">{createMilestone.error.message}</p>}
      <div className="flex gap-2">
        <Button size="sm" type="submit" loading={createMilestone.isPending}>
          Add milestone
        </Button>
        <Button size="sm" variant="ghost" type="button" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function ContractDetail({ contractId }: { contractId: string }) {
  const contract = useContract(contractId);
  const milestones = useMilestones(contractId);
  const currentUser = useAuthStore((s) => s.user);

  if (contract.isLoading) return <PageSpinner />;
  if (contract.isError || !contract.data)
    return <ErrorState message={contract.error?.message} onRetry={() => contract.refetch()} />;

  const c = contract.data;
  const isWorker = currentUser?.id === c.worker_id;
  const isClient = currentUser?.id === c.client_id;

  const totalMilestones = (milestones.data || []).reduce((sum, m) => sum + Number(m.amount_ghs), 0);
  const releasedMilestones = (milestones.data || [])
    .filter((m) => m.status === 'approved')
    .reduce((sum, m) => sum + Number(m.amount_ghs), 0);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={c.worker?.avatar_url} name={c.worker?.full_name} size={44} />
            <div>
              <h1 className="font-head text-lg font-bold text-charcoal">{c.title}</h1>
              <p className="text-sm text-muted">
                {c.client?.full_name} ↔ {c.worker?.full_name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-head text-lg font-bold text-green">{formatCurrency(c.agreed_amount, c.currency)}</p>
            <Badge variant="gold">{c.status.replace('_', ' ')}</Badge>
          </div>
        </CardBody>
      </Card>

      <EscrowPanel
        totalAmount={c.agreed_amount}
        heldAmount={Math.max(0, totalMilestones - releasedMilestones)}
        releasedAmount={releasedMilestones}
        currency={c.currency}
      />

      <Card>
        <CardBody>
          <h2 className="mb-1 font-head text-base font-semibold text-charcoal">Milestones</h2>
          {milestones.isLoading ? null : milestones.isError ? (
            <div className="flex items-center justify-between py-4">
              <p className="text-sm text-red-600">Couldn't load milestones.</p>
              <Button variant="secondary" size="sm" onClick={() => milestones.refetch()}>
                Retry
              </Button>
            </div>
          ) : (milestones.data || []).length === 0 ? (
            <p className="py-4 text-sm text-muted">No milestones set up yet for this contract.</p>
          ) : (
            <div className="mt-2">
              {milestones.data!.map((m) => (
                <MilestoneRow
                  key={m.id}
                  milestone={m}
                  contractId={contractId}
                  isWorker={!!isWorker}
                  isClient={!!isClient}
                />
              ))}
            </div>
          )}

          {isClient && c.status === 'in_progress' && (
            <div className="mt-4">
              <AddMilestoneForm contractId={contractId} />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
