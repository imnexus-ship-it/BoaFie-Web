'use client';

import { useState } from 'react';
import { Button, Input, Textarea } from '@/components/ui';
import { useSubmitContact } from '@/lib/api/hooks/useContact';

const SUPPORT_EMAIL = 'info.boafietechltd@gmail.com';

export default function ContactPage() {
  const submit = useSubmitContact();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-8">
      <h1 className="font-head text-2xl font-bold text-charcoal">Get in touch</h1>
      <p className="mt-2 mb-6 text-sm text-muted">Questions, feedback, or partnership ideas — we'd love to hear from you.</p>

      {submit.isSuccess ? (
        <p className="rounded-lg bg-green-3 p-4 text-sm text-green">
          Thanks — your message has been sent. We'll get back to you at {email} soon. You can also reach us directly at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate({ name, email, message });
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Your name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Textarea label="Message" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} />
          {submit.isError && <p className="text-sm text-red-600">{submit.error.message}</p>}
          <Button type="submit" loading={submit.isPending} className="w-full">
            Send message
          </Button>
        </form>
      )}
    </div>
  );
}
