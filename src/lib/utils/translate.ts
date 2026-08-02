'use client';

/**
 * Drives the Google Website Translator widget (see GoogleTranslateInit)
 * without its default UI: we write the `googtrans` cookie it reads on
 * init, then flip its hidden <select class="goog-te-combo"> and fire a
 * change event, which triggers an in-place DOM translation with no
 * page reload.
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const COOKIE_NAME = 'googtrans';
const SOURCE_LANGUAGE = 'en';

function isLanguageCode(value: string | undefined): value is LanguageCode {
  return SUPPORTED_LANGUAGES.some((l) => l.code === value);
}

export function getCurrentLanguage(): LanguageCode {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
  if (!match) return 'en';
  const target = decodeURIComponent(match[1]).split('/').filter(Boolean)[1];
  return isLanguageCode(target) ? target : 'en';
}

function writeCookie(target: LanguageCode) {
  const clear = target === SOURCE_LANGUAGE;
  const value = clear ? '' : `/${SOURCE_LANGUAGE}/${target}`;
  const expires = clear ? ';expires=Thu, 01 Jan 1970 00:00:00 GMT' : '';
  // Written both host-scoped and bare-path so it's found regardless of how
  // the widget itself later re-reads or rewrites it.
  document.cookie = `${COOKIE_NAME}=${value};path=/${expires}`;
  document.cookie = `${COOKIE_NAME}=${value};path=/;domain=${window.location.hostname}${expires}`;
}

function triggerWidget(target: LanguageCode, attempt = 0) {
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (select) {
    select.value = target;
    select.dispatchEvent(new Event('change'));
    return;
  }
  // The widget's hidden <select> only exists once Google's script has
  // finished injecting it — retry briefly rather than dropping the request.
  if (attempt < 20) setTimeout(() => triggerWidget(target, attempt + 1), 250);
}

export function applyLanguage(target: LanguageCode) {
  writeCookie(target);
  triggerWidget(target);
}
