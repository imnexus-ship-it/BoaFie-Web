'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '../client';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: (body: ContactMessage) => api.post<{ sent: boolean }>('/contact', body),
  });
}
