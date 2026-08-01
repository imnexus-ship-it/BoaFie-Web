'use client';

import { useState } from 'react';
import { Button, Input, Textarea } from '@/components/ui';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-8">
      <h1 className="font-head text-2xl font-bold text-charcoal">Get in touch</h1>
      <p className="mt-2 mb-6 text-sm text-muted">Questions, feedback, or partnership ideas — we'd love to hear from you.</p>

      {sent ? (
        <p className="rounded-lg bg-green-3 p-4 text-sm text-green">Thanks — we'll get back to you shortly.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Your name" required />
          <Input label="Email" type="email" required />
          <Textarea label="Message" rows={5} required />
          <Button type="submit" className="w-full">
            Send message
          </Button>
        </form>
      )}
    </div>
  );
}
