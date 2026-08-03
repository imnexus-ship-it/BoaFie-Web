'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { SignupWizard } from '@/components/auth/signup/SignupWizard';

export default function SignupPage() {
  return (
    <div>
      <Suspense fallback={null}>
        <SignupWizard />
      </Suspense>
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-green hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
