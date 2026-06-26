// ─────────────────────────────────────────
// Currency
// ─────────────────────────────────────────

// Fixed exchange rates relative to NPR (the base currency all amounts are stored in).
// These are NOT live rates — they're static for demo/academic purposes.
// Update RATES_UPDATED_AT if you refresh them manually.
export const RATES_UPDATED_AT = '2026-06-01'

export const CURRENCIES = {
  NPR: { code: 'NPR', label: 'Nepalese Rupee', symbol: 'NPR', rateFromNPR: 1 },
  USD: { code: 'USD', label: 'US Dollar',      symbol: '$',   rateFromNPR: 0.0075 },
  INR: { code: 'INR', label: 'Indian Rupee',   symbol: '₹',   rateFromNPR: 0.625 },
  EUR: { code: 'EUR', label: 'Euro',           symbol: '€',   rateFromNPR: 0.0069 },
  GBP: { code: 'GBP', label: 'British Pound',  symbol: '£',   rateFromNPR: 0.0059 },
}

export const DEFAULT_CURRENCY = 'NPR'

/**
 * Converts an amount stored in NPR (the app's base currency) into the target currency.
 */
export function convertFromNPR(amountInNPR, targetCode) {
  const target = CURRENCIES[targetCode] || CURRENCIES[DEFAULT_CURRENCY]
  return amountInNPR * target.rateFromNPR
}

/**
 * Formats an amount (already stored in NPR) into a display string in the
 * user's chosen currency — e.g. formatCurrency(50000, 'USD') -> "$375.00"
 */
export function formatCurrency(amountInNPR, currencyCode = DEFAULT_CURRENCY, options = {}) {
  const currency = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY]
  const converted = convertFromNPR(amountInNPR, currencyCode)

  const decimals = currencyCode === 'NPR' ? 0 : 2
  const formattedNumber = converted.toLocaleString('en-US', {
    minimumFractionDigits: options.decimals ?? decimals,
    maximumFractionDigits: options.decimals ?? decimals,
  })

  return `${currency.symbol} ${formattedNumber}`
}

// ─────────────────────────────────────────
// Date formatting
// ─────────────────────────────────────────

export const DATE_FORMATS = {
  'DD/MM/YYYY': { label: 'DD / MM / YYYY' },
  'MM/DD/YYYY': { label: 'MM / DD / YYYY' },
  'YYYY-MM-DD': { label: 'YYYY-MM-DD' },
}

export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY'

/**
 * Formats a date according to the user's chosen format pattern.
 */
export function formatDate(date, pattern = DEFAULT_DATE_FORMAT) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()

  switch (pattern) {
    case 'MM/DD/YYYY': return `${mm}/${dd}/${yyyy}`
    case 'YYYY-MM-DD': return `${yyyy}-${mm}-${dd}`
    case 'DD/MM/YYYY':
    default:           return `${dd}/${mm}/${yyyy}`
  }
}