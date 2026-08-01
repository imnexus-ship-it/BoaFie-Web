'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { dashboardPathForRole } from '@/lib/utils/routing';

const LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/jobs', label: 'Find Work' },
  { href: '/diaspora', label: 'Diaspora Hiring' },
  { href: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const { user, clearSession } = useAuthStore();
  const [open, setOpen] = useState(false);

  const dashboardHref = user ? dashboardPathForRole(user.role) : '/dashboard';

  return (
    <header className="sticky top-0 z-[100] h-16 border-b border-border bg-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-head text-[22px] font-bold text-green">
          BoaFie
          <span className="mb-0.5 h-2 w-2 rounded-full bg-gold-2" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="font-medium text-charcoal hover:text-green">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href={dashboardHref} className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-green">
                <Avatar src={user.avatar_url} name={user.full_name} size={30} />
                {user.full_name?.split(' ')[0]}
              </Link>
              <Button variant="secondary" size="sm" onClick={clearSession}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>

        <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="font-medium text-charcoal" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <Button variant="secondary" size="sm" onClick={clearSession} className="w-full">
                  Log out
                </Button>
              ) : (
                <>
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button size="sm" className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
