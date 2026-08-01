import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div>
      <h1 className="mb-1 font-head text-xl font-bold text-charcoal">Create your account</h1>
      <p className="mb-6 text-sm text-muted">Join Ghana's verification-first marketplace.</p>
      <SignupForm />
      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-green hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
