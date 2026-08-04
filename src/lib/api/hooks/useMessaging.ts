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

export type MessageType = 'text' | 'image' | 'file' | 'voice_note' | 'video' | 'quotation' | 'milestone_update' | 'system';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  type: MessageType;
  content?: string | null;
  media_urls?: string[];
  metadata?: Record<string, unknown> | null;
  created_at: string;
  sender?: { id: string; full_name: string; avatar_url?: string | null };
}

export interface SendMessageBody {
  content?: string;
  type: MessageType;
  media_urls?: string[];
  metadata?: Record<string, unknown>;
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

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { participant_ids: string[]; job_id?: string; contract_id?: string }) =>
      api.post<Conversation>('/conversations', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SendMessageBody | string) =>
      api.post<Message>(
        `/conversations/${conversationId}/messages`,
        typeof body === 'string' ? { content: body, type: 'text' } : body,
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] }),
  });
}
