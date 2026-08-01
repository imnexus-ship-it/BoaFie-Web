'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  yahoo: "Yahoo sign-in didn't go through. Please try again.",
  missing_code: 'That sign-in link looks incomplete. Please try again.',
  exchange_failed: "That sign-in link has expired. Please try signing in again.",
};

function OAuthErrorBanner() {
  const params = useSearchParams();
  const errorCode = params.get('oauth_error');
  if (!errorCode) return null;
  return (
    <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
      {OAUTH_ERROR_MESSAGES[errorCode] ?? 'Something went wrong signing you in. Please try again.'}
    </p>
  );
}

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-1 font-head text-xl font-bold text-charcoal">Welcome back</h1>
      <p className="mb-6 text-sm text-muted">Log in to your BoaFie account.</p>
      <Suspense fallback={null}>
        <OAuthErrorBanner />
      </Suspense>
      <LoginForm />
      <p className="mt-5 text-center text-sm text-muted">
        <Link href="/forgot-password" className="font-medium text-green hover:underline">
          Forgot your password?
        </Link>
      </p>
      <p className="mt-3 text-center text-sm text-muted">
        New here?{' '}
        <Link href="/signup" className="font-medium text-green hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
