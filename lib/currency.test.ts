import { describe, expect, it } from "vitest"

import {
  CURRENCY_SUFFIX,
  PRICE_UNSET,
  formatPrice,
  formatPriceOrDash,
  stripCurrency,
} from "@/lib/currency"

describe("stripCurrency", () => {
  it("leaves a bare amount alone", () => {
    expect(stripCurrency("900")).toBe("900")
  })

  it("removes a legacy dollar prefix, which is what older rows stored", () => {
    expect(stripCurrency("$90")).toBe("90")
    expect(stripCurrency("$ 90")).toBe("90")
  })

  it("removes other symbols a worker might type into the rate field", () => {
    expect(stripCurrency("€25")).toBe("25")
    expect(stripCurrency("£25")).toBe("25")
  })

  it("removes a trailing currency word or code", () => {
    expect(stripCurrency("900 ден")).toBe("900")
    expect(stripCurrency("900 MKD")).toBe("900")
    expect(stripCurrency("900 mkd")).toBe("900")
    expect(stripCurrency("25 EUR")).toBe("25")
  })

  it("trims surrounding whitespace", () => {
    expect(stripCurrency("  900  ")).toBe("900")
  })

  it("returns an empty string for blank input", () => {
    expect(stripCurrency("")).toBe("")
    expect(stripCurrency("   ")).toBe("")
  })
})

describe("formatPrice", () => {
  it("renders a bare amount with the market currency", () => {
    expect(formatPrice("900")).toBe(`900 ${CURRENCY_SUFFIX}`)
  })

  it("is idempotent, so formatting an already-formatted price is safe", () => {
    const once = formatPrice("900")
    expect(formatPrice(once)).toBe(once)
  })

  it("re-denominates a legacy dollar price instead of leaving it", () => {
    // The old formatPrice prepended "$". Those strings are still in the
    // database, and they must not reach the UI as dollars.
    expect(formatPrice("$90")).toBe(`90 ${CURRENCY_SUFFIX}`)
    expect(formatPrice("$90")).not.toContain("$")
  })

  it("returns an empty string for a blank price, leaving the fallback to callers", () => {
    expect(formatPrice("")).toBe("")
    expect(formatPrice("   ")).toBe("")
  })
})

describe("formatPriceOrDash", () => {
  it("formats a real amount", () => {
    expect(formatPriceOrDash("900")).toBe(`900 ${CURRENCY_SUFFIX}`)
  })

  it("falls back to a dash rather than inventing a rate", () => {
    expect(formatPriceOrDash("")).toBe(PRICE_UNSET)
    expect(formatPriceOrDash(null)).toBe(PRICE_UNSET)
    expect(formatPriceOrDash(undefined)).toBe(PRICE_UNSET)
  })
})

describe("currency configuration", () => {
  it("does not denominate the marketplace in dollars", () => {
    // The market is North Macedonia. This test is the tripwire if someone
    // re-introduces a "$" default.
    expect(CURRENCY_SUFFIX).not.toBe("$")
    expect(formatPrice("100")).not.toContain("$")
  })
})
