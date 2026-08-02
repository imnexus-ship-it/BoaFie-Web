'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useWithdraw, WithdrawMethod } from '@/lib/api/hooks/useWallet';

const METHODS: { value: WithdrawMethod; label: string }[] = [
  { value: 'mtn_momo', label: 'MTN Mobile Money' },
  { value: 'telecel_cash', label: 'Telecel Cash' },
  { value: 'airteltigo', label: 'AirtelTigo Money' },
  { value: 'bank_transfer', label: 'Bank transfer' },
];

export function WithdrawModal({
  open,
  onClose,
  availableBalance,
  currency = 'GHS',
}: {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
  currency?: string;
}) {
  const withdraw = useWithdraw();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<WithdrawMethod>('mtn_momo');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [done, setDone] = useState(false);

  const reset = () => {
    setAmount('');
    setAccountNumber('');
    setAccountName('');
    setDone(false);
    withdraw.reset();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      title="Withdraw funds"
    >
      {done ? (
        <div>
          <p className="text-sm text-charcoal">
            Your withdrawal request for {currency} {amount} has been submitted and is pending review.
          </p>
          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            withdraw.mutate(
              { amount_ghs: Number(amount), method, account_number: accountNumber, account_name: accountName },
              { onSuccess: () => setDone(true) },
            );
          }}
        >
          <Input
            label={`Amount (${currency})`}
            type="number"
            required
            min={1}
            max={availableBalance}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Up to ${availableBalance}`}
          />
          <Select label="Payout method" value={method} onChange={(e) => setMethod(e.target.value as WithdrawMethod)}>
            {METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
          <Input
            label="Account number"
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="e.g. 024xxxxxxx"
          />
          <Input
            label="Account name"
            required
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Name on the account"
          />
          {withdraw.isError && <p className="text-sm text-red-600">{withdraw.error.message}</p>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={withdraw.isPending} disabled={availableBalance <= 0}>
              Request withdrawal
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
