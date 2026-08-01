import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/currency';
import { timeAgo } from '@/lib/utils/date';
import { Transaction } from '@/lib/api/hooks/useWallet';

const CREDIT_TYPES = new Set(['deposit', 'escrow_release', 'refund']);

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <p className="py-6 text-center text-sm text-muted">No transactions yet.</p>;
  }
  return (
    <div className="flex flex-col">
      {transactions.map((t) => {
        const isCredit = CREDIT_TYPES.has(t.type);
        // Escrow releases carry a commission deduction — show what actually
        // landed in the wallet, not the gross milestone amount, so this list
        // never disagrees with the balance above it.
        const hasCommission = t.net_amount != null && t.commission_amount != null;
        const displayAmount = hasCommission ? t.net_amount! : t.amount;

        return (
          <div key={t.id} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${isCredit ? 'bg-green-3' : 'bg-black/5'}`}>
              {isCredit ? (
                <ArrowDownLeft className="h-4 w-4 text-green" />
              ) : (
                <ArrowUpRight className="h-4 w-4 text-muted" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium capitalize text-charcoal">{t.type.replace('_', ' ')}</p>
              <p className="text-xs text-muted">
                {t.description || timeAgo(t.created_at)}
                {hasCommission && (
                  <>
                    {' · '}
                    {formatCurrency(t.amount, t.currency)} gross − {formatCurrency(t.commission_amount!, t.currency)}{' '}
                    commission
                  </>
                )}
              </p>
            </div>
            <span className={`font-head text-sm font-semibold ${isCredit ? 'text-green' : 'text-charcoal'}`}>
              {isCredit ? '+' : '-'}
              {formatCurrency(displayAmount, t.currency)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
