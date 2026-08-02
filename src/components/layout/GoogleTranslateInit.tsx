'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { applyLanguage, getCurrentLanguage } from '@/lib/utils/translate';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
  }
}

/**
 * Mounted once in the root layout. Sets up the (hidden) Google Website
 * Translator widget that LanguageSwitcher drives — see lib/utils/translate.ts.
 * Renders no visible UI of its own.
 */
export function GoogleTranslateInit() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      const google = (window as any).google;
      new google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,fr,es', autoDisplay: false },
        'google_translate_element',
      );
      // A language chosen on a previous page load is stored in the
      // googtrans cookie — re-apply it now that the widget exists.
      const current = getCurrentLanguage();
      if (current !== 'en') applyLanguage(current);
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
    </>
  );
}
