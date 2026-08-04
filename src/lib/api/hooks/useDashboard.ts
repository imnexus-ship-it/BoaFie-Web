'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { DashboardSummary, User } from '../types';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api.get<User>('/users/me'),
    retry: false,
  });
}

export function useDashboard(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardSummary>('/users/me/dashboard'),
    retry: false,
    enabled: options?.enabled ?? true,
    // Keeps the notification-bell unread badge fresh without a manual refresh.
    refetchInterval: 30_000,
  });
}
