'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { applyLanguage, getCurrentLanguage, LanguageCode, SUPPORTED_LANGUAGES } from '@/lib/utils/translate';

export function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [open, setOpen] = useState(false);

  // Reflects whatever language a previous page load left the site in
  // (read from the googtrans cookie) — see lib/utils/translate.ts.
  useEffect(() => {
    setLang(getCurrentLanguage());
  }, []);

  const select = (code: LanguageCode) => {
    setLang(code);
    setOpen(false);
    applyLanguage(code);
  };

  return (
    <div className="notranslate relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1 text-sm font-medium',
          variant === 'dark' ? 'text-white/70 hover:text-white' : 'text-muted hover:text-charcoal',
        )}
      >
        <Globe className="h-4 w-4" />
        {lang.toUpperCase()}
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-border bg-white py-1 shadow-card">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => select(l.code)}
                className={cn(
                  'block w-full px-3 py-2 text-left text-sm hover:bg-cream',
                  lang === l.code ? 'font-semibold text-green' : 'text-charcoal',
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
