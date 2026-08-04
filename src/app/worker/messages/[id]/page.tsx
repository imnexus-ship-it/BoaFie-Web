import { MessageThread } from '@/components/messaging/MessageThread';

export default function WorkerConversationPage({ params }: { params: { id: string } }) {
  return <MessageThread conversationId={params.id} />;
}
