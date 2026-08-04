'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bot, MessageCircleQuestion, Send, X } from 'lucide-react';
import { ApiError } from '@/lib/api/client';
import { useSupportChat, type SupportChatMessage } from '@/lib/api/hooks/useSupportChat';
import { cn } from '@/lib/utils/cn';

const GREETING =
  "Hi! I'm the BoaFie support assistant. Ask me anything about how escrow, verification, disputes, or payments work.";

export function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const chat = useSupportChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, chat.isPending]);

  const send = () => {
    const content = text.trim();
    if (!content || chat.isPending) return;
    setError(null);
    // Cap what's sent to the last 20 turns — matches the backend's own cap,
    // keeps token cost bounded on long-running conversations.
    const next = [...messages, { role: 'user' as const, content }].slice(-20);
    setMessages(next);
    setText('');
    chat.mutate(next, {
      onSuccess: (res) => setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]),
      onError: (err) => setError(err instanceof ApiError ? err.message : 'Something went wrong — please try again.'),
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-[90]">
      {open && (
        <div className="mb-3 flex h-[480px] w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-lg border border-border bg-white shadow-xl">
          <div className="flex items-center justify-between bg-gradient-to-br from-navy to-green px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-gold-2" />
              <span className="font-head text-sm font-semibold">BoaFie Support</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close support chat" className="rounded-lg p-1 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            <div className="max-w-[85%] rounded-lg bg-black/[0.04] px-3 py-2 text-sm text-charcoal">{GREETING}</div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  'max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm',
                  m.role === 'user' ? 'ml-auto bg-green text-white' : 'bg-black/[0.04] text-charcoal',
                )}
              >
                {m.content}
              </div>
            ))}
            {chat.isPending && (
              <div className="max-w-[85%] rounded-lg bg-black/[0.04] px-3 py-2 text-sm text-muted">Typing…</div>
            )}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {error.replace(/\.?$/, '.')} You can also{' '}
                <Link href="/contact" className="font-medium underline">
                  contact support directly
                </Link>
                .
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
            />
            <button
              type="submit"
              disabled={chat.isPending || !text.trim()}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close support chat' : 'Open support chat'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green text-white shadow-xl transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircleQuestion className="h-6 w-6" />}
      </button>
    </div>
  );
}
