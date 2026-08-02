'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { RoleSelector } from './RoleSelector';
import { SocialAuthButtons } from './SocialAuthButtons';
import { useRegister } from '@/lib/api/hooks/useAuth';
import { dashboardPathForRole } from '@/lib/utils/routing';
import { getPlan, PENDING_PLAN_STORAGE_KEY } from '@/lib/constants/plans';

export function SignupForm() {
  const router = useRouter();
  const register = useRegister();
  const params = useSearchParams();
  const requestedRole = params.get('role');
  const initialRole = requestedRole === 'artisan' || requestedRole === 'freelancer' ? requestedRole : 'client';
  const [role, setRole] = useState<'client' | 'artisan' | 'freelancer'>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const selectedPlan = getPlan(params.get('plan'));
  const planApplies = role !== 'client';

  // Recorded as soon as the intent is known, not gated behind the register
  // mutation's onSuccess: useRedirectIfAuthed can navigate away the instant
  // setSession fires (inside useRegister's own onSuccess), racing past a
  // per-call onSuccess here. This also covers the Google/Yahoo signup paths,
  // which never go through this form's submit handler at all.
  useEffect(() => {
    if (!selectedPlan || !planApplies) return;
    localStorage.setItem(
      PENDING_PLAN_STORAGE_KEY,
      JSON.stringify({ slug: selectedPlan.slug, selectedAt: new Date().toISOString() }),
    );
  }, [selectedPlan, planApplies]);

  return (
    <div className="flex flex-col gap-5">
      {selectedPlan && planApplies && (
        <div className="rounded-lg border border-green/30 bg-green-3/40 p-3 text-sm text-charcoal">
          You selected <span className="font-semibold">{selectedPlan.name}</span>
          {selectedPlan.priceSuffix && (
            <>
              {' '}
              (<span className="font-semibold">{selectedPlan.price}{selectedPlan.priceSuffix}</span>)
            </>
          )}
          . We'll save this and get you upgraded once your account is set up.
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-charcoal">I want to…</p>
        <RoleSelector value={role} onChange={(v) => setRole(v as typeof role)} />
      </div>

      <SocialAuthButtons role={role} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          register.mutate(
            { email, password, full_name: fullName, role },
            { onSuccess: (data) => router.push(dashboardPathForRole(data.user.role)) },
          );
        }}
        className="flex flex-col gap-5"
      >
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
    </div>
  );
}
