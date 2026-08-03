'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AccountTypeStep } from './AccountTypeStep';
import { PersonalInfoStep } from './PersonalInfoStep';
import { VerifyContactStep } from './VerifyContactStep';
import { ProfessionalInfoStep } from './ProfessionalInfoStep';
import { useRedirectIfAuthed } from '@/lib/hooks/useRedirectIfAuthed';
import { dashboardPathForRole } from '@/lib/utils/routing';
import { getPlan, PENDING_PLAN_STORAGE_KEY } from '@/lib/constants/plans';

type Step = 'account_type' | 'personal_info' | 'verify_contact' | 'professional_info';
type Role = 'client' | 'artisan' | 'freelancer';

export function SignupWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const requestedRole = params.get('role');
  const initialRole: Role = requestedRole === 'artisan' || requestedRole === 'freelancer' ? requestedRole : 'client';

  const [role, setRole] = useState<Role>(initialRole);
  const [step, setStep] = useState<Step>('account_type');

  // Only guard the very first step — registration happens mid-wizard
  // (PersonalInfoStep), so `user` goes non-null well before the flow is
  // actually done; bouncing on that would skip contact verification and
  // professional info entirely.
  const { checking } = useRedirectIfAuthed(step === 'account_type');

  const selectedPlan = getPlan(params.get('plan'));
  const planApplies = role !== 'client';

  useEffect(() => {
    if (!selectedPlan || !planApplies) return;
    localStorage.setItem(
      PENDING_PLAN_STORAGE_KEY,
      JSON.stringify({ slug: selectedPlan.slug, selectedAt: new Date().toISOString() }),
    );
  }, [selectedPlan, planApplies]);

  if (checking) return null;

  const isWorker = role !== 'client';
  const steps: Step[] = isWorker
    ? ['account_type', 'personal_info', 'verify_contact', 'professional_info']
    : ['account_type', 'personal_info', 'verify_contact'];
  const stepIndex = steps.indexOf(step);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const finish = () => router.push(dashboardPathForRole(role));

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
        <AccountTypeStep value={role} onChange={(v) => { setRole(v); setStep('personal_info'); }} />
      )}

      {step === 'personal_info' && (
        <PersonalInfoStep role={role} onRegistered={() => setStep('verify_contact')} />
      )}

      {step === 'verify_contact' && (
        <VerifyContactStep onNext={() => (isWorker ? setStep('professional_info') : finish())} />
      )}

      {step === 'professional_info' && isWorker && (
        <ProfessionalInfoStep role={role} onDone={finish} />
      )}
    </div>
  );
}
