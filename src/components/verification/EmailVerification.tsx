'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useConfirmEmailCode, useSendEmailCode } from '@/lib/api/hooks/useVerification';

export function EmailVerification({ onVerified }: { onVerified?: () => void }) {
  const sendCode = useSendEmailCode();
  const confirmCode = useConfirmEmailCode();
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);

  if (confirmCode.isSuccess) {
    return <p className="text-sm font-medium text-green">Email verified ✓</p>;
  }

  if (!sent) {
    return (
      <div className="flex flex-col gap-3">
        {sendCode.isError && <p className="text-sm text-red-600">{sendCode.error.message}</p>}
        <Button
          type="button"
          size="sm"
          loading={sendCode.isPending}
          className="w-fit"
          onClick={() => sendCode.mutate(undefined, { onSuccess: () => setSent(true) })}
        >
          Send code
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        confirmCode.mutate(code, { onSuccess: () => onVerified?.() });
      }}
    >
      <p className="text-sm text-muted">Enter the code we sent to your email.</p>
      <Input
        label="Verification code"
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
      />
      {confirmCode.isError && <p className="text-sm text-red-600">{confirmCode.error.message}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={confirmCode.isPending} className="w-fit">
          Confirm
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setSent(false)}>
          Resend code
        </Button>
      </div>
    </form>
  );
}
