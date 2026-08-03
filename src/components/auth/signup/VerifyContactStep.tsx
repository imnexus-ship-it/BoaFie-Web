'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PhoneVerification } from '@/components/verification/PhoneVerification';
import { EmailVerification } from '@/components/verification/EmailVerification';

export function VerifyContactStep({ onNext }: { onNext: () => void }) {
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-1 font-head text-lg font-semibold text-charcoal">Verify your contact details</h2>
        <p className="text-sm text-muted">This keeps your account secure and lets clients and workers reach you.</p>
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="mb-3 text-sm font-medium text-charcoal">Email</p>
        <EmailVerification onVerified={() => setEmailVerified(true)} />
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="mb-3 text-sm font-medium text-charcoal">Phone</p>
        <PhoneVerification onVerified={() => setPhoneVerified(true)} />
      </div>

      <Button onClick={onNext} disabled={!phoneVerified || !emailVerified} className="w-full">
        Continue
      </Button>
    </div>
  );
}
