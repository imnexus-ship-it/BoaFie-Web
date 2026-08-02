import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/api/query-provider';

// Rounded geometric sans, used for both headings and body — the two
// font-family tokens (head/body) in tailwind.config.ts both point at this
// one variable, weight alone does the differentiating.
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'BoaFie — Verified artisans & freelancers in Ghana',
  description:
    'Hire trusted, verified artisans and freelancers in Ghana — or from the diaspora. Escrow-protected payments, real reviews, no scams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
