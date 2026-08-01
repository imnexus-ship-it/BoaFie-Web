import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { href: '/explore', label: 'Explore workers' },
      { href: '/jobs', label: 'Find work' },
      { href: '/diaspora', label: 'Diaspora hiring' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-head text-xl font-bold text-green">
              BoaFie
              <span className="mb-0.5 h-2 w-2 rounded-full bg-gold-2" />
            </div>
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
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          © {new Date().getFullYear()} BoaFie. Built in Accra, for Ghana and its diaspora.
        </div>
      </div>
    </footer>
  );
}
