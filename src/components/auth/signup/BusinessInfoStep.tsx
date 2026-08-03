'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateBusinessProfile } from '@/lib/api/hooks/useBusiness';
import { CITY_NAME_PATTERN, COUNTRIES, DEFAULT_COUNTRY_CODE, findCountry, isValidPhoneForCountry } from '@/lib/constants/countries';

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
  const [businessCountryCode, setBusinessCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [cityError, setCityError] = useState<string | undefined>();

  const businessCountry = findCountry(businessCountryCode);

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
          let hasError = false;

          const phoneDigits = businessPhone.replace(/\D/g, '');
          if (phoneDigits && !isValidPhoneForCountry(phoneDigits, businessCountryCode)) {
            const expected = businessCountry?.phoneDigits;
            setPhoneError(
              expected
                ? `Enter a valid ${businessCountryCode} number (${expected.min === expected.max ? expected.min : `${expected.min}-${expected.max}`} digits)`
                : 'Enter a valid phone number',
            );
            hasError = true;
          } else {
            setPhoneError(undefined);
          }

          if (city.trim() && !CITY_NAME_PATTERN.test(city.trim())) {
            setCityError('Enter a valid city/town name (letters only)');
            hasError = true;
          } else {
            setCityError(undefined);
          }

          if (hasError) return;

          create.mutate(
            {
              legal_business_name: legalName,
              trading_name: tradingName || undefined,
              business_type: businessType || undefined,
              registration_number: regNumber || undefined,
              tax_id: taxId || undefined,
              industry: industry || undefined,
              business_email: businessEmail || undefined,
              business_phone: phoneDigits || undefined,
              region: region || undefined,
              city: city.trim() || undefined,
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

        <Input label="Business email (optional)" type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} />

        <div className="grid grid-cols-[auto_1fr] gap-3">
          <Select
            label="Code"
            value={businessCountryCode}
            onChange={(e) => {
              setBusinessCountryCode(e.target.value);
              setRegion('');
              setPhoneError(undefined);
            }}
            className="w-28"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.dialCode} {c.code}
              </option>
            ))}
          </Select>
          <Input
            label="Business phone (optional)"
            inputMode="numeric"
            value={businessPhone}
            onChange={(e) => setBusinessPhone(e.target.value.replace(/[^\d\s]/g, ''))}
            error={phoneError}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select label="Region / State" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">Select a region…</option>
            {businessCountry?.regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          <Input label="City / Town" value={city} onChange={(e) => setCity(e.target.value)} error={cityError} />
        </div>

        {create.isError && <p className="text-sm text-red-600">{create.error.message}</p>}
        <Button type="submit" loading={create.isPending} className="w-full">
          Finish sign up
        </Button>
      </form>
    </div>
  );
}
