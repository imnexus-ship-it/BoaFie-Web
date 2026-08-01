'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Logo } from './Logo';

export interface SidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function Sidebar({ links, bottomSlot }: { links: SidebarLink[]; bottomSlot?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 bg-navy lg:flex lg:flex-col">
      <div className="px-6 py-6">
        <Logo light showTagline />
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
        {links.map((link) => {
          const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
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

      {bottomSlot && <div className="p-3">{bottomSlot}</div>}
    </aside>
  );
}
