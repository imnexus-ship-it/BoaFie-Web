import Link from 'next/link';
import { Logo } from './Logo';

const COLUMNS = [
  {
    title: 'For Clients',
    links: [
      { href: '/explore', label: 'Explore workers' },
      { href: '/post-job', label: 'Post a job' },
      { href: '/diaspora', label: 'Diaspora hiring' },
    ],
  },
  {
    title: 'For Workers',
    links: [
      { href: '/jobs', label: 'Find work' },
      { href: '/signup?role=artisan', label: 'Become a professional' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted">
              The verified way to hire artisans and freelancers in Ghana — trusted by clients at home and across the diaspora.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-head text-sm font-semibold text-charcoal">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted hover:text-green">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} BoaFie. Built in Accra, for Ghana and its diaspora.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-muted hover:text-green">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
