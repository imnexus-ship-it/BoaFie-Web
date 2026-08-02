'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/store/auth-store';
import { dashboardPathForRole } from '@/lib/utils/routing';

function NavDropdown({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white">
        {label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 w-52 rounded-lg border border-border bg-white py-2 shadow-card">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-charcoal hover:bg-cream">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function HomeHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, clearSession } = useAuthStore();
  const dashboardHref = user ? dashboardPathForRole(user.role) : '/dashboard';

  return (
    <header className="relative z-50 px-4 py-5 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Logo light showTagline size="sm" />

        <nav className="hidden items-center gap-7 lg:flex">
          <NavDropdown
            label="Find Professionals"
            items={[
              { href: '/explore', label: 'All Professionals' },
              { href: '/explore?tab=artisans', label: 'Artisans' },
              { href: '/explore?tab=freelancers', label: 'Freelancers' },
            ]}
          />
          <a href="#how-it-works" className="text-sm font-medium text-white/90 hover:text-white">
            How It Works
          </a>
          <a href="#categories" className="text-sm font-medium text-white/90 hover:text-white">
            Categories
          </a>
          <NavDropdown
            label="Resources"
            items={[
              { href: '/about', label: 'About Us' },
              { href: '/contact', label: 'Contact' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
            ]}
          />
          <Link href="/about" className="text-sm font-medium text-white/90 hover:text-white">
            About Us
          </Link>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher variant="dark" />
          {user ? (
            <>
              <Link href={dashboardHref} className="flex items-center gap-2 text-sm font-medium text-white hover:text-white/80">
                <Avatar src={user.avatar_url} name={user.full_name} size={30} />
                {user.full_name?.split(' ')[0]}
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="!border-white/30 !text-white hover:!bg-white/10"
                onClick={clearSession}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm" className="!border-white/30 !text-white hover:!bg-white/10">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="!bg-gold hover:!bg-gold-2">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="p-2 text-white lg:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-4 flex max-w-7xl flex-col gap-3 rounded-lg bg-white/10 p-4 lg:hidden">
          <Link href="/explore" className="text-sm font-medium text-white" onClick={() => setMobileOpen(false)}>
            Find Professionals
          </Link>
          <a href="#how-it-works" className="text-sm font-medium text-white" onClick={() => setMobileOpen(false)}>
            How It Works
          </a>
          <a href="#categories" className="text-sm font-medium text-white" onClick={() => setMobileOpen(false)}>
            Categories
          </a>
          <Link href="/about" className="text-sm font-medium text-white" onClick={() => setMobileOpen(false)}>
            About Us
          </Link>
          <LanguageSwitcher variant="dark" />
          {user ? (
            <div className="mt-2 flex items-center gap-3">
              <Link
                href={dashboardHref}
                className="flex flex-1 items-center gap-2 text-sm font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                <Avatar src={user.avatar_url} name={user.full_name} size={30} />
                {user.full_name?.split(' ')[0]}
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="!border-white/30 !text-white"
                onClick={() => {
                  clearSession();
                  setMobileOpen(false);
                }}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <div className="mt-2 flex gap-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full !border-white/30 !text-white">
                  Log In
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button size="sm" className="w-full !bg-gold hover:!bg-gold-2">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
