'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { api } from '@/lib/api/client';

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
          await api.post('/auth/reset-password', { token, new_password: password }, { auth: false });
          router.push('/login');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
          setLoading(false);
        }
      }}
      className="flex flex-col gap-4"
    >
      <Input
        label="New password"
        type="password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" loading={loading} className="w-full">
        Update password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div>
      <h1 className="mb-1 font-head text-xl font-bold text-charcoal">Set a new password</h1>
      <p className="mb-6 text-sm text-muted">Choose a new password for your account.</p>
      <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
