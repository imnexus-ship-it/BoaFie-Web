import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div>
      <h1 className="mb-1 font-head text-xl font-bold text-charcoal">Create your account</h1>
      <p className="mb-6 text-sm text-muted">Join Ghana's verification-first marketplace.</p>
      <SignupForm />
      <p className="mt-4 text-center text-xs text-muted">
        By signing up, you agree to BoaFie's{' '}
        <Link href="/terms" className="font-medium text-green hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="font-medium text-green hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <p className="mt-3 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-green hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
