'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/store/auth-store';
import { settingsPathForRole } from '@/lib/utils/routing';
import { useDashboard } from '@/lib/api/hooks/useDashboard';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/lib/api/hooks/useNotifications';

export function NotificationBell({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const dashboard = useDashboard();
  const notifications = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const settingsHref = user ? settingsPathForRole(user.role) : null;

  const unread = dashboard.data?.unread_notifications ?? 0;
  const recent = notifications.data?.data.slice(0, 6) ?? [];

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        className={cn(
          'relative rounded-lg p-2',
          variant === 'dark' ? 'text-white hover:bg-white/10' : 'text-charcoal hover:bg-black/5',
        )}
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-border bg-white py-2 shadow-card">
            <div className="flex items-center justify-between px-4 pb-2">
              <span className="text-sm font-semibold text-charcoal">Notifications</span>
              {unread > 0 && (
                <button className="text-xs font-medium text-green hover:underline" onClick={() => markAllRead.mutate()}>
                  Mark all read
                </button>
              )}
            </div>
            {recent.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted">No notifications yet.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {recent.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => !n.is_read && markRead.mutate(n.id)}
                    className={cn(
                      'block w-full border-t border-border px-4 py-3 text-left hover:bg-cream',
                      !n.is_read && 'bg-green-3/40',
                    )}
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
            {settingsHref && (
              <div className="border-t border-border px-4 pt-2">
                <Link
                  href={settingsHref}
                  className="text-xs font-medium text-green hover:underline"
                  onClick={() => setOpen(false)}
                >
                  Notification settings
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
