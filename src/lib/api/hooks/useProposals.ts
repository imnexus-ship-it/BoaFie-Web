'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { Proposal, Contract } from '../types';

export function useMyProposals() {
  return useQuery({
    queryKey: ['proposals', 'mine'],
    queryFn: () => api.get<Proposal[]>('/proposals/mine'),
  });
}

export function useJobProposals(jobId: string | undefined) {
  return useQuery({
    queryKey: ['jobs', jobId, 'proposals'],
    queryFn: () => api.get<Proposal[]>(`/jobs/${jobId}/proposals`),
    enabled: !!jobId,
  });
}

export interface CreateProposalInput {
  cover_letter: string;
  proposed_rate: number;
  rate_type?: 'fixed' | 'hourly' | 'daily';
  estimated_days?: number;
}

export function useSubmitProposal(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProposalInput) => api.post<Proposal>(`/jobs/${jobId}/proposals`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
    },
  });
}

export function useAcceptProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<{ proposal_id: string; contract: Contract }>(`/proposals/${id}/accept`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useRejectProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<Proposal>(`/proposals/${id}/reject`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proposals'] }),
  });
}
