import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const PLANS = [
  {
    name: 'Free',
    price: 'GH₵0',
    commission: '12% commission',
    features: ['Up to 5 proposals/month', 'Standard profile', 'Basic support'],
    highlight: false,
  },
  {
    name: 'Verified Pro',
    price: 'GH₵50/mo',
    commission: '8% commission',
    features: ['Unlimited proposals', 'Priority placement in search', 'AI bio & proposal drafting', 'Priority support'],
    highlight: true,
  },
  {
    name: 'Business',
    price: 'GH₵150/mo',
    commission: '5% commission',
    features: ['Everything in Pro', 'Team accounts', 'Dedicated account support', 'Lowest commission rate'],
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-head text-3xl font-bold text-charcoal">Simple, fair pricing</h1>
        <p className="mt-2 text-muted">Only pay commission on work you actually complete. No listing fees, ever.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'rounded-lg border p-6',
              plan.highlight ? 'border-green bg-white shadow-lg ring-1 ring-green' : 'border-border bg-white',
            )}
          >
            {plan.highlight && (
              <span className="mb-3 inline-block rounded-pill bg-gold-2 px-2.5 py-1 font-head text-[11px] font-bold text-white">
                MOST POPULAR
              </span>
            )}
            <h3 className="font-head text-lg font-bold text-charcoal">{plan.name}</h3>
            <p className="mt-1 font-head text-2xl font-bold text-green">{plan.price}</p>
            <p className="text-sm text-muted">{plan.commission}</p>
            <ul className="mt-5 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-charcoal">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <Button variant={plan.highlight ? 'primary' : 'secondary'} className="mt-6 w-full">
                Get started
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
