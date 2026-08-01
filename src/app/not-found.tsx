import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
      <p className="font-head text-6xl font-bold text-green">404</p>
      <h1 className="font-head text-xl font-semibold text-charcoal">This page went off the grid.</h1>
      <p className="max-w-sm text-sm text-muted">The page you're looking for doesn't exist or may have moved.</p>
      <Link href="/">
        <Button className="mt-2">Back to home</Button>
      </Link>
    </div>
  );
}
