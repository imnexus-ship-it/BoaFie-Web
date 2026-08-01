'use client';

import { Button } from '@/components/ui';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
      <h1 className="font-head text-xl font-semibold text-charcoal">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted">{error.message || 'An unexpected error occurred.'}</p>
      <Button onClick={reset} className="mt-2">
        Try again
      </Button>
    </div>
  );
}
