'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';

export interface SavedProfessional {
  id: string;
  worker_user_id: string;
  profile_id: string | null;
  full_name: string;
  avatar_url: string | null;
  role: string;
  heading: string | null;
  avg_rating: number | null;
  review_count: number;
  saved_at: string;
}

export function useSavedProfessionals() {
  return useQuery({
    queryKey: ['saved-professionals'],
    queryFn: () => api.get<SavedProfessional[]>('/users/me/saved-professionals'),
  });
}

export function useSaveProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workerUserId: string) => api.post('/users/me/saved-professionals', { worker_user_id: workerUserId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-professionals'] }),
  });
}

export function useUnsaveProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workerUserId: string) => api.delete(`/users/me/saved-professionals/${workerUserId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-professionals'] }),
  });
}
