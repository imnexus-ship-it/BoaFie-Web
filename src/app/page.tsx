import Link from 'next/link';
import { Hammer, Wrench, Paintbrush, Code2, Palette, ArrowRight, Globe2 } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/marketing/HomeHeader';
import { HomeHero } from '@/components/marketing/HomeHero';
import { StatsBar } from '@/components/marketing/StatsBar';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Button } from '@/components/ui';
import { POPULAR_CATEGORIES } from '@/lib/constants/categories';

const CATEGORY_ICONS = [Hammer, Wrench, Paintbrush, Code2, Palette];
const CATEGORIES = POPULAR_CATEGORIES.map((c, i) => ({ ...c, icon: CATEGORY_ICONS[i] }));

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="relative overflow-hidden bg-gradient-to-br from-navy to-green">
        <HomeHeader />
        <HomeHero />
        <StatsBar />
      </div>

      <HowItWorks />

      <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <h2 className="font-head text-2xl font-bold text-charcoal">Popular categories</h2>
        <p className="mb-8 text-sm text-muted">From home repairs to full product builds — find the right skill fast.</p>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={`/categories/${c.slug}`}
              className="flex items-center gap-2 rounded-pill border border-border bg-white px-4 py-2.5 text-sm font-medium text-charcoal hover:border-green hover:text-green"
            >
              <c.icon className="h-4 w-4" />
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-8">
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
