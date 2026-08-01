import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export function SidebarHelpCard() {
  return (
    <Link
      href="/contact"
      className="flex items-center gap-3 rounded-lg bg-white/5 p-4 text-white/80 transition-colors hover:bg-white/10"
    >
      <HelpCircle className="h-5 w-5 shrink-0 text-gold-2" />
      <span className="text-sm">
        <span className="block font-semibold text-white">Need help?</span>
        Contact support
      </span>
    </Link>
  );
}
