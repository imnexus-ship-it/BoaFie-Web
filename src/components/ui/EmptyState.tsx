import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white/50 px-6 py-16 text-center', className)}>
      <Icon className="mb-3 h-8 w-8 text-muted" />
      <h3 className="font-head text-base font-semibold text-charcoal">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
