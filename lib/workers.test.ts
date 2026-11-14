import { describe, expect, it } from "vitest"

import { FALLBACK_BANNER_IMAGE } from "@/lib/profile"
import { rowToCompany, type WorkerProfileRow } from "@/lib/workers"

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
    price: "$90",
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
      price: "$90",
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
})
