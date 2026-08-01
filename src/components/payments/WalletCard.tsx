'use client';

import { Wallet } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/currency';

export function WalletCard({
  balance,
  pending,
  lifetime,
  currency = 'GHS',
}: {
  balance: number;
  pending: number;
  lifetime: number;
  currency?: string;
}) {
  return (
    <Card className="bg-green text-white">
      <CardBody>
        <div className="mb-4 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span className="font-head text-sm font-semibold">Wallet balance</span>
        </div>
        <p className="font-head text-3xl font-bold">{formatCurrency(balance, currency)}</p>
        <div className="mt-4 flex gap-6 text-sm text-white/80">
          <span>Pending: {formatCurrency(pending, currency)}</span>
          <span>Lifetime: {formatCurrency(lifetime, currency)}</span>
        </div>
      </CardBody>
    </Card>
  );
}
