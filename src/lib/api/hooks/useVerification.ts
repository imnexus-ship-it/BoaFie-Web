'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { Verification } from '../types';

export function useVerificationStatus() {
  return useQuery({
    queryKey: ['verification', 'status'],
    queryFn: () => api.get<Verification>('/verification/status'),
    retry: false,
  });
}

export function useSubmitId() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { id_type: string; id_number: string; id_front_url: string; id_back_url?: string }) =>
      api.post<Verification>('/verification/id', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['verification', 'status'] }),
  });
}

export function useSubmitSelfie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (selfie_url: string) => api.post<Verification>('/verification/selfie', { selfie_url }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['verification', 'status'] }),
  });
}

export function useSubmitLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { lat: number; lng: number; location_text?: string }) =>
      api.post<Verification>('/verification/location', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['verification', 'status'] }),
  });
}

export function useSubmitTradeCert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trade_cert_url: string) => api.post<Verification>('/verification/trade-cert', { trade_cert_url }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['verification', 'status'] }),
  });
}
