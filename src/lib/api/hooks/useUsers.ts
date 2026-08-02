'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../client';

export interface PublicProfile {
  id: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
  bio: string | null;
}

export function usePublicProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['users', userId, 'public'],
    queryFn: () => api.get<PublicProfile>(`/users/${userId}/public`, { auth: false }),
    enabled: !!userId,
  });
}
