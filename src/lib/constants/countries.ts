/**
 * Short, pragmatic list rather than an exhaustive world list — covers
 * Ghana (default) plus the diaspora markets BoaFie's clients most often
 * come from. Extend as needed.
 *
 * `regions` is each country's official first-level administrative
 * divisions — a hand-maintained reference list, not a live geocoding
 * source. `phoneDigits` is the expected length of the *national* number
 * (digits only, after the dial code, no leading 0).
 */
export const COUNTRIES = [
  {
    code: 'GH',
    name: 'Ghana',
    dialCode: '+233',
    phoneDigits: { min: 9, max: 9 },
    regions: [
      'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern',
      'Greater Accra', 'North East', 'Northern', 'Oti', 'Savannah',
      'Upper East', 'Upper West', 'Volta', 'Western', 'Western North',
    ],
  },
  {
    code: 'NG',
    name: 'Nigeria',
    dialCode: '+234',
    phoneDigits: { min: 10, max: 10 },
    regions: [
      'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
      'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
      'Federal Capital Territory', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
      'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
      'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
      'Yobe', 'Zamfara',
    ],
  },
  {
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    phoneDigits: { min: 10, max: 10 },
    regions: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
      'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
      'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
      'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
      'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
      'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
      'West Virginia', 'Wisconsin', 'Wyoming',
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    dialCode: '+44',
    phoneDigits: { min: 10, max: 10 },
    regions: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  },
  {
    code: 'CA',
    name: 'Canada',
    dialCode: '+1',
    phoneDigits: { min: 10, max: 10 },
    regions: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
      'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
      'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec',
      'Saskatchewan', 'Yukon',
    ],
  },
  {
    code: 'DE',
    name: 'Germany',
    dialCode: '+49',
    phoneDigits: { min: 10, max: 11 },
    regions: [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen',
      'Hamburg', 'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern',
      'North Rhine-Westphalia', 'Rhineland-Palatinate', 'Saarland',
      'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia',
    ],
  },
] as const;

export const DEFAULT_COUNTRY_CODE = 'GH';

/** Letters, spaces, hyphens, apostrophes, periods (e.g. "St. Louis") — rejects digits and stray symbols. */
export const CITY_NAME_PATTERN = /^[A-Za-zÀ-ɏ' .-]+$/;

export function findCountry(code: string) {
  return COUNTRIES.find((c) => c.code === code);
}

export function isValidPhoneForCountry(digitsOnly: string, countryCode: string): boolean {
  const country = findCountry(countryCode);
  if (!country) return true;
  return digitsOnly.length >= country.phoneDigits.min && digitsOnly.length <= country.phoneDigits.max;
}
