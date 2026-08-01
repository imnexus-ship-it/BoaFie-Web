import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-head text-2xl font-bold text-green">
          BoaFie
          <span className="mb-0.5 h-2 w-2 rounded-full bg-gold-2" />
        </Link>
        <div className="rounded-lg border border-border bg-white p-8 shadow-card">{children}</div>
      </div>
    </div>
  );
}
