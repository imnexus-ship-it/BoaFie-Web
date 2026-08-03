'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateBusinessProfile } from '@/lib/api/hooks/useBusiness';

const BUSINESS_TYPES = [
  { value: 'sole_proprietorship', label: 'Sole proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llc', label: 'Limited liability company' },
  { value: 'ngo', label: 'NGO' },
  { value: 'religious_org', label: 'Church or religious organisation' },
  { value: 'school', label: 'School' },
  { value: 'government', label: 'Government institution' },
  { value: 'other', label: 'Other' },
];

export function BusinessInfoStep({ onDone }: { onDone: () => void }) {
  const create = useCreateBusinessProfile();

  const [legalName, setLegalName] = useState('');
  const [tradingName, setTradingName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="mb-1 font-head text-lg font-semibold text-charcoal">Tell us about your business</h2>
        <p className="text-sm text-muted">
          Verification documents, team access, and plan selection come later — this just gets your business account set up.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate(
            {
              legal_business_name: legalName,
              trading_name: tradingName || undefined,
              business_type: businessType || undefined,
              registration_number: regNumber || undefined,
              tax_id: taxId || undefined,
              industry: industry || undefined,
              business_email: businessEmail || undefined,
              business_phone: businessPhone || undefined,
              region: region || undefined,
              city: city || undefined,
            },
            { onSuccess: onDone },
          );
        }}
        className="flex flex-col gap-4"
      >
        <Input label="Legal business name" required value={legalName} onChange={(e) => setLegalName(e.target.value)} />
        <Input label="Trading name (optional)" value={tradingName} onChange={(e) => setTradingName(e.target.value)} />

        <Select label="Business type" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
          <option value="">Select a type…</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Registration number" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} />
          <Input label="Tax ID (optional)" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
        </div>

        <Input label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Construction, Hospitality" />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Business email (optional)" type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} />
          <Input label="Business phone (optional)" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Region / State" value={region} onChange={(e) => setRegion(e.target.value)} />
          <Input label="City / Town" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        {create.isError && <p className="text-sm text-red-600">{create.error.message}</p>}
        <Button type="submit" loading={create.isPending} className="w-full">
          Finish sign up
        </Button>
      </form>
    </div>
  );
}
