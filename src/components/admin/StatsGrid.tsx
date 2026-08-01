import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';

export interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  href?: string;
}

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        const body = (
          <CardBody>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.iconBg ?? 'bg-green-3'}`}>
                <Icon className={`h-5 w-5 ${s.iconColor ?? 'text-green'}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate font-head text-lg font-bold text-charcoal">{s.value}</p>
                <p className="truncate text-xs text-muted">{s.label}</p>
              </div>
            </div>
            {s.href && (
              <Link href={s.href} className="mt-3 block text-xs font-medium text-green hover:underline">
                View all
              </Link>
            )}
          </CardBody>
        );
        return <Card key={s.label}>{body}</Card>;
      })}
    </div>
  );
}
