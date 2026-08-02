'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { WalletCard } from '@/components/payments/WalletCard';
import { TransactionList } from '@/components/payments/TransactionList';
import { useWallet, useWalletTransactions } from '@/lib/api/hooks/useWallet';

export default function ClientPaymentsPage() {
  const wallet = useWallet();
  const transactions = useWalletTransactions();

  if (wallet.isLoading) return <PageSpinner />;
  if (wallet.isError || !wallet.data) return <ErrorState message={wallet.error?.message} onRetry={() => wallet.refetch()} />;

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Payments</h1>
      <div className="mb-6 max-w-sm">
        <WalletCard
          balance={wallet.data.balance_ghs}
          pending={wallet.data.pending_ghs}
          lifetime={wallet.data.lifetime_earned}
          currency={wallet.data.currency}
        />
      </div>
      <Card>
        <CardBody>
          <h2 className="mb-2 font-head text-base font-semibold text-charcoal">Transaction history</h2>
          {transactions.isError ? (
            <div className="flex items-center justify-between py-4">
              <p className="text-sm text-red-600">Couldn't load transactions.</p>
              <Button variant="secondary" size="sm" onClick={() => transactions.refetch()}>
                Retry
              </Button>
            </div>
          ) : (
            <TransactionList transactions={transactions.data?.data || []} />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
