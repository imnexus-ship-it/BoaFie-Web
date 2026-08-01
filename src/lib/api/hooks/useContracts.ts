'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { Contract, Milestone } from '../types';

export function useContracts() {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: () => api.getPaginated<Contract[]>('/contracts'),
  });
}

export function useContract(id: string | undefined) {
  return useQuery({
    queryKey: ['contract', id],
    queryFn: () => api.get<Contract>(`/contracts/${id}`),
    enabled: !!id,
  });
}

export function useMilestones(contractId: string | undefined) {
  return useQuery({
    queryKey: ['contracts', contractId, 'milestones'],
    queryFn: () => api.get<Milestone[]>(`/contracts/${contractId}/milestones`),
    enabled: !!contractId,
  });
}

export function useStartMilestone(contractId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<Milestone>(`/milestones/${id}/start`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contracts', contractId, 'milestones'] }),
  });
}

export function useSubmitMilestone(contractId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, submission_note }: { id: string; submission_note: string }) =>
      api.patch<Milestone>(`/milestones/${id}/submit`, { submission_note }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contracts', contractId, 'milestones'] }),
  });
}

export function useApproveMilestone(contractId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<Milestone>(`/milestones/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts', contractId, 'milestones'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
}

export function useRejectMilestone(contractId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: string }) =>
      api.patch<Milestone>(`/milestones/${id}/reject`, { feedback }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contracts', contractId, 'milestones'] }),
  });
}

export function useCreateMilestone(contractId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; description?: string; amount_ghs: number; due_date?: string }) =>
      api.post<Milestone>(`/contracts/${contractId}/milestones`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contracts', contractId, 'milestones'] }),
  });
}

export function useCompleteContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<Contract>(`/contracts/${id}/complete`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contracts'] }),
  });
}
