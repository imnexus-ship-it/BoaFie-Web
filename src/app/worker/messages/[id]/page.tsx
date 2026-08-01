'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { useConversation, useSendMessage } from '@/lib/api/hooks/useMessaging';
import { useAuthStore } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils/cn';

export default function WorkerConversationPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data, isLoading, isError, error, refetch } = useConversation(id);
  const sendMessage = useSendMessage(id);
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [text, setText] = useState('');

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-lg border border-border bg-white">
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col gap-3">
          {data.messages.map((m) => {
            const mine = m.sender_id === currentUserId;
            return (
              <div key={m.id} className={cn('flex items-end gap-2', mine && 'flex-row-reverse')}>
                <Avatar src={m.sender?.avatar_url} name={m.sender?.full_name} size={28} />
                <div
                  className={cn(
                    'max-w-xs rounded-lg px-3.5 py-2.5 text-sm',
                    mine ? 'bg-green text-white' : 'bg-black/[0.04] text-charcoal',
                  )}
                >
                  {m.content}
                </div>
              </div>
            );
          })}
          {data.messages.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">Say hello to get the conversation started.</p>
          )}
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          sendMessage.mutate(text, { onSuccess: () => setText('') });
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-lg border border-border px-3.5 py-2.5 text-sm focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
        />
        <Button type="submit" size="sm" loading={sendMessage.isPending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
