'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';

export interface PortfolioItem {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  media_urls?: string[];
  before_urls?: string[];
  after_urls?: string[];
  category?: string | null;
  is_featured?: boolean;
  created_at: string;
}

export interface PortfolioItemInput {
  title: string;
  description?: string;
  media_urls?: string[];
  category?: string;
}

export function useMyPortfolio() {
  return useQuery({
    queryKey: ['portfolio', 'mine'],
    queryFn: () => api.get<PortfolioItem[]>('/portfolio'),
  });
}

export function usePublicPortfolio(userId: string | undefined) {
  return useQuery({
    queryKey: ['portfolio', 'user', userId],
    queryFn: () => api.get<PortfolioItem[]>(`/portfolio/user/${userId}`, { auth: false }),
    enabled: !!userId,
  });
}

export function useCreatePortfolioItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PortfolioItemInput) => api.post<PortfolioItem>('/portfolio', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio', 'mine'] }),
  });
}

export function useDeletePortfolioItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/portfolio/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio', 'mine'] }),
  });
}

export function useToggleFeaturedPortfolioItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<PortfolioItem>(`/portfolio/${id}/feature`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio', 'mine'] }),
  });
}
