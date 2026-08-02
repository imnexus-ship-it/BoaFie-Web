'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { WorkerMatch } from '../types';

export function useWorkerMatches(jobId: string | undefined) {
  return useQuery({
    queryKey: ['jobs', jobId, 'worker-matches'],
    queryFn: () => api.get<WorkerMatch[]>(`/jobs/${jobId}/worker-matches`),
    enabled: !!jobId,
  });
}
