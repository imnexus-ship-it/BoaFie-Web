'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Lock, Star, Search, MapPin, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { POPULAR_CATEGORIES } from '@/lib/constants/categories';

const TRUST_BADGES = [
  { icon: CheckCircle2, label: 'Verified Professionals' },
  { icon: Lock, label: 'Secure Escrow Payments' },
  { icon: Star, label: 'Satisfaction Guaranteed' },
];

export function HomeHero() {
  const router = useRouter();
  const [service, setService] = useState('');
  const [location, setLocation] = useState('Accra, Ghana');
  const [category, setCategory] = useState('All Categories');

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* Left: copy */}
        <div>
          <h1 className="font-head text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
            Find trusted
            <br />
            professionals.
            <br />
            <span className="text-gold-2">Get work done right.</span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] text-white/70">
            BoaFie connects you with verified experts for any job. Secure payments, real reviews, quality results.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/explore">
              <Button size="lg" className="!bg-gold hover:!bg-gold-2">
                Find a Professional <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signup?role=artisan">
              <Button size="lg" variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
                Become a Professional
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-[13px] font-medium text-white/80">
                <b.icon className="h-4 w-4 shrink-0 text-gold-2" />
                {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: hero photo + trust card */}
        <div className="relative hidden lg:block">
          <div className="relative flex aspect-[4/5] items-end justify-center overflow-hidden rounded-lg bg-white/5">
            <Image
              src="/images/hero-worker.png"
              alt="A verified BoaFie professional"
              width={1400}
              height={1120}
              priority
              className="h-[92%] w-auto object-contain object-bottom"
            />

            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-lg bg-white p-4 shadow-card">
              <div className="flex -space-x-2">
                <Avatar name="K A" size={32} className="border-2 border-white" />
                <Avatar name="A S" size={32} className="border-2 border-white" />
                <Avatar name="Y B" size={32} className="border-2 border-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-charcoal">100% ID Verified</p>
                <p className="text-xs text-muted">Every professional, checked before hire</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="mt-10 grid gap-3 rounded-lg bg-white p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">What service do you need?</label>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-muted" />
            <input
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. Plumbing, Electrical, Tiling…"
              className="w-full text-sm text-charcoal placeholder:text-muted focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Select Location</label>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-muted" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-sm text-charcoal placeholder:text-muted focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Category</label>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
            <LayoutGrid className="h-4 w-4 shrink-0 text-muted" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm text-charcoal focus:outline-none"
            >
              <option>All Categories</option>
              {POPULAR_CATEGORIES.map((c) => (
                <option key={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-end">
          <Button
            className="w-full !bg-gold hover:!bg-gold-2 sm:w-auto"
            onClick={() => {
              const selected = POPULAR_CATEGORIES.find((c) => c.label === category);
              const params = new URLSearchParams();
              params.set('tab', selected?.tab ?? 'artisans');
              if (selected) {
                params.set('category', selected.slug);
              } else if (service.trim()) {
                params.set('category', service.trim().toLowerCase());
              }
              if (location.trim()) params.set('location', location.trim());
              router.push(`/explore?${params.toString()}`);
            }}
          >
            Search Now <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
