'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AccountTypeStep, AccountKind } from './AccountTypeStep';
import { PersonalInfoStep } from './PersonalInfoStep';
import { VerifyContactStep } from './VerifyContactStep';
import { ProfessionalInfoStep } from './ProfessionalInfoStep';
import { BusinessInfoStep } from './BusinessInfoStep';
import { useRedirectIfAuthed } from '@/lib/hooks/useRedirectIfAuthed';
import { dashboardPathForRole } from '@/lib/utils/routing';
import { getPlan, PENDING_PLAN_STORAGE_KEY } from '@/lib/constants/plans';

type Step = 'account_type' | 'personal_info' | 'verify_contact' | 'professional_info' | 'business_info';

export function SignupWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const requestedRole = params.get('role');
  const initialKind: AccountKind = requestedRole === 'artisan' || requestedRole === 'freelancer' ? requestedRole : 'client';

  const [accountKind, setAccountKind] = useState<AccountKind>(initialKind);
  const [step, setStep] = useState<Step>('account_type');

  // Business shares the `client` API role — reuses jobs/proposals/wallet
  // exactly as any client does — but needs its own extra step, so it's
  // tracked separately from the role sent to the register endpoint.
  const apiRole: 'client' | 'artisan' | 'freelancer' = accountKind === 'business' ? 'client' : accountKind;

  // Only guard the very first step — registration happens mid-wizard
  // (PersonalInfoStep), so `user` goes non-null well before the flow is
  // actually done; bouncing on that would skip contact verification and
  // professional/business info entirely.
  const { checking } = useRedirectIfAuthed(step === 'account_type');

  const selectedPlan = getPlan(params.get('plan'));
  const planApplies = accountKind !== 'client' && accountKind !== 'business';

  useEffect(() => {
    if (!selectedPlan || !planApplies) return;
    localStorage.setItem(
      PENDING_PLAN_STORAGE_KEY,
      JSON.stringify({ slug: selectedPlan.slug, selectedAt: new Date().toISOString() }),
    );
  }, [selectedPlan, planApplies]);

  if (checking) return null;

  const isWorker = accountKind === 'artisan' || accountKind === 'freelancer';
  const isBusiness = accountKind === 'business';
  const steps: Step[] = isWorker
    ? ['account_type', 'personal_info', 'verify_contact', 'professional_info']
    : isBusiness
      ? ['account_type', 'personal_info', 'verify_contact', 'business_info']
      : ['account_type', 'personal_info', 'verify_contact'];
  const stepIndex = steps.indexOf(step);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const finish = () => router.push(dashboardPathForRole(apiRole));

  return (
    <div className="flex flex-col gap-6">
      {step !== 'account_type' && <ProgressBar value={progress} />}

      {selectedPlan && planApplies && step === 'account_type' && (
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

      {step === 'account_type' && (
        <AccountTypeStep value={accountKind} onChange={(v) => { setAccountKind(v); setStep('personal_info'); }} />
      )}

      {step === 'personal_info' && (
        <PersonalInfoStep role={apiRole} onRegistered={() => setStep('verify_contact')} />
      )}

      {step === 'verify_contact' && (
        <VerifyContactStep
          onNext={() => {
            if (isWorker) setStep('professional_info');
            else if (isBusiness) setStep('business_info');
            else finish();
          }}
        />
      )}

      {step === 'professional_info' && isWorker && (
        <ProfessionalInfoStep role={accountKind as 'artisan' | 'freelancer'} onDone={finish} />
      )}

      {step === 'business_info' && isBusiness && <BusinessInfoStep onDone={finish} />}
    </div>
  );
}
