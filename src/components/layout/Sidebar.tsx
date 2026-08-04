'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Logo } from './Logo';

export interface SidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

function SidebarLinks({ links, onLinkClick }: { links: SidebarLink[]; onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
      {links.map((link) => {
        const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon className={cn('h-4 w-4', active && 'text-gold-2')} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({
  links,
  bottomSlot,
  mobileOpen,
  onMobileClose,
}: {
  links: SidebarLink[];
  bottomSlot?: React.ReactNode;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  return (
    <>
      {/* Desktop: permanent sidebar */}
      <aside className="hidden w-64 shrink-0 bg-navy lg:flex lg:flex-col">
        <div className="px-6 py-6">
          <Logo light showTagline />
        </div>
        <SidebarLinks links={links} />
        {bottomSlot && <div className="p-3">{bottomSlot}</div>}
      </aside>

      {/* Mobile/tablet: slide-in drawer, since the sidebar above is hidden below lg */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} aria-hidden />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-navy shadow-xl">
            <div className="flex items-center justify-between px-6 py-6">
              <Logo light showTagline />
              <button onClick={onMobileClose} aria-label="Close menu" className="rounded-lg p-1 text-white/70 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarLinks links={links} onLinkClick={onMobileClose} />
            {bottomSlot && <div className="p-3">{bottomSlot}</div>}
          </aside>
        </div>
      )}
    </>
  );
}
