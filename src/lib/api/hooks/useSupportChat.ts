'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '../client';

export interface SupportChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function useSupportChat() {
  return useMutation({
    mutationFn: (messages: SupportChatMessage[]) =>
      api.post<{ reply: string }>('/ai/support-chat', { messages }, { auth: false }),
  });
}
