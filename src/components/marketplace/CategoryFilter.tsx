'use client';

import { cn } from '@/lib/utils/cn';
import { Category } from '@/lib/api/types';

export function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active?: string;
  onChange: (slug?: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2.5">
      <button
        onClick={() => onChange(undefined)}
        className={cn(
          'rounded-pill border border-border px-4 py-2 text-[13px] font-medium text-charcoal',
          !active && 'border-green bg-green text-white',
        )}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.slug)}
          className={cn(
            'rounded-pill border border-border px-4 py-2 text-[13px] font-medium text-charcoal',
            active === c.slug && 'border-green bg-green text-white',
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
