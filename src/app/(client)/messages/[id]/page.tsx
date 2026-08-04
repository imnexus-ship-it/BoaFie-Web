import { MessageThread } from '@/components/messaging/MessageThread';

export default function ClientConversationPage({ params }: { params: { id: string } }) {
  return <MessageThread conversationId={params.id} />;
}
