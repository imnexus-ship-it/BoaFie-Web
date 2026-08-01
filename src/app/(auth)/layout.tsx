import { Logo } from '@/components/layout/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <div className="rounded-lg border border-border bg-white p-8 shadow-card">{children}</div>
      </div>
    </div>
  );
}
