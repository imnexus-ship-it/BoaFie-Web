'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useLogin } from '@/lib/api/hooks/useAuth';
import { dashboardPathForRole } from '@/lib/utils/routing';

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        login.mutate(
          { email, password },
          {
            onSuccess: (data) => {
              router.push(dashboardPathForRole(data.user.role));
            },
          },
        );
      }}
      className="flex flex-col gap-4"
    >
      <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      {login.isError && <p className="text-sm text-red-600">{login.error.message}</p>}
      <Button type="submit" loading={login.isPending} className="mt-2 w-full">
        Log in
      </Button>
    </form>
  );
}
