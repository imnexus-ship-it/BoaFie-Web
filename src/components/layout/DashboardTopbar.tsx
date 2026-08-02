'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, MessageSquare, Search, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/lib/store/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import { useDashboard } from '@/lib/api/hooks/useDashboard';
import { useConversations } from '@/lib/api/hooks/useMessaging';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/lib/api/hooks/useNotifications';
import { settingsPathForRole } from '@/lib/utils/routing';

const ROLE_LABEL: Record<string, string> = {
  client: 'Customer',
  artisan: 'Professional',
  freelancer: 'Professional',
  admin: 'Admin',
};

export function DashboardTopbar({ messagesHref }: { messagesHref?: string }) {
  const { user, clearSession } = useAuthStore();
  const router = useRouter();
  const dashboard = useDashboard();
  const conversations = useConversations();
  const notifications = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const settingsHref = user ? settingsPathForRole(user.role) : null;

  const unreadNotifications = dashboard.data?.unread_notifications ?? 0;
  const conversationCount = conversations.data?.length ?? 0;
  const recentNotifications = notifications.data?.data.slice(0, 6) ?? [];

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-white px-4 sm:px-8">
      <form
        className="relative hidden max-w-md flex-1 sm:block"
        onSubmit={(e) => {
          e.preventDefault();
          const q = searchValue.trim();
          if (!q) return;
          router.push(`/explore?location=${encodeURIComponent(q)}`);
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search for services, professionals, or locations…"
          className="w-full rounded-lg border border-border bg-cream py-2 pl-9 pr-4 text-sm text-charcoal placeholder:text-muted focus:border-green focus:outline-none"
        />
      </form>
      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-1">
        <div className="relative">
          <button
            aria-label="Notifications"
            className="relative rounded-lg p-2 hover:bg-black/5"
            onClick={() => setNotifOpen((o) => !o)}
          >
            <Bell className="h-5 w-5 text-charcoal" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-border bg-white py-2 shadow-card">
                <div className="flex items-center justify-between px-4 pb-2">
                  <span className="text-sm font-semibold text-charcoal">Notifications</span>
                  {unreadNotifications > 0 && (
                    <button className="text-xs font-medium text-green hover:underline" onClick={() => markAllRead.mutate()}>
                      Mark all read
                    </button>
                  )}
                </div>
                {recentNotifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted">No notifications yet.</p>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {recentNotifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => !n.is_read && markRead.mutate(n.id)}
                        className={`block w-full border-t border-border px-4 py-3 text-left hover:bg-cream ${n.is_read ? '' : 'bg-green-3/40'}`}
                      >
                        <p className="text-sm font-medium text-charcoal">{n.title}</p>
                        {n.body && <p className="mt-0.5 text-xs text-muted">{n.body}</p>}
                        <p className="mt-1 text-[11px] text-muted">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {messagesHref && (
          <Link href={messagesHref} aria-label="Messages" className="relative rounded-lg p-2 hover:bg-black/5">
            <MessageSquare className="h-5 w-5 text-charcoal" />
            {conversationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green px-1 text-[10px] font-bold text-white">
                {conversationCount > 99 ? '99+' : conversationCount}
              </span>
            )}
          </Link>
        )}
      </div>

      <div className="relative">
        <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-black/5" onClick={() => setMenuOpen((o) => !o)}>
          <Avatar src={user?.avatar_url} name={user?.full_name} size={36} />
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold text-charcoal">{user?.full_name}</span>
            <span className="block text-xs text-muted">{ROLE_LABEL[user?.role ?? ''] ?? user?.role}</span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-muted sm:block" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-border bg-white py-1 shadow-card">
              {settingsHref && (
                <Link href={settingsHref} className="block px-4 py-2 text-sm text-charcoal hover:bg-cream" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
              )}
              <button
                className="block w-full px-4 py-2 text-left text-sm text-danger hover:bg-cream"
                onClick={() => {
                  setMenuOpen(false);
                  clearSession();
                }}
              >
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
