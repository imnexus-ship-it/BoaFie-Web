'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { ArtisanProfile, PaginatedMeta } from '../types';

export interface ArtisanSearchParams {
  category?: string;
  location?: string;
  availability?: string;
  rate_max?: number;
  rating_min?: number;
  verified?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export function toQueryString<T extends object>(params: T): string {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value !== undefined && value !== null && value !== '') usp.set(key, String(value));
  }
  const s = usp.toString();
  return s ? `?${s}` : '';
}

export function useArtisans(params: ArtisanSearchParams = {}) {
  return useQuery({
    queryKey: ['artisans', params],
    queryFn: () =>
      api.getPaginated<ArtisanProfile[]>(`/artisans${toQueryString(params)}`, { auth: false }),
    placeholderData: (prev) => prev,
  });
}

export function useArtisan(id: string | undefined) {
  return useQuery({
    queryKey: ['artisan', id],
    queryFn: () => api.get<ArtisanProfile>(`/artisans/${id}`, { auth: false }),
    enabled: !!id,
  });
}

export type { PaginatedMeta };

export function useMyArtisanProfile() {
  return useQuery({
    queryKey: ['artisan', 'me'],
    queryFn: () => api.get<ArtisanProfile>('/artisans/me'),
    retry: false,
  });
}

export interface ArtisanProfileInput {
  trade_category: string;
  trade_subcategories?: string[];
  years_experience?: number;
  hourly_rate_ghs?: number;
  location_text?: string;
  lat?: number;
  lng?: number;
  ai_bio?: string;
}

export function useCreateArtisanProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ArtisanProfileInput) => api.post<ArtisanProfile>('/artisans/me', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artisan', 'me'] }),
  });
}

export function useUpdateArtisanProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<ArtisanProfileInput>) => api.patch<ArtisanProfile>('/artisans/me', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artisan', 'me'] }),
  });
}

export function useUpdateArtisanAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (availability: string) => api.patch<ArtisanProfile>('/artisans/me/availability', { availability }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artisan', 'me'] }),
  });
}
