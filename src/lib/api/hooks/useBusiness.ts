'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { BusinessProfile } from '../types';

export function useMyBusinessProfile() {
  return useQuery({
    queryKey: ['business', 'me'],
    queryFn: () => api.get<BusinessProfile>('/business/me'),
    retry: false,
  });
}

export interface BusinessProfileInput {
  legal_business_name: string;
  trading_name?: string;
  business_type?: string;
  registration_number?: string;
  tax_id?: string;
  industry?: string;
  business_email?: string;
  business_phone?: string;
  region?: string;
  city?: string;
}

export function useCreateBusinessProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: BusinessProfileInput) => api.post<BusinessProfile>('/business/me', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['business', 'me'] }),
  });
}
