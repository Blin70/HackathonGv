import { describe, expect, it } from "vitest"

import { tradeCategoryFromParam } from "@/lib/data"

describe("tradeCategoryFromParam", () => {
  it("resolves the trade a footer link sends", () => {
    expect(tradeCategoryFromParam("Roofer")).toBe("Roofer")
    expect(tradeCategoryFromParam("Plumber")).toBe("Plumber")
  })

  it("ignores case and surrounding whitespace", () => {
    expect(tradeCategoryFromParam(" electrician ")).toBe("Electrician")
    expect(tradeCategoryFromParam("hvac")).toBe("HVAC")
  })

  it("returns null for missing or unknown trades, so the page shows everything", () => {
    expect(tradeCategoryFromParam(null)).toBeNull()
    expect(tradeCategoryFromParam("")).toBeNull()
    expect(tradeCategoryFromParam("Astrologer")).toBeNull()
  })
})
