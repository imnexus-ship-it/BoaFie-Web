'use client';

import { useState } from 'react';
import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Badge, BadgeProps } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { formatCurrency } from '@/lib/utils/currency';
import { useRaiseDispute } from '@/lib/api/hooks/useContracts';
import { Contract, Dispute, Escrow, EscrowStatus, Milestone } from '@/lib/api/types';

const ACTIVE_DISPUTE_STATUSES: Dispute['status'][] = ['open', 'under_review', 'escalated'];

const ESCROW_STATUS_LABEL: Record<EscrowStatus, string> = {
  held: 'Held in escrow',
  released: 'Fully released',
  refunded: 'Refunded',
  disputed: 'Disputed',
};

const ESCROW_STATUS_VARIANT: Record<EscrowStatus, BadgeProps['variant']> = {
  held: 'gold',
  released: 'green',
  refunded: 'muted',
  disputed: 'danger',
};

function getRequiredAction({
  contract,
  escrow,
  milestones,
  activeDispute,
  isClient,
}: {
  contract: Contract;
  escrow: Escrow | null;
  milestones: Milestone[];
  activeDispute: Dispute | null;
  isClient: boolean;
}): string {
  if (activeDispute) {
    return "A dispute is open on this contract — an admin will review it. Milestone approvals and completion are paused until it's resolved.";
  }
  if (!escrow) return isClient ? 'Fund escrow to start this contract.' : 'Waiting for the client to fund escrow.';
  if (escrow.status === 'refunded') return 'This contract was refunded — the held balance was returned to the client.';
  if (contract.status === 'completed' && escrow.status === 'released') {
    return 'This contract is complete and every dollar has been released. Nothing further to do.';
  }

  if (milestones.length === 0) {
    if (contract.status === 'completed') {
      return "Contract marked complete but funds are still held — this shouldn't happen; contact support.";
    }
    return isClient
      ? 'No milestones set up yet. Add milestones to release funds in stages, or mark the contract complete to release the full amount at once.'
      : 'Waiting for the client to add milestones or mark the contract complete.';
  }

  const active = milestones
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .find((m) => m.status !== 'approved');

  if (!active) {
    return escrow.held_amount > 0
      ? isClient
        ? 'All milestones are approved. Mark the contract complete to release the remaining balance.'
        : 'All milestones are approved — waiting for the client to complete the contract and release the remaining balance.'
      : 'All milestones are approved and funds are fully released.';
  }

  const amount = formatCurrency(active.amount_ghs, contract.currency);
  switch (active.status) {
    case 'pending':
      return isClient
        ? `Waiting for the professional to start "${active.title}".`
        : `Start "${active.title}" (${amount}) to begin work.`;
    case 'in_progress':
      return isClient
        ? `Waiting for the professional to submit "${active.title}" for review.`
        : `Submit "${active.title}" once the work is ready for review.`;
    case 'submitted':
      return isClient
        ? `Review "${active.title}" and approve to release ${amount}.`
        : `Waiting for the client to review "${active.title}".`;
    default:
      return '';
  }
}

function DisputeButton({ contractId, disabled }: { contractId: string; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const raiseDispute = useRaiseDispute(contractId);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="!text-red-600 hover:!bg-red-50"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <ShieldAlert className="h-4 w-4" /> Raise a dispute
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Raise a dispute">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            raiseDispute.mutate(
              { reason, description },
              {
                onSuccess: () => {
                  setOpen(false);
                  setReason('');
                  setDescription('');
                },
              },
            );
          }}
          className="flex flex-col gap-3"
        >
          <p className="text-sm text-muted">
            This pauses milestone approvals and contract completion until an admin reviews it. Only raise a dispute
            if you can't resolve the issue directly with the other party.
          </p>
          <Input
            label="Reason"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Work not delivered as agreed"
          />
          <Textarea
            label="What happened?"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {raiseDispute.isError && <p className="text-sm text-red-600">{raiseDispute.error.message}</p>}
          <Button type="submit" variant="danger" loading={raiseDispute.isPending}>
            Submit dispute
          </Button>
        </form>
      </Modal>
    </>
  );
}

