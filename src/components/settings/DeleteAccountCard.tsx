'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { api, ApiError } from '@/lib/api/client';
import { useLogout } from '@/lib/api/hooks/useAuth';

export function DeleteAccountCard() {
  const router = useRouter();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Card className="border-red-200">
        <CardBody>
          <h2 className="font-head text-base font-semibold text-charcoal">Delete account</h2>
          <p className="mt-1 text-sm text-muted">
            This permanently disables login and removes your name, email, phone, and bio from your profile.
            Contract and payment history that other users rely on is kept. You can't delete your account while a
            contract is in progress.
          </p>
          <Button variant="danger" size="sm" className="mt-4" onClick={() => setOpen(true)}>
            Delete my account
          </Button>
        </CardBody>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Delete your account?">
        <p className="text-sm text-charcoal">
          This can't be undone. Type <span className="font-semibold">DELETE</span> to confirm.
        </p>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="DELETE"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={confirmText !== 'DELETE'}
            loading={deleting}
            onClick={async () => {
              setDeleting(true);
              setError(null);
              try {
                await api.delete('/users/me');
                logout();
                router.push('/');
              } catch (err) {
                setError(err instanceof ApiError ? err.message : 'Something went wrong');
              } finally {
                setDeleting(false);
              }
            }}
          >
            Delete permanently
          </Button>
        </div>
      </Modal>
    </>
  );
}
