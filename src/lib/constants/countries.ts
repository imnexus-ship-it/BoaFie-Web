/**
 * Short, pragmatic list rather than an exhaustive world list — covers
 * Ghana (default) plus the diaspora markets BoaFie's clients most often
 * come from. Extend as needed.
 */
export const COUNTRIES = [
  { code: 'GH', name: 'Ghana', dialCode: '+233' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
] as const;

export const DEFAULT_COUNTRY_CODE = 'GH';
