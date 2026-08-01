import type { Metadata } from 'next';
import { Sora, DM_Sans } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/api/query-provider';

const sora = Sora({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sora' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-dmsans' });

export const metadata: Metadata = {
  title: 'BoaFie — Verified artisans & freelancers in Ghana',
  description:
    'Hire trusted, verified artisans and freelancers in Ghana — or from the diaspora. Escrow-protected payments, real reviews, no scams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
