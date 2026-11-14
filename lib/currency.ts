/**
 * Prices for a marketplace operating in North Macedonia, whose currency is the
 * denar. Moving the whole app to another currency is a change to the two
 * constants below and nothing else — no call site formats a price itself.
 *
 * Amounts are stored bare ("900") and given their currency at render time, so
 * the stored value never has to be migrated when the display changes.
 */

export const CURRENCY_CODE = "MKD"
export const CURRENCY_SUFFIX = "ден"

/** Shown in a price slot when a worker has not set a rate. */
export const PRICE_UNSET = "—"

/**
 * Currency markers a stored price may already carry: a `$` from before this
 * module existed, or a symbol the worker typed into the rate field themselves.
 */
const CURRENCY_MARKERS = /^\s*[$€£]\s*|\s*(?:ден|den|mkd|eur|usd)\s*$/gi

/** Reduces anything a price field may hold to the bare amount. */
export function stripCurrency(value: string): string {
  return value.replace(CURRENCY_MARKERS, "").trim()
}

/**
 * Renders a stored amount with the market's currency: `"900"` -> `"900 ден"`.
 * Returns an empty string for a blank price, so callers can choose their own
 * fallback.
 */
export function formatPrice(price: string): string {
  const amount = stripCurrency(price)
  if (!amount) return ""
  return `${amount} ${CURRENCY_SUFFIX}`
}

/** Renders a price for display, falling back to a dash when none is set. */
export function formatPriceOrDash(price: string | null | undefined): string {
  return formatPrice(price ?? "") || PRICE_UNSET
}
