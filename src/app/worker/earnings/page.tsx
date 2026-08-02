'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { WalletCard } from '@/components/payments/WalletCard';
import { WithdrawModal } from '@/components/payments/WithdrawModal';
import { TransactionList } from '@/components/payments/TransactionList';
import { PhoneVerification } from '@/components/verification/PhoneVerification';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { useWallet, useWalletTransactions } from '@/lib/api/hooks/useWallet';
import { useVerificationStatus } from '@/lib/api/hooks/useVerification';

export default function EarningsPage() {
  const wallet = useWallet();
  const transactions = useWalletTransactions();
  const verification = useVerificationStatus();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [verifyPhoneOpen, setVerifyPhoneOpen] = useState(false);

  if (wallet.isLoading) return <PageSpinner />;
  if (wallet.isError || !wallet.data) return <ErrorState message={wallet.error?.message} onRetry={() => wallet.refetch()} />;

  const phoneVerified = verification.data?.phone_status === 'verified';

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Earnings</h1>

      <div className="max-w-sm">
        <WalletCard
          balance={wallet.data.balance_ghs}
          pending={wallet.data.pending_ghs}
          lifetime={wallet.data.lifetime_earned}
          currency={wallet.data.currency}
          action={
            <Button
              variant="secondary"
              className="w-full !bg-white !text-navy"
              onClick={() => (phoneVerified ? setWithdrawOpen(true) : setVerifyPhoneOpen(true))}
            >
              Withdraw funds
            </Button>
          }
        />
        {!phoneVerified && (
          <p className="mt-2 text-xs text-muted">You'll need to verify your phone number before withdrawing.</p>
        )}
      </div>

      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        availableBalance={wallet.data.balance_ghs}
        currency={wallet.data.currency}
      />

      <Modal open={verifyPhoneOpen} onClose={() => setVerifyPhoneOpen(false)} title="Verify your phone number">
        <p className="mb-4 text-sm text-muted">Required once, before your first withdrawal.</p>
        <PhoneVerification
          onVerified={() => {
            setVerifyPhoneOpen(false);
            setWithdrawOpen(true);
          }}
        />
      </Modal>

      <h2 className="mb-4 mt-8 font-head text-lg font-semibold text-charcoal">Recent transactions</h2>
      {transactions.isLoading ? null : transactions.isError ? (
        <div className="flex items-center justify-between py-4">
          <p className="text-sm text-red-600">Couldn't load transactions.</p>
          <Button variant="secondary" size="sm" onClick={() => transactions.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <TransactionList transactions={transactions.data?.data || []} />
      )}
    </div>
  );
}
