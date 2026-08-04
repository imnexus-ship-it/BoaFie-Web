'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';

export interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  data?: Record<string, unknown> | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

/** All 8 toggleable notification categories — kept in sync with boafie-api's TOGGLEABLE_NOTIFICATION_TYPES. */
export const NOTIFICATION_PREFERENCE_TYPES = [
  'proposal',
  'message',
  'milestone',
  'payment',
  'verification',
  'review',
  'review_reminder',
  'security',
] as const;

export type NotificationPreferenceType = (typeof NOTIFICATION_PREFERENCE_TYPES)[number];
export type NotificationPreferences = Record<NotificationPreferenceType, boolean>;

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.getPaginated<Notification[]>('/users/me/notifications'),
    refetchInterval: 30_000,
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => api.get<NotificationPreferences>('/users/me/notification-preferences'),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<NotificationPreferences>) =>
      api.patch<NotificationPreferences>('/users/me/notification-preferences', updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['notification-preferences'], data);
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/users/me/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch('/users/me/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
