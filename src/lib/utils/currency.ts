const SYMBOLS: Record<string, string> = { GHS: 'GH₵', USD: '$', GBP: '£', EUR: '€', CAD: 'CA$' };

export function formatCurrency(amount: number | null | undefined, currency = 'GHS'): string {
  if (amount === null || amount === undefined) return '—';
  const symbol = SYMBOLS[currency] || currency;
  return `${symbol}${amount.toLocaleString('en-GH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatBudgetRange(min?: number | null, max?: number | null, currency = 'GHS'): string {
  if (!min && !max) return 'Budget on request';
  if (min && max && min !== max) return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
  return formatCurrency(min || max, currency);
}