export function EscrowPanel({
  contract,
  milestones,
  disputes,
  isClient,
}: {
  contract: Contract;
  milestones: Milestone[];
  disputes: Dispute[];
  isClient: boolean;
}) {
  const escrow = contract.escrow ?? null;
  const currency = contract.currency;
  const activeDispute = disputes.find((d) => ACTIVE_DISPUTE_STATUSES.includes(d.status)) ?? null;

  const totalAmount = escrow?.total_amount ?? contract.agreed_amount;
  const releasedAmount = escrow?.released_amount ?? 0;
  const heldAmount = escrow?.held_amount ?? 0;
  const refundedAmount = escrow?.refunded_amount ?? 0;
  // What has actually been put into escrow — today that's always the full
  // total (funded up-front, see ProposalsService.accept), but computed
  // this way rather than aliased to totalAmount so it stays correct if
  // partial/staged funding is ever introduced.
  const fundedAmount = releasedAmount + heldAmount + refundedAmount;
  const milestoneTotal = milestones.reduce((sum, m) => sum + Number(m.amount_ghs), 0);

  const pctReleased = totalAmount ? (releasedAmount / totalAmount) * 100 : 0;
  const pctHeld = totalAmount ? (heldAmount / totalAmount) * 100 : 0;
  const pctRefunded = totalAmount ? (refundedAmount / totalAmount) * 100 : 0;

  const requiredAction = getRequiredAction({ contract, escrow, milestones, activeDispute, isClient });
  const canRaiseDispute = !activeDispute && escrow?.status !== 'refunded';

  return (
    <Card className={activeDispute ? '!border-red-200' : undefined}>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green" />
            <h3 className="font-head text-sm font-semibold text-charcoal">Escrow protection</h3>
          </div>
          <Badge variant={escrow ? ESCROW_STATUS_VARIANT[escrow.status] : 'muted'}>
            {escrow ? ESCROW_STATUS_LABEL[escrow.status] : 'Not yet funded'}
          </Badge>
        </div>

        {/* Distinct colors + a legend for each segment — held money should never read as "already released" at a glance. */}
        <div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-pill bg-black/5">
            {pctReleased > 0 && <div className="h-full bg-green" style={{ width: `${pctReleased}%` }} />}
            {pctHeld > 0 && <div className="h-full bg-gold" style={{ width: `${pctHeld}%` }} />}
            {pctRefunded > 0 && <div className="h-full bg-muted" style={{ width: `${pctRefunded}%` }} />}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green" /> Released to professional
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gold" /> Held — not yet released
            </span>
            {refundedAmount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-muted" /> Refunded to client
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="font-head text-lg font-bold text-charcoal">{formatCurrency(totalAmount, currency)}</p>
            <p className="text-[11px] text-muted">Total project amount</p>
          </div>
          <div>
            <p className="font-head text-lg font-bold text-charcoal">{formatCurrency(fundedAmount, currency)}</p>
            <p className="text-[11px] text-muted">Amount funded</p>
          </div>
          <div>
            <p className="font-head text-lg font-bold text-green">{formatCurrency(releasedAmount, currency)}</p>
            <p className="text-[11px] text-muted">Released</p>
          </div>
          <div>
            <p className="font-head text-lg font-bold text-gold">{formatCurrency(heldAmount, currency)}</p>
            <p className="text-[11px] text-muted">Remaining balance (held)</p>
          </div>
        </div>

        {milestones.length > 0 && (
          <p className="text-xs text-muted">
            Milestone allocation: {formatCurrency(milestoneTotal, currency)} of {formatCurrency(totalAmount, currency)}{' '}
            allocated across {milestones.length} milestone{milestones.length === 1 ? '' : 's'}.
          </p>
        )}

        {activeDispute && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-red-700">Dispute open: {activeDispute.reason}</p>
              <p className="mt-0.5 text-xs text-red-600">{activeDispute.description}</p>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-black/[0.03] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Required action</p>
          <p className="mt-0.5 text-sm text-charcoal">{requiredAction}</p>
        </div>

        {canRaiseDispute && (
          <div>
            <DisputeButton contractId={contract.id} />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
