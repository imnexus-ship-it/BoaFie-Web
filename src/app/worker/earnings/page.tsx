'use client';

import { WalletCard } from '@/components/payments/WalletCard';
import { TransactionList } from '@/components/payments/TransactionList';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { useWallet, useWalletTransactions } from '@/lib/api/hooks/useWallet';

export default function EarningsPage() {
  const wallet = useWallet();
  const transactions = useWalletTransactions();

  if (wallet.isLoading) return <PageSpinner />;
  if (wallet.isError || !wallet.data) return <ErrorState message={wallet.error?.message} onRetry={() => wallet.refetch()} />;

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Earnings</h1>

      <WalletCard
        balance={wallet.data.balance_ghs}
        pending={wallet.data.pending_ghs}
        lifetime={wallet.data.lifetime_earned}
        currency={wallet.data.currency}
      />

      <h2 className="mb-4 mt-8 font-head text-lg font-semibold text-charcoal">Recent transactions</h2>
      {transactions.isLoading ? null : (
        <TransactionList transactions={transactions.data?.data || []} />
      )}
    </div>
  );
}
