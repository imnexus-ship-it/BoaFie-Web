'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { Review, ReviewSummary } from '../types';

export function useWorkerReviews(workerId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', 'worker', workerId],
    queryFn: () => api.get<ReviewSummary>(`/users/${workerId}/reviews`, { auth: false }),
    enabled: !!workerId,
  });
}

export function useCreateReview(contractId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { rating: number; comment?: string }) =>
      api.post<Review>(`/contracts/${contractId}/reviews`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contract', contractId] }),
  });
}
