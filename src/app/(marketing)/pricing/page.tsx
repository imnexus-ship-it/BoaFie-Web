import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { PLANS } from '@/lib/constants/plans';

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-head text-3xl font-bold text-charcoal">Simple, fair pricing</h1>
        <p className="mt-2 text-muted">
          A flat 8% commission on every completed job, no matter your plan. Subscribe for more visibility and unlimited proposals — never to lower your rate.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <div
            key={plan.slug}
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
            <p className="mt-1 font-head text-2xl font-bold text-green">
              {plan.price}
              <span className="text-base font-medium text-muted">{plan.priceSuffix}</span>
            </p>
            <p className="text-sm text-muted">8% commission</p>
            <ul className="mt-5 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-charcoal">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" /> {f}
                </li>
              ))}
            </ul>
            <Link href={plan.slug === 'free' ? '/signup?role=artisan' : `/signup?role=artisan&plan=${plan.slug}`}>
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
