'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageSpinner } from '@/components/ui/Spinner';
import { useExchangeHandoff } from '@/lib/api/hooks/useAuth';
import { dashboardPathForRole } from '@/lib/utils/routing';

/** Lands here after the Yahoo redirect flow; trades the one-time handoff code for a real session. */
function OAuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const exchange = useExchangeHandoff();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const handoff = params.get('handoff');
    if (!handoff) {
      router.replace('/login?oauth_error=missing_code');
      return;
    }
    exchange.mutate(
      { handoff },
      {
        onSuccess: (data) => router.replace(dashboardPathForRole(data.user.role)),
        onError: () => router.replace('/login?oauth_error=exchange_failed'),
      },
    );
    // Runs once on mount — the ref guard above prevents a double-submit
    // from React StrictMode / fast refresh re-invoking this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PageSpinner />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <OAuthCallback />
    </Suspense>
  );
}
