'use client';

import { useState } from 'react';
import { Camera, FileBadge, MapPin, Phone, ShieldCheck, UserSquare2 } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PageSpinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { VerificationStatusBadge } from '@/components/verification/VerificationBadge';
import { PhoneVerification } from '@/components/verification/PhoneVerification';
import { useVerificationStatus } from '@/lib/api/hooks/useVerification';
import {
  useSubmitId,
  useSubmitLocation,
  useSubmitSelfie,
  useSubmitTradeCert,
} from '@/lib/api/hooks/useVerification';

const STEPS = [
  { key: 'phone_status', label: 'Phone number', icon: Phone },
  { key: 'id_status', label: 'Government ID', icon: UserSquare2 },
  { key: 'selfie_status', label: 'Selfie verification', icon: Camera },
  { key: 'location_status', label: 'Location confirmation', icon: MapPin },
  { key: 'trade_cert_status', label: 'Trade certificate (optional)', icon: FileBadge },
] as const;

function StepBadge({ status }: { status: string }) {
  if (status === 'verified') return <span className="text-xs font-semibold text-green">Verified</span>;
  if (status === 'pending') return <span className="text-xs font-semibold text-gold">Pending review</span>;
  if (status === 'rejected') return <span className="text-xs font-semibold text-red-600">Rejected — resubmit</span>;
  return <span className="text-xs text-muted">Not submitted</span>;
}

function PhoneStep() {
  return <PhoneVerification />;
}

function IdStep() {
  const submit = useSubmitId();
  const [idType, setIdType] = useState('ghana_card');
  const [idNumber, setIdNumber] = useState('');
  const [frontUrl, setFrontUrl] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit.mutate({ id_type: idType, id_number: idNumber, id_front_url: frontUrl });
      }}
      className="flex flex-col gap-3"
    >
      <Select label="ID type" value={idType} onChange={(e) => setIdType(e.target.value)}>
        <option value="ghana_card">Ghana Card</option>
        <option value="passport">Passport</option>
        <option value="drivers_license">Driver's license</option>
      </Select>
      <Input label="ID number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required />
      <FileUpload label="Front photo" value={frontUrl} onUploaded={setFrontUrl} />
      {submit.isError && <p className="text-sm text-red-600">{submit.error.message}</p>}
      <Button type="submit" size="sm" loading={submit.isPending} disabled={!frontUrl} className="w-fit">
        Submit ID
      </Button>
    </form>
  );
}

function SelfieStep() {
  const submit = useSubmitSelfie();
  const [url, setUrl] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit.mutate(url);
      }}
      className="flex flex-col gap-3"
    >
      <FileUpload label="Selfie photo" value={url} onUploaded={setUrl} />
      {submit.isError && <p className="text-sm text-red-600">{submit.error.message}</p>}
      <Button type="submit" size="sm" loading={submit.isPending} disabled={!url} className="w-fit">
        Submit selfie
      </Button>
    </form>
  );
}

function LocationStep() {
  const submit = useSubmitLocation();
  const [locationText, setLocationText] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!navigator.geolocation) {
          submit.mutate({ lat: 5.6037, lng: -0.187, location_text: locationText }); // Accra fallback
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => submit.mutate({ lat: pos.coords.latitude, lng: pos.coords.longitude, location_text: locationText }),
          () => submit.mutate({ lat: 5.6037, lng: -0.187, location_text: locationText }),
        );
      }}
      className="flex flex-col gap-3"
    >
      <Input
        label="Location description"
        value={locationText}
        onChange={(e) => setLocationText(e.target.value)}
        placeholder="e.g. East Legon, Accra"
        required
      />
      <p className="text-xs text-muted">We'll ask your browser for your current coordinates to confirm this.</p>
      {submit.isError && <p className="text-sm text-red-600">{submit.error.message}</p>}
      <Button type="submit" size="sm" loading={submit.isPending} className="w-fit">
        Confirm location
      </Button>
    </form>
  );
}

function TradeCertStep() {
  const submit = useSubmitTradeCert();
  const [url, setUrl] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit.mutate(url);
      }}
      className="flex flex-col gap-3"
    >
      <FileUpload label="Certificate photo" value={url} onUploaded={setUrl} />
      {submit.isError && <p className="text-sm text-red-600">{submit.error.message}</p>}
      <Button type="submit" size="sm" variant="secondary" loading={submit.isPending} disabled={!url} className="w-fit">
        Submit certificate
      </Button>
    </form>
  );
}

const STEP_FORMS: Record<string, React.ComponentType> = {
  phone_status: PhoneStep,
  id_status: IdStep,
  selfie_status: SelfieStep,
  location_status: LocationStep,
  trade_cert_status: TradeCertStep,
};

export default function VerificationPage() {
  const { data, isLoading, isError, error, refetch } = useVerificationStatus();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (isLoading) return <PageSpinner />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  const statuses = data || ({} as any);
  const completedCount = STEPS.filter((s) => statuses[s.key] === 'verified').length;
  const progress = (completedCount / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-head text-2xl font-bold text-charcoal">Verification</h1>
          <p className="text-sm text-muted">Complete every step to earn your Verified badge.</p>
        </div>
        <VerificationStatusBadge verified={!!statuses.overall_verified} />
      </div>

      <Card className="mb-6">
        <CardBody>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-charcoal">{completedCount} of {STEPS.length} complete</span>
            <ShieldCheck className="h-4 w-4 text-green" />
          </div>
          <ProgressBar value={progress} />
        </CardBody>
      </Card>

      <div className="flex flex-col gap-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const StepForm = STEP_FORMS[step.key];
          const status = statuses[step.key] || 'unverified';
          const isOpen = expanded === step.key;
          return (
            <Card key={step.key}>
              <CardBody>
                <button
                  className="flex w-full items-center justify-between gap-3"
                  onClick={() => setExpanded(isOpen ? null : step.key)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-green" />
                    <span className="text-sm font-medium text-charcoal">{step.label}</span>
                  </div>
                  <StepBadge status={status} />
                </button>
                {isOpen && status !== 'verified' && (
                  <div className="mt-4 border-t border-border pt-4">
                    <StepForm />
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
