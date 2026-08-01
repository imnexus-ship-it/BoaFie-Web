'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { Job } from '../types';
import { toQueryString } from './useArtisans';

export interface JobSearchParams {
  category?: string;
  location?: string;
  budget_min?: number;
  budget_max?: number;
  diaspora?: boolean;
  urgency?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export function useJobs(params: JobSearchParams = {}) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => api.getPaginated<Job[]>(`/jobs${toQueryString(params)}`, { auth: false }),
    placeholderData: (prev) => prev,
  });
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => api.get<Job>(`/jobs/${id}`, { auth: false }),
    enabled: !!id,
  });
}

export function useMyPostedJobs() {
  return useQuery({
    queryKey: ['jobs', 'my-posts'],
    queryFn: () => api.getPaginated<Job[]>('/jobs/my-posts'),
  });
}

export function useRecommendedJobs() {
  return useQuery({
    queryKey: ['jobs', 'recommended'],
    queryFn: () => api.get<Job[]>('/jobs/recommended'),
  });
}

export interface CreateJobInput {
  title: string;
  description: string;
  category: string;
  location_text?: string;
  budget_min_ghs?: number;
  budget_max_ghs?: number;
  budget_type?: 'fixed' | 'hourly' | 'daily';
  deadline?: string;
  urgency?: 'emergency' | 'urgent' | 'normal';
  is_diaspora_job?: boolean;
  diaspora_country?: string;
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateJobInput) => api.post<Job>('/jobs', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });
}
