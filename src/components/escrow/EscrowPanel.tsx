import { ShieldCheck } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency } from '@/lib/utils/currency';

export function EscrowPanel({
  totalAmount,
  heldAmount,
  releasedAmount,
  currency = 'GHS',
}: {
  totalAmount: number;
  heldAmount: number;
  releasedAmount: number;
  currency?: string;
}) {
  const pctReleased = totalAmount ? (releasedAmount / totalAmount) * 100 : 0;

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-green" />
          <h3 className="font-head text-sm font-semibold text-charcoal">Escrow protection</h3>
        </div>
        <ProgressBar value={pctReleased} />
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-head text-lg font-bold text-charcoal">{formatCurrency(totalAmount, currency)}</p>
            <p className="text-[11px] text-muted">Total</p>
          </div>
          <div>
            <p className="font-head text-lg font-bold text-gold">{formatCurrency(heldAmount, currency)}</p>
            <p className="text-[11px] text-muted">Held</p>
          </div>
          <div>
            <p className="font-head text-lg font-bold text-green">{formatCurrency(releasedAmount, currency)}</p>
            <p className="text-[11px] text-muted">Released</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
