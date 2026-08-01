'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { useMe } from '@/lib/api/hooks/useDashboard';
import { api } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { DeleteAccountCard } from '@/components/settings/DeleteAccountCard';

export default function ClientSettingsPage() {
  const { data: me, isLoading } = useMe();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [diaspora, setDiaspora] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (me) {
      setFullName(me.full_name || '');
      setBio(me.bio || '');
      setPhone(me.phone || '');
      setDiaspora(!!me.diaspora_mode);
    }
  }, [me]);

  if (isLoading) return <PageSpinner />;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 font-head text-2xl font-bold text-charcoal">Settings</h1>

      <Card>
        <CardBody>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              setSaved(false);
              setErrorMsg(null);
              try {
                await api.patch('/users/me', { full_name: fullName, bio, phone, diaspora_mode: diaspora });
                queryClient.invalidateQueries({ queryKey: ['me'] });
                setSaved(true);
              } catch (err) {
                setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
              } finally {
                setSaving(false);
              }
            }}
            className="flex flex-col gap-4"
          >
            <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Textarea label="Bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" checked={diaspora} onChange={(e) => setDiaspora(e.target.checked)} />
              I'm hiring from outside Ghana (diaspora mode)
            </label>
            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
            {saved && <p className="text-sm text-green">Saved.</p>}
            <Button type="submit" loading={saving}>
              Save changes
            </Button>
          </form>
        </CardBody>
      </Card>

      <div className="mt-6">
        <DeleteAccountCard />
      </div>
    </div>
  );
}
