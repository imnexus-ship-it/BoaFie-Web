/**
 * The five categories featured on the homepage (hero search + "Popular
 * categories" section). Slugs must match the seeded `categories.slug`
 * values on the API — see 0008_seed_categories.sql.
 */
export const POPULAR_CATEGORIES = [
  { label: 'Carpentry', slug: 'carpentry', tab: 'artisans' as const },
  { label: 'Plumbing & Electrical', slug: 'plumbing', tab: 'artisans' as const },
  { label: 'Painting & Finishing', slug: 'painting', tab: 'artisans' as const },
  { label: 'Web Development', slug: 'web-development', tab: 'freelancers' as const },
  { label: 'Design & Creative', slug: 'graphic-design', tab: 'freelancers' as const },
];
