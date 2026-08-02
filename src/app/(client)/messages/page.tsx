'use client';

import { MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { ConversationRow } from '@/components/messaging/ConversationRow';
import { useConversations } from '@/lib/api/hooks/useMessaging';
import { useAuthStore } from '@/lib/store/auth-store';

export default function ClientMessagesPage() {
  const { data, isLoading, isError, error, refetch } = useConversations();
  const currentUserId = useAuthStore((s) => s.user?.id);

  if (isLoading) return <PageSpinner />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Messages</h1>

      {(data || []).length === 0 ? (
        <EmptyState icon={MessageSquare} title="No conversations yet" description="Messages with workers will appear here." />
      ) : (
        <div className="flex flex-col gap-2">
          {(data || []).map((c) => (
            <ConversationRow key={c.id} conversation={c} currentUserId={currentUserId} linkBase="/messages" />
          ))}
        </div>
      )}
    </div>
  );
}
