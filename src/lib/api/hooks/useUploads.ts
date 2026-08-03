'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '../client';

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post<{ url: string }>('/uploads', formData);
    },
  });
}
