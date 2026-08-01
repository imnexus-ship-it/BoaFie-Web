'use client';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/currency';
import { timeAgo } from '@/lib/utils/date';
import { Proposal } from '@/lib/api/types';

const STATUS_VARIANT: Record<string, 'green' | 'gold' | 'muted' | 'danger'> = {
  pending: 'gold',
  accepted: 'green',
  rejected: 'danger',
  withdrawn: 'muted',
};

export function ProposalCard({
  proposal,
  onAccept,
  onReject,
  actionable,
}: {
  proposal: Proposal;
  onAccept?: () => void;
  onReject?: () => void;
  actionable?: boolean;
}) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={proposal.worker?.avatar_url} name={proposal.worker?.full_name} size={40} />
            <div>
              <p className="font-head text-sm font-semibold text-charcoal">{proposal.worker?.full_name || 'Worker'}</p>
              <p className="text-xs text-muted">{timeAgo(proposal.created_at)}</p>
            </div>
          </div>
          <Badge variant={STATUS_VARIANT[proposal.status]}>{proposal.status}</Badge>
        </div>

        <p className="text-sm text-charcoal">{proposal.cover_letter}</p>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="font-head text-sm font-semibold text-green">
            {formatCurrency(proposal.proposed_rate)}
            {proposal.rate_type === 'hourly' ? '/hr' : ''}
          </span>
          {actionable && proposal.status === 'pending' && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={onReject}>
                Decline
              </Button>
              <Button size="sm" onClick={onAccept}>
                Accept & hire
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
