import { HTMLAttributes } from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'gold' | 'muted' | 'danger';
}

const VARIANTS: Record<string, string> = {
  green: 'bg-green-3 text-green border-green/15',
  gold: 'bg-gold-3 text-gold border-gold/20',
  muted: 'bg-black/5 text-muted border-transparent',
  danger: 'bg-red-50 text-red-600 border-red-200',
};

export function Badge({ className, variant = 'muted', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 font-head text-[11px] font-semibold tracking-wide',
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="green" className={className}>
      <ShieldCheck className="h-3 w-3" />
      Verified
    </Badge>
  );
}
