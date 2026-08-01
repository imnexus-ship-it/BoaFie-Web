'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageSpinner } from '@/components/ui/Spinner';
import { useConversations } from '@/lib/api/hooks/useMessaging';
import { useAuthStore } from '@/lib/store/auth-store';
import { timeAgo } from '@/lib/utils/date';

export default function WorkerMessagesPage() {
  const { data, isLoading, isError, error, refetch } = useConversations();
  const currentUserId = useAuthStore((s) => s.user?.id);

  if (isLoading) return <PageSpinner />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div>
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Messages</h1>

      {(data || []).length === 0 ? (
        <EmptyState icon={MessageSquare} title="No conversations yet" description="Messages from clients will appear here." />
      ) : (
        <div className="flex flex-col gap-2">
          {(data || []).map((c) => {
            const otherParticipant = c.participant_ids.find((id) => id !== currentUserId) || 'Conversation';
            return (
              <Link key={c.id} href={`/worker/messages/${c.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardBody className="flex items-center gap-3">
                    <Avatar name={otherParticipant} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-charcoal">Conversation</p>
                      {c.last_message_at && <p className="text-xs text-muted">{timeAgo(c.last_message_at)}</p>}
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
