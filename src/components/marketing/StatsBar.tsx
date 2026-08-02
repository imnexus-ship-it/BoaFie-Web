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
      <div className="grid grid-cols-2 gap-6 rounded-lg bg-white/5 p-6 sm:grid-cols-5">
        {STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <s.icon className="h-4 w-4 text-gold-2" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-head text-base font-bold text-white">{s.value}</p>
              <p className="truncate text-[11px] text-white/60">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
