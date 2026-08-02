'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '../client';

export interface GenerateBioInput {
  role: 'artisan' | 'freelancer';
  headline?: string;
  skills?: string[];
  years_experience?: number;
  location_text?: string;
}

export function useGenerateBio() {
  return useMutation({
    mutationFn: (body: GenerateBioInput) => api.post<{ bio: string }>('/ai/bio', body),
  });
}

export function useDraftProposal() {
  return useMutation({
    mutationFn: (jobId: string) =>
      api.post<{ cover_letter: string }>('/ai/proposal-draft', { job_id: jobId }),
  });
}
