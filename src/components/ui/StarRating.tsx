import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function StarRating({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i < Math.round(value) ? 'fill-gold-2 text-gold-2' : 'fill-transparent text-border'}
        />
      ))}
    </div>
  );
}
