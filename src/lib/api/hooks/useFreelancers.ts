'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { FreelancerProfile } from '../types';
import { toQueryString } from './useArtisans';

export interface FreelancerSearchParams {
  skills?: string;
  rate_max?: number;
  remote?: boolean;
  rating_min?: number;
  verified?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export function useFreelancers(params: FreelancerSearchParams = {}) {
  return useQuery({
    queryKey: ['freelancers', params],
    queryFn: () =>
      api.getPaginated<FreelancerProfile[]>(`/freelancers${toQueryString(params)}`, { auth: false }),
    placeholderData: (prev) => prev,
  });
}

export function useFreelancer(id: string | undefined) {
  return useQuery({
    queryKey: ['freelancer', id],
    queryFn: () => api.get<FreelancerProfile>(`/freelancers/${id}`, { auth: false }),
    enabled: !!id,
  });
}

export function useMyFreelancerProfile() {
  return useQuery({
    queryKey: ['freelancer', 'me'],
    queryFn: () => api.get<FreelancerProfile>('/freelancers/me'),
    retry: false,
  });
}

export interface FreelancerProfileInput {
  title: string;
  skills?: string[];
  hourly_rate_ghs?: number;
  remote_only?: boolean;
  location_text?: string;
  ai_bio?: string;
}

export function useCreateFreelancerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: FreelancerProfileInput) => api.post<FreelancerProfile>('/freelancers/me', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['freelancer', 'me'] }),
  });
}

export function useUpdateFreelancerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<FreelancerProfileInput>) => api.patch<FreelancerProfile>('/freelancers/me', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['freelancer', 'me'] }),
  });
}

export function useUpdateFreelancerAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (availability: string) => api.patch<FreelancerProfile>('/freelancers/me/availability', { availability }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['freelancer', 'me'] }),
  });
}
