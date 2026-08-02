'use client';

import { ListChecks } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function JobMilestonesRedirectPage({ params }: { params: { id: string } }) {
  void params;
  // Milestones live under the contract created once a proposal is accepted —
  // see (client)/contracts/[id] for the live milestone tracker.
  return (
    <EmptyState
      icon={ListChecks}
      title="Milestones move to the contract"
      description="Once you accept a proposal, a contract is created — manage milestones from Contracts."
      action={
        <Link href="/contracts">
          <Button>Go to Contracts</Button>
        </Link>
      }
    />
  );
}
