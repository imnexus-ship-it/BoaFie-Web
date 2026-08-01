'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { api } from '@/lib/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h1 className="mb-1 font-head text-xl font-bold text-charcoal">Reset your password</h1>
      <p className="mb-6 text-sm text-muted">We'll send a reset link to your email.</p>

      {sent ? (
        <p className="rounded-lg bg-green-3 p-4 text-sm text-green">
          If an account exists for {email}, a reset link is on its way.
        </p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              await api.post('/auth/forgot-password', { email }, { auth: false });
            } finally {
              setLoading(false);
              setSent(true);
            }
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" loading={loading} className="w-full">
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-muted">
        <Link href="/login" className="font-medium text-green hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
