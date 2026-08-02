import Link from 'next/link';
import { Camera, Globe2, ShieldCheck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui';

const FEATURES = [
  { icon: ShieldCheck, title: 'Verified before you hire', body: 'Every worker passes ID, selfie, location, and trade-cert checks — not just a profile photo.' },
  { icon: Wallet, title: 'Secure escrow, released on your terms', body: 'Funds are held safely in escrow and only released to the worker once you confirm the milestone is done right.' },
  { icon: Camera, title: 'See real progress', body: 'Milestone photos and videos let you follow the job from thousands of miles away.' },
];

export default function DiasporaPage() {
  return (
    <div>
      <section className="border-b border-border bg-white px-4 py-16 text-center sm:px-8">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-pill border border-gold/20 bg-gold-3 px-3.5 py-1.5 font-head text-xs font-semibold text-gold">
          <Globe2 className="h-3.5 w-3.5" /> For the diaspora
        </span>
        <h1 className="mx-auto max-w-xl font-head text-3xl font-bold text-charcoal sm:text-4xl">
          Hire back home, without the guesswork.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Renovating a family house, sending support for a project, or hiring help remotely — BoaFie was built for
          Ghanaians hiring from the UK, US, and Canada.
        </p>
        <Link href="/explore">
          <Button size="lg" className="mt-6">
            Browse verified workers
          </Button>
        </Link>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-green-3">
                <f.icon className="h-5 w-5 text-green" />
              </div>
              <h3 className="font-head text-base font-semibold text-charcoal">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
