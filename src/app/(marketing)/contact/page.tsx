'use client';

import { useState } from 'react';
import { Button, Input, Textarea } from '@/components/ui';

const SUPPORT_EMAIL = 'support@boafie.app';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-8">
      <h1 className="font-head text-2xl font-bold text-charcoal">Get in touch</h1>
      <p className="mt-2 mb-6 text-sm text-muted">Questions, feedback, or partnership ideas — we'd love to hear from you.</p>

      {sent ? (
        <p className="rounded-lg bg-green-3 p-4 text-sm text-green">
          Your email app should have opened with your message ready to send. If it didn't, email us directly at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const subject = `Message from ${name} via boafie.app`;
            const body = `${message}\n\n—\n${name}\n${email}`;
            window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            setSent(true);
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Your name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Textarea label="Message" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button type="submit" className="w-full">
            Send message
          </Button>
        </form>
      )}
    </div>
  );
}
