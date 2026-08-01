'use client';

import { Hammer, Laptop, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const ROLES = [
  { value: 'client', label: 'Hire someone', icon: Briefcase, hint: 'Post jobs & hire workers' },
  { value: 'artisan', label: 'I do skilled trade work', icon: Hammer, hint: 'Carpentry, electrical, plumbing…' },
  { value: 'freelancer', label: "I'm a freelancer", icon: Laptop, hint: 'Design, dev, writing, marketing…' },
] as const;

export function RoleSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
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
    </div>
  );
}
