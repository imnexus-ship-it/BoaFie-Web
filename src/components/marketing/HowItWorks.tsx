import Link from 'next/link';
import { Search, MessageSquare, Wrench, ShieldCheck, ArrowRight, UserSearch, ShieldPlus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui';

const STEPS = [
  {
    n: 1,
    icon: Search,
    title: 'Find & Choose',
    body: 'Search for verified professionals and compare reviews, ratings, and prices.',
  },
  {
    n: 2,
    icon: MessageSquare,
    title: 'Book & Agree',
    body: 'Discuss the job, agree on terms, and we secure your payment safely in escrow.',
  },
  {
    n: 3,
    icon: Wrench,
    title: 'Work in Progress',
    body: 'The professional gets to work. Track progress and stay updated.',
  },
  {
    n: 4,
    icon: ShieldCheck,
    title: 'Approve & Release',
    body: 'You approve the work, payment is released, and everyone wins.',
  },
];

const PROFESSIONAL_PERKS = [
  { icon: UserSearch, label: 'Get discovered by more clients' },
  { icon: ShieldPlus, label: 'Secure and on-time payments' },
  { icon: TrendingUp, label: 'Build your reputation and grow' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream px-4 py-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <span className="inline-flex items-center rounded-pill bg-gold-3 px-3 py-1 font-head text-xs font-semibold tracking-wide text-gold">
            HOW BOAFIE WORKS
          </span>
          <h2 className="mt-3 font-head text-3xl font-bold text-charcoal">
            Simple steps. <span className="text-green">Trusted results.</span>
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            BoaFie makes it easy to find the right professional and get your job done with confidence.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {STEPS.map((s) => (
              <div key={s.n} className="relative rounded-lg border border-border bg-white p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-3">
                  <s.icon className="h-5 w-5 text-green" />
                </div>
                <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 font-head text-base font-semibold text-charcoal">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-navy to-green p-7 text-white">
          <span className="font-head text-xs font-semibold uppercase tracking-wide text-gold-2">For Professionals</span>
          <h3 className="mt-2 font-head text-2xl font-bold">Grow your business with BoaFie</h3>
          <p className="mt-2 text-sm text-white/70">
            Join verified professionals getting quality jobs and reliable payments.
          </p>
          <ul className="mt-5 space-y-3">
            {PROFESSIONAL_PERKS.map((p) => (
              <li key={p.label} className="flex items-center gap-2.5 text-sm text-white/90">
                <p.icon className="h-4 w-4 shrink-0 text-gold-2" />
                {p.label}
              </li>
            ))}
          </ul>
          <Link href="/signup" className="mt-6 block">
            <Button className="w-full !bg-gold hover:!bg-gold-2">
              Join as a Professional <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
