'use client';

import { Hammer, Laptop, Briefcase, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const ROLES = [
  { value: 'client', label: 'Hire a Professional', hint: 'Post jobs & hire verified workers', icon: Briefcase },
  { value: 'artisan', label: 'Offer My Services — Trade work', hint: 'Carpentry, electrical, plumbing…', icon: Hammer },
  { value: 'freelancer', label: 'Offer My Services — Freelance', hint: 'Design, dev, writing, marketing…', icon: Laptop },
] as const;

export function AccountTypeStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: 'client' | 'artisan' | 'freelancer') => void;
}) {
  return (
    <div>
      <h1 className="mb-1 font-head text-xl font-bold text-charcoal">Join a marketplace built on trust</h1>
      <p className="mb-6 text-sm text-muted">How would you like to use BoaFie?</p>
      <div className="grid gap-3">
        {ROLES.map((r) => {
          const Icon = r.icon;
          const active = value === r.value;
          return (
            <button
              type="button"
              key={r.value}
              onClick={() => onChange(r.value)}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-4 text-left transition-colors',
                active ? 'border-green bg-green-3' : 'border-border bg-white hover:border-green/40',
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-green' : 'text-muted')} />
              <div>
                <p className="text-sm font-semibold text-charcoal">{r.label}</p>
                <p className="text-xs text-muted">{r.hint}</p>
              </div>
            </button>
          );
        })}
        <div className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-dashed border-border bg-black/[0.02] p-4 text-left opacity-60">
          <Building2 className="h-5 w-5 shrink-0 text-muted" />
          <div>
            <p className="text-sm font-semibold text-charcoal">Register a Business</p>
            <p className="text-xs text-muted">Coming soon — sign up as a professional or client for now.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
