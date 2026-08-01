'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { RoleSelector } from './RoleSelector';
import { useRegister } from '@/lib/api/hooks/useAuth';
import { dashboardPathForRole } from '@/lib/utils/routing';

export function SignupForm() {
  const router = useRouter();
  const register = useRegister();
  const [role, setRole] = useState<'client' | 'artisan' | 'freelancer'>('client');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        register.mutate(
          { email, password, full_name: fullName, role },
          {
            onSuccess: (data) => {
              router.push(dashboardPathForRole(data.user.role));
            },
          },
        );
      }}
      className="flex flex-col gap-5"
    >
      <div>
        <p className="mb-2 text-sm font-medium text-charcoal">I want to…</p>
        <RoleSelector value={role} onChange={(v) => setRole(v as typeof role)} />
      </div>
      <Input label="Full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Kofi Mensah" />
      <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <Input
        label="Password"
        type="password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 8 characters"
      />
      {register.isError && <p className="text-sm text-red-600">{register.error.message}</p>}
      <Button type="submit" loading={register.isPending} className="w-full">
        Create account
      </Button>
    </form>
  );
}
