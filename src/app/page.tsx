import Link from 'next/link';
import { ShieldCheck, Wallet, Star, Hammer, Wrench, Paintbrush, Code2, Palette, ArrowRight, Globe2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui';

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: '5-stage identity verification' },
  { icon: Wallet, label: 'Escrow-protected payments' },
  { icon: Star, label: 'Real, contract-tied reviews' },
];

const CATEGORIES = [
  { icon: Hammer, label: 'Carpentry' },
  { icon: Wrench, label: 'Plumbing & Electrical' },
  { icon: Paintbrush, label: 'Painting & Finishing' },
  { icon: Code2, label: 'Web Development' },
  { icon: Palette, label: 'Design & Creative' },
];

const STEPS = [
  { n: '01', title: 'Post or browse', body: 'Describe the job, or browse verified artisans and freelancers by trade and location.' },
  { n: '02', title: 'Hire with confidence', body: 'Every badge means something — ID, selfie, location, and trade cert are independently checked.' },
  { n: '03', title: 'Pay through escrow', body: 'Funds are held safely and released as milestones are approved, not before.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border bg-white px-4 pb-16 pt-20 text-center sm:px-8">
        <div className="trust-gradient absolute inset-x-0 top-0 h-1" />
        <span className="mb-6 inline-flex items-center gap-1.5 rounded-pill border border-green/15 bg-green-3 px-3.5 py-1.5 font-head text-xs font-semibold tracking-wide text-green">
          <ShieldCheck className="h-3.5 w-3.5" /> Verification-first marketplace
        </span>
        <h1 className="mx-auto max-w-2xl font-head text-4xl font-bold leading-tight text-charcoal sm:text-5xl">
          Hire skilled Ghanaians <span className="text-green">you can actually trust.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-muted">
          BoaFie verifies every artisan and freelancer before they ever get hired — so you can hire from home or from
          abroad without the guesswork.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/explore">
            <Button size="lg">Find a verified worker</Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Join as a worker
            </Button>
          </Link>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-6 rounded-lg bg-green-3 p-6">
          {TRUST_ITEMS.map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-[13px] font-semibold text-green">
              <t.icon className="h-[18px] w-[18px]" />
              {t.label}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <h2 className="font-head text-2xl font-bold text-charcoal">Popular categories</h2>
        <p className="mb-8 text-sm text-muted">From home repairs to full product builds — find the right skill fast.</p>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={`/explore?category=${encodeURIComponent(c.label.toLowerCase())}`}
              className="flex items-center gap-2 rounded-pill border border-border bg-white px-4 py-2.5 text-sm font-medium text-charcoal hover:border-green hover:text-green"
            >
              <c.icon className="h-4 w-4" />
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-white px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-head text-2xl font-bold text-charcoal">How BoaFie works</h2>
          <p className="mb-10 text-sm text-muted">Three steps stand between a job and a job well done.</p>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="font-head text-3xl font-bold text-gold-2">{s.n}</p>
                <h3 className="mt-2 font-head text-base font-semibold text-charcoal">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <div className="flex flex-col items-center gap-6 rounded-lg bg-green p-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <div className="mb-2 flex items-center justify-center gap-2 text-gold-2 sm:justify-start">
              <Globe2 className="h-5 w-5" />
              <span className="font-head text-sm font-semibold">Diaspora hiring</span>
            </div>
            <h2 className="font-head text-2xl font-bold text-white">Hiring from abroad? We built this for you.</h2>
            <p className="mt-2 max-w-md text-sm text-white/80">
              Pay in your currency, track progress with photo updates, and release payment only when the work is done right.
            </p>
          </div>
          <Link href="/diaspora">
            <Button variant="secondary" size="lg" className="gap-2">
              See how it works <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
