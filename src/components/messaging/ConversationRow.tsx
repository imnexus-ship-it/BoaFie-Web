'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Card, CardBody } from '@/components/ui/Card';
import { usePublicProfile } from '@/lib/api/hooks/useUsers';
import { Conversation } from '@/lib/api/hooks/useMessaging';
import { timeAgo } from '@/lib/utils/date';

export function ConversationRow({
  conversation,
  currentUserId,
  linkBase,
}: {
  conversation: Conversation;
  currentUserId: string | undefined;
  linkBase: string;
}) {
  const otherParticipantId = conversation.participant_ids.find((id) => id !== currentUserId);
  const { data: profile } = usePublicProfile(otherParticipantId);

  return (
    <Link href={`${linkBase}/${conversation.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardBody className="flex items-center gap-3">
          <Avatar src={profile?.avatar_url} name={profile?.full_name} size={40} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-charcoal">{profile?.full_name || 'Conversation'}</p>
            {conversation.last_message_at && <p className="text-xs text-muted">{timeAgo(conversation.last_message_at)}</p>}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
