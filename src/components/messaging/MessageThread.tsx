'use client';

import { useRef, useState } from 'react';
import { FileText, Paperclip, Send, ShieldCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { ApiError } from '@/lib/api/client';
import { useUploadFile } from '@/lib/api/hooks/useUploads';
import { Message, SendMessageBody, useConversation, useSendMessage } from '@/lib/api/hooks/useMessaging';
import { useAuthStore } from '@/lib/store/auth-store';
import { formatCurrency } from '@/lib/utils/currency';
import { cn } from '@/lib/utils/cn';

const ATTACHMENT_ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf,.doc,.docx';

function QuotationForm({ onSubmit, sending }: { onSubmit: (amount: number, description: string) => void; sending: boolean }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = Number(amount);
        if (!parsed || parsed <= 0) return;
        onSubmit(parsed, description);
      }}
      className="flex flex-col gap-3"
    >
      <p className="text-sm text-muted">
        Quotations shared here are informal — they don't create a contract or move any money. Formal proposals and
        escrow still happen through BoaFie's job flow.
      </p>
      <Input label="Amount (GHS)" type="number" required min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Textarea
        label="What's included"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g. Materials + 2 days labor"
      />
      <Button type="submit" size="sm" loading={sending}>
        Send quotation
      </Button>
    </form>
  );
}

function MessageBubble({ message, mine }: { message: Message; mine: boolean }) {
  if (message.type === 'system' || message.type === 'milestone_update') {
    return (
      <div className="my-1 flex justify-center">
        <span className="rounded-pill bg-black/5 px-3 py-1.5 text-center text-xs text-muted">{message.content}</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-end gap-2', mine && 'flex-row-reverse')}>
      <Avatar src={message.sender?.avatar_url} name={message.sender?.full_name} size={28} />
      <div
        className={cn(
          'max-w-xs rounded-lg px-3.5 py-2.5 text-sm',
          mine ? 'bg-green text-white' : 'bg-black/[0.04] text-charcoal',
        )}
      >
        {message.type === 'quotation' ? (
          <div className={cn('rounded-lg border p-2.5', mine ? 'border-white/25' : 'border-border bg-white')}>
            <p className={cn('text-[11px] font-semibold uppercase tracking-wide', mine ? 'text-white/70' : 'text-muted')}>
              Quotation
            </p>
            <p className="mt-0.5 font-head text-base font-bold">
              {formatCurrency(Number(message.metadata?.amount_ghs))}
            </p>
            {message.content && <p className="mt-1 text-sm">{message.content}</p>}
          </div>
        ) : message.type === 'image' ? (
          <div className="flex flex-col gap-1.5">
            {message.media_urls?.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="Shared attachment" className="max-w-[220px] rounded-lg" />
            ))}
            {message.content && <p>{message.content}</p>}
          </div>
        ) : message.type === 'file' ? (
          <div className="flex flex-col gap-1.5">
            {message.media_urls?.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium underline',
                  mine ? 'border-white/25' : 'border-border',
                )}
              >
                <FileText className="h-4 w-4 shrink-0" /> View document
              </a>
            ))}
            {message.content && <p>{message.content}</p>}
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}

export function MessageThread({ conversationId }: { conversationId: string }) {
  const { data, isLoading, isError, error, refetch } = useConversation(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const uploadFile = useUploadFile();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [text, setText] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [quotationOpen, setQuotationOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  const send = (body: SendMessageBody, onSuccess?: () => void) => {
    setSendError(null);
    sendMessage.mutate(body, {
      onSuccess,
      onError: (err) => setSendError(err instanceof ApiError ? err.message : 'Failed to send message'),
    });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-lg border border-border bg-white">
      <div className="flex items-start gap-2 border-b border-border bg-green-3/40 px-4 py-2.5 text-xs text-charcoal">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" />
        <p>
          For your safety, keep all communication and payments on BoaFie. Always fund and release money through
          escrow — never send money directly to the other party.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col gap-3">
          {data.messages.map((m) => (
            <MessageBubble key={m.id} message={m} mine={m.sender_id === currentUserId} />
          ))}
          {data.messages.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">Say hello to get the conversation started.</p>
          )}
        </div>
      </div>

      {sendError && <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">{sendError}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          send({ content: text, type: 'text' }, () => setText(''));
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ATTACHMENT_ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const isImage = file.type.startsWith('image/');
            setSendError(null);
            uploadFile.mutate(file, {
              onSuccess: (res) => send({ type: isImage ? 'image' : 'file', media_urls: [res.url] }),
              onError: (err) => setSendError(err instanceof ApiError ? err.message : 'Upload failed'),
            });
            e.target.value = '';
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          loading={uploadFile.isPending}
          title="Attach an image or document"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setQuotationOpen(true)}>
          Quote
        </Button>
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

      <Modal open={quotationOpen} onClose={() => setQuotationOpen(false)} title="Send a quotation">
        <QuotationForm
          sending={sendMessage.isPending}
          onSubmit={(amount, description) =>
            send({ type: 'quotation', content: description, metadata: { amount_ghs: amount, description } }, () =>
              setQuotationOpen(false),
            )
          }
        />
      </Modal>
    </div>
  );
}
