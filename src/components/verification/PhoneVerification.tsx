'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useConfirmPhoneOtp, useSendPhoneOtp } from '@/lib/api/hooks/useVerification';

export function PhoneVerification({ onVerified }: { onVerified?: () => void }) {
  const sendOtp = useSendPhoneOtp();
  const confirmOtp = useConfirmPhoneOtp();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (confirmOtp.isSuccess) {
    return <p className="text-sm font-medium text-green">Phone verified ✓</p>;
  }

  if (!sentTo) {
    return (
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          sendOtp.mutate(phone, { onSuccess: () => setSentTo(phone) });
        }}
      >
        <Input
          label="Phone number"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 0244000000"
        />
        {sendOtp.isError && <p className="text-sm text-red-600">{sendOtp.error.message}</p>}
        <Button type="submit" size="sm" loading={sendOtp.isPending} className="w-fit">
          Send code
        </Button>
      </form>
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        confirmOtp.mutate({ phone: sentTo, code }, { onSuccess: () => onVerified?.() });
      }}
    >
      <p className="text-sm text-muted">Enter the code sent to {sentTo}.</p>
      <Input
        label="Verification code"
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
      />
      {confirmOtp.isError && <p className="text-sm text-red-600">{confirmOtp.error.message}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={confirmOtp.isPending} className="w-fit">
          Confirm
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setSentTo(null)}>
          Change number
        </Button>
      </div>
    </form>
  );
}
