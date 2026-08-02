/**
 * Worker subscription ladder shown on the pricing page and carried through
 * to signup via ?plan=. Commission is a flat 8% across all tiers — these
 * plans are pure feature/priority upsells, not commission discounts.
 *
 * No billing flow exists yet, so choosing a paid plan at signup only
 * records intent (see PENDING_PLAN_STORAGE_KEY) for a future checkout step
 * to pick up — it does not charge or activate anything server-side.
 */
export const PLANS = [
  {
    slug: 'free',
    name: 'Free',
    price: 'GH₵0',
    priceSuffix: '',
    features: ['Up to 5 proposals/month', 'Standard profile', 'Basic support'],
    highlight: false,
  },
  {
    slug: 'worker_pro',
    name: 'Worker Pro',
    price: 'GH₵99',
    priceSuffix: '/mo',
    features: ['Unlimited proposals', 'Priority placement in search', 'AI bio & proposal drafting', 'Priority support'],
    highlight: true,
  },
  {
    slug: 'premium',
    name: 'Premium',
    price: 'GH₵149',
    priceSuffix: '/mo',
    features: ['Everything in Worker Pro', 'Full verified badge', 'Eligible for diaspora job invites', 'Advanced analytics'],
    highlight: false,
  },
  {
    slug: 'business',
    name: 'Business',
    price: 'GH₵299',
    priceSuffix: '/mo',
    features: ['Everything in Premium', 'Team accounts (up to 5 members)', 'Featured category placement', 'Dedicated account manager'],
    highlight: false,
  },
] as const;

export type PlanSlug = (typeof PLANS)[number]['slug'];

export function getPlan(slug: string | null): (typeof PLANS)[number] | undefined {
  return PLANS.find((p) => p.slug === slug);
}

export const PENDING_PLAN_STORAGE_KEY = 'boafie-pending-plan';
