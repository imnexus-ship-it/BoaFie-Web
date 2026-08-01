'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { API_URL } from '@/lib/api/client';
import { useGoogleLogin } from '@/lib/api/hooks/useAuth';
import { dashboardPathForRole } from '@/lib/utils/routing';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * Shown on both login and signup. `role` is only meaningful for signup
 * (it's ignored server-side for an account that already exists) — the
 * login page renders this with no role, and a first-time social sign-in
 * from there defaults to a client account.
 */
export function SocialAuthButtons({ role }: { role?: 'client' | 'artisan' | 'freelancer' }) {
  const router = useRouter();
  const googleLogin = useGoogleLogin();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scriptLoaded || !GOOGLE_CLIENT_ID || !window.google || !googleButtonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        googleLogin.mutate(
          { id_token: response.credential, role },
          { onSuccess: (data) => router.push(dashboardPathForRole(data.user.role)) },
        );
      },
    });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 360,
      text: 'continue_with',
    });
    // role is read fresh inside the callback closure on every render via
    // the effect re-running, so it's intentionally a dependency here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded, role]);

  const yahooHref = `${API_URL}/auth/yahoo${role ? `?role=${role}` : ''}`;

  return (
    <div className="flex flex-col gap-3">
      {GOOGLE_CLIENT_ID && (
        <>
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
            onLoad={() => setScriptLoaded(true)}
          />
          <div ref={googleButtonRef} className="flex justify-center" />
        </>
      )}
      <a
        href={yahooHref}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-6 py-3 text-[15px] font-medium text-charcoal transition-colors hover:border-green/40"
      >
        Continue with Yahoo
      </a>
      {googleLogin.isError && <p className="text-sm text-red-600">{googleLogin.error.message}</p>}

      <div className="my-1 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">or continue with email</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
