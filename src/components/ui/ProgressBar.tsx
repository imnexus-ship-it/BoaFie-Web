import { cn } from '@/lib/utils/cn';

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-pill bg-black/5', className)}>
      <div className="h-full rounded-pill bg-green transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}
