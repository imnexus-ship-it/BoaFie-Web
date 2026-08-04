'use client';

import { Bell } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { PageSpinner } from '@/components/ui/Spinner';
import {
  NOTIFICATION_PREFERENCE_TYPES,
  NotificationPreferenceType,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/lib/api/hooks/useNotifications';

const LABELS: Record<NotificationPreferenceType, { title: string; description: string }> = {
  proposal: {
    title: 'Quotations & proposals',
    description: 'New proposals on your jobs, and updates when yours is accepted or declined.',
  },
  message: { title: 'Messages', description: 'When you receive a new message.' },
  milestone: { title: 'Milestones', description: 'When a milestone is submitted, or changes are requested.' },
  payment: { title: 'Payments', description: 'When escrow is funded, or funds are released to you.' },
  verification: { title: 'Verification', description: 'Updates on your ID, selfie, or trade certificate review.' },
  review: { title: 'Reviews', description: 'When you receive a new review.' },
  review_reminder: { title: 'Review reminders', description: 'A nudge to leave a review after a job completes.' },
  security: { title: 'Security alerts', description: 'Password changes and other account security events.' },
};

export function NotificationPreferencesCard() {
  const { data: prefs, isLoading } = useNotificationPreferences();
  const update = useUpdateNotificationPreferences();

  return (
    <Card>
      <CardBody>
        <div className="mb-1 flex items-center gap-2">
          <Bell className="h-4 w-4 text-charcoal" />
          <h2 className="font-head text-base font-semibold text-charcoal">Notifications</h2>
        </div>
        <p className="mb-4 text-sm text-muted">Choose what you want to be notified about.</p>

        {isLoading || !prefs ? (
          <PageSpinner />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {NOTIFICATION_PREFERENCE_TYPES.map((type) => (
              <div key={type} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal">{LABELS[type].title}</p>
                  <p className="text-xs text-muted">{LABELS[type].description}</p>
                </div>
                <Switch
                  checked={prefs[type]}
                  disabled={update.isPending}
                  label={LABELS[type].title}
                  onChange={(checked) => update.mutate({ [type]: checked })}
                />
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
