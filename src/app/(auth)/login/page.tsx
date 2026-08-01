import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-1 font-head text-xl font-bold text-charcoal">Welcome back</h1>
      <p className="mb-6 text-sm text-muted">Log in to your BoaFie account.</p>
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
