'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';

export interface Conversation {
  id: string;
  participant_ids: string[];
  job_id?: string | null;
  contract_id?: string | null;
  last_message_at?: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  type: string;
  content?: string | null;
  created_at: string;
  sender?: { id: string; full_name: string; avatar_url?: string | null };
}

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get<Conversation[]>('/conversations'),
  });
}

export function useConversation(id: string | undefined) {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => api.get<Conversation & { messages: Message[] }>(`/conversations/${id}`),
    enabled: !!id,
    refetchInterval: 5000, // simple polling until the Socket.IO client is wired up in the UI
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => api.post<Message>(`/conversations/${conversationId}/messages`, { content, type: 'text' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] }),
  });
}
