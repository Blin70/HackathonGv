import { afterEach, describe, expect, it, vi } from "vitest"

import { CURRENCY_SUFFIX, PRICE_UNSET } from "@/lib/currency"
import { COMPANIES } from "@/lib/data"
import { FALLBACK_BANNER_IMAGE } from "@/lib/profile"
import {
  demoListingMode,
  rowToCompany,
  shouldIncludeDemoListings,
  type WorkerProfileRow,
} from "@/lib/workers"

function row(overrides: Partial<WorkerProfileRow> = {}): WorkerProfileRow {
  return {
    user_id: "3f1b9c2e-0000-4000-8000-000000000001",
    account_type: "worker",
    display_name: "Aqua Fix",
    business_name: "Aqua Fix DOO",
    trade_type: "Plumber",
    phone: "+38970123456",
    city: "Skopje",
    tagline: "Emergency leaks and pipe fitting.",
    about_us: "Fifteen years in the trade.",
    services: ["Leak repair", "Pipe fitting"],
    available_days: "Monday - Saturday",
    // Stored bare; the currency is applied at render time.
    price: "900",
    banner_image: "https://example.com/banner.jpg",
    is_verified: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  }
}

describe("rowToCompany", () => {
  it("carries a complete row straight through", () => {
    const company = rowToCompany(row())
    expect(company).toMatchObject({
      id: "3f1b9c2e-0000-4000-8000-000000000001",
      name: "Aqua Fix",
      type: "Plumber",
      desc: "Emergency leaks and pipe fitting.",
      city: "Skopje",
      price: `900 ${CURRENCY_SUFFIX}`,
      isVerified: true,
    })
  })

  it("uses the real worker_profiles uuid as the id", () => {
    // Company.id is a number for the seeded demo catalogue and a uuid string
    // for real rows. Anything consuming both has to tolerate each.
    expect(typeof rowToCompany(row()).id).toBe("string")
  })

  it("falls back to the business name when there is no display name", () => {
    expect(rowToCompany(row({ display_name: "" })).name).toBe("Aqua Fix DOO")
  })

  it("falls back to 'Fixer' when the row has no name at all", () => {
    expect(rowToCompany(row({ display_name: "", business_name: null })).name).toBe("Fixer")
  })

  it("falls back to 'General' for an unset trade", () => {
    expect(rowToCompany(row({ trade_type: null })).type).toBe("General")
  })

  it("substitutes a description when the worker left the tagline blank", () => {
    expect(rowToCompany(row({ tagline: null })).desc).toBeTruthy()
  })

  it("turns a missing services list into an empty array, never null", () => {
    expect(rowToCompany(row({ services: null })).services).toEqual([])
  })

  it("falls back to the shared banner when the worker uploaded none", () => {
    expect(rowToCompany(row({ banner_image: null })).image).toBe(FALLBACK_BANNER_IMAGE)
  })

  it("reports no reviews as a zero rating, not an invented one", () => {
    // getMarketplaceCompanies folds in the real figures from the reviews
    // table. A mapper that guessed here is how fake ratings reach the UI.
    const company = rowToCompany(row())
    expect(company.rating).toBe(0)
    expect(company.reviews).toBe(0)
  })

  it("leaves the city empty rather than guessing one", () => {
    expect(rowToCompany(row({ city: null })).city).toBe("")
  })

  it("marks an unverified worker as unverified", () => {
    expect(rowToCompany(row({ is_verified: false })).isVerified).toBe(false)
  })

  it("never marks a real worker as a demo listing", () => {
    expect(rowToCompany(row()).isDemo).toBeUndefined()
  })

  it("renders the rate in the market's currency, not dollars", () => {
    expect(rowToCompany(row({ price: "900" })).price).toBe(`900 ${CURRENCY_SUFFIX}`)
    // Rows written before the currency fix still hold a "$" prefix.
    expect(rowToCompany(row({ price: "$90" })).price).toBe(`90 ${CURRENCY_SUFFIX}`)
    expect(rowToCompany(row({ price: "900" })).price).not.toContain("$")
  })

  it("shows a dash rather than a made-up rate when none is set", () => {
    expect(rowToCompany(row({ price: null })).price).toBe(PRICE_UNSET)
  })
})

describe("demoListingMode", () => {
  const ENV_KEY = "NEXT_PUBLIC_SHOW_DEMO_LISTINGS"

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("defaults to always, so one test account cannot empty the marketplace", () => {
    expect(demoListingMode()).toBe("always")
  })

  it("reads the two opt-in modes", () => {
    vi.stubEnv(ENV_KEY, "never")
    expect(demoListingMode()).toBe("never")
    vi.stubEnv(ENV_KEY, "until-real")
    expect(demoListingMode()).toBe("until-real")
  })

  it("falls back to the default rather than failing on an unknown value", () => {
    vi.stubEnv(ENV_KEY, "yes-please")
    expect(demoListingMode()).toBe("always")
    vi.stubEnv(ENV_KEY, "")
    expect(demoListingMode()).toBe("always")
  })
})

describe("shouldIncludeDemoListings", () => {
  const ENV_KEY = "NEXT_PUBLIC_SHOW_DEMO_LISTINGS"

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("keeps examples alongside real listings by default", () => {
    // A marketplace holding one test account should still look like a
    // marketplace. Honesty here comes from the badge, not from hiding them.
    expect(shouldIncludeDemoListings(0)).toBe(true)
    expect(shouldIncludeDemoListings(1)).toBe(true)
    expect(shouldIncludeDemoListings(50)).toBe(true)
  })

  it("retires examples once real listings exist, under 'until-real'", () => {
    vi.stubEnv(ENV_KEY, "until-real")
    expect(shouldIncludeDemoListings(0)).toBe(true)
    expect(shouldIncludeDemoListings(1)).toBe(false)
    expect(shouldIncludeDemoListings(50)).toBe(false)
  })

  it("hides examples outright under 'never', the switch to throw at launch", () => {
    vi.stubEnv(ENV_KEY, "never")
    expect(shouldIncludeDemoListings(0)).toBe(false)
    expect(shouldIncludeDemoListings(25)).toBe(false)
  })

  it("honours an explicit 'always'", () => {
    vi.stubEnv(ENV_KEY, "always")
    expect(shouldIncludeDemoListings(0)).toBe(true)
    expect(shouldIncludeDemoListings(25)).toBe(true)
  })
})

describe("the seeded example catalogue", () => {
  it("marks every entry as a demo, which is what the UI badges", () => {
    expect(COMPANIES.length).toBeGreaterThan(0)
    for (const company of COMPANIES) {
      expect(company.isDemo, `${company.name} must be marked isDemo`).toBe(true)
    }
  })

  it("quotes every example in the market's currency", () => {
    for (const company of COMPANIES) {
      expect(company.price, `${company.name} should not be priced in dollars`).not.toContain("$")
      expect(company.price).toContain(CURRENCY_SUFFIX)
    }
  })

  it("uses numeric ids, which is how they stay distinct from real uuid rows", () => {
    for (const company of COMPANIES) {
      expect(typeof company.id).toBe("number")
    }
  })
})
