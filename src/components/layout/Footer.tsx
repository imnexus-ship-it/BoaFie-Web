import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Logo } from './Logo';

/** lucide-react has no official X or TikTok glyphs — inline brand SVGs, sized to match lucide's 24x24/stroke-based icons. */
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 5.82c-1.01-.87-1.66-2.14-1.66-3.57h-3.2v13.5c0 1.55-1.26 2.8-2.8 2.8a2.8 2.8 0 1 1 0-5.6c.28 0 .55.04.8.12V9.9a6.14 6.14 0 0 0-.8-.05 6 6 0 1 0 6 6V9.28a8.36 8.36 0 0 0 4.86 1.56V7.65c-1.08 0-2.14-.34-3-.98a5.7 5.7 0 0 1-.2-.85z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: 'https://www.tiktok.com/@boafietech', label: 'TikTok', icon: TikTokIcon },
  { href: 'https://www.youtube.com/channel/UCr15yMDoG8GT0EnS4il5ayw', label: 'YouTube', icon: Youtube },
  { href: 'https://www.instagram.com/boafietech/', label: 'Instagram', icon: Instagram },
  { href: 'https://web.facebook.com/profile.php?id=61592918875830', label: 'Facebook', icon: Facebook },
  { href: 'https://x.com/boafietech', label: 'X', icon: XIcon },
];

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
            <ul className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-green hover:text-green"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
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
