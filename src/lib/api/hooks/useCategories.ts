'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { Category } from '../types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories', { auth: false }),
    staleTime: 5 * 60_000,
  });
}
