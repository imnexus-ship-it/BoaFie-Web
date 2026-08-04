import { Users, Briefcase, Star, Wallet, Headphones } from 'lucide-react';

// NOTE: these figures mirror the provided design mockup as placeholder
// marketing copy — they are not sourced from real platform data (no
// reviews system exists yet, and current real user/job counts are far
// smaller). Replace with real numbers (or a live stats endpoint) before
// this goes to production.
const STATS = [
  { icon: Users, value: '1,250+', label: 'Verified Professionals' },
  { icon: Briefcase, value: '8,500+', label: 'Jobs Completed' },
  { icon: Star, value: '98%', label: 'Positive Reviews' },
  { icon: Wallet, value: 'GHS 15M+', label: 'Payments Secured' },
  { icon: Headphones, value: '24/7', label: 'Customer Support' },
];

export function StatsBar() {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 sm:px-8">
      <div className="grid grid-cols-5 gap-2 rounded-lg bg-white/5 p-3 sm:gap-3 lg:gap-6 lg:p-6">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1.5 text-center lg:flex-row lg:items-center lg:gap-3 lg:text-left">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 lg:h-9 lg:w-9">
              <s.icon className="h-3.5 w-3.5 text-gold-2 lg:h-4 lg:w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-head text-xs font-bold text-white sm:text-sm lg:truncate lg:text-base">{s.value}</p>
              <p className="text-[9px] leading-tight text-white/60 sm:text-[10px] lg:truncate lg:text-[11px]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
