'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { useRegister } from '@/lib/api/hooks/useAuth';
import { CITY_NAME_PATTERN, COUNTRIES, DEFAULT_COUNTRY_CODE, findCountry, isValidPhoneForCountry } from '@/lib/constants/countries';

const CONTACT_METHODS = ['email', 'phone', 'whatsapp'] as const;

export function PersonalInfoStep({
  role,
  onRegistered,
}: {
  role: 'client' | 'artisan' | 'freelancer';
  onRegistered: () => void;
}) {
  const register = useRegister();
  const isWorker = role !== 'client';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [mobile, setMobile] = useState('');
  const [residenceCode, setResidenceCode] = useState(DEFAULT_COUNTRY_CODE);
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [contactMethod, setContactMethod] = useState<(typeof CONTACT_METHODS)[number]>('phone');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [confirmedAccurate, setConfirmedAccurate] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [cityError, setCityError] = useState<string | undefined>();

  const dialCode = findCountry(countryCode)?.dialCode ?? '';
  const residenceCountry = findCountry(residenceCode);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="mb-1 font-head text-lg font-semibold text-charcoal">Your details</h2>
        <p className="text-sm text-muted">
          {isWorker ? 'Takes about 3-5 minutes.' : 'Takes about 2-3 minutes.'}
        </p>
      </div>

      <SocialAuthButtons role={role} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          let hasError = false;

          if (password !== confirmPassword) {
            setPasswordMismatch(true);
            hasError = true;
          } else {
            setPasswordMismatch(false);
          }

          const phoneDigits = mobile.replace(/\D/g, '');
          if (!isValidPhoneForCountry(phoneDigits, countryCode)) {
            const expected = findCountry(countryCode)?.phoneDigits;
            setPhoneError(
              expected
                ? `Enter a valid ${countryCode} number (${expected.min === expected.max ? expected.min : `${expected.min}-${expected.max}`} digits)`
                : 'Enter a valid phone number',
            );
            hasError = true;
          } else {
            setPhoneError(undefined);
          }

          if (!CITY_NAME_PATTERN.test(city.trim())) {
            setCityError('Enter a valid city/town name (letters only)');
            hasError = true;
          } else {
            setCityError(undefined);
          }

          if (hasError) return;

          register.mutate(
            {
              email,
              password,
              full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
              role,
              phone: phoneDigits ? `${dialCode}${phoneDigits}` : undefined,
              country_of_residence: residenceCountry?.name,
              region: region || undefined,
              city: city.trim() || undefined,
              date_of_birth: isWorker && dateOfBirth ? dateOfBirth : undefined,
              referral_code: referralCode || undefined,
              preferred_contact_method: !isWorker ? contactMethod : undefined,
              marketing_opt_in: marketingOptIn,
              accepted_terms: true,
            },
            { onSuccess: onRegistered },
          );
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Last name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

        <div className="grid grid-cols-[auto_1fr] gap-3">
          <Select
            label="Code"
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
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
            label="Mobile number"
            required
            inputMode="numeric"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/[^\d\s]/g, ''))}
            placeholder="244 000 000"
            error={phoneError}
          />
        </div>

        <Select
          label="Country of residence"
          required
          value={residenceCode}
          onChange={(e) => {
            setResidenceCode(e.target.value);
            setRegion('');
          }}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          {residenceCountry && residenceCountry.regions.length > 0 ? (
            <Select label="Region / State" required value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">Select a region…</option>
              {residenceCountry.regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              label="Region / State"
              required
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Region / state / province"
            />
          )}
          <Input
            label="City / Town"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Accra"
            error={cityError}
          />
        </div>

        {isWorker && (
          <Input
            label="Date of birth"
            type="date"
            required
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        )}

        {!isWorker && (
          <Select label="Preferred contact method" value={contactMethod} onChange={(e) => setContactMethod(e.target.value as typeof contactMethod)}>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </Select>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          <Input
            label="Confirm password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={passwordMismatch ? 'Passwords do not match' : undefined}
          />
        </div>

        <Input
          label="Referral code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <label className="flex items-start gap-2 text-sm text-charcoal">
            <input
              type="checkbox"
              required
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5"
            />
            I agree to BoaFie's Terms of Service and Privacy Policy.
          </label>
          <label className="flex items-start gap-2 text-sm text-charcoal">
            <input
              type="checkbox"
              required
              checked={confirmedAccurate}
              onChange={(e) => setConfirmedAccurate(e.target.checked)}
              className="mt-0.5"
            />
            I confirm that the information provided is accurate.
          </label>
          <label className="flex items-start gap-2 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-0.5"
            />
            Send me relevant service updates and opportunities.
          </label>
        </div>

        {register.isError && <p className="text-sm text-red-600">{register.error.message}</p>}
        <Button type="submit" loading={register.isPending} className="w-full">
          Continue
        </Button>
      </form>
    </div>
  );
}
