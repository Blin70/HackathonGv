import { describe, expect, it } from "vitest"

import { fitWithin, REPAIR_PHOTO_MAX_DIMENSION } from "@/lib/image"

describe("fitWithin", () => {
  it("scales a landscape phone photo so its long edge hits the cap", () => {
    expect(fitWithin(4032, 3024, 1600)).toEqual({ width: 1600, height: 1200 })
  })

  it("scales a portrait photo by its height", () => {
    expect(fitWithin(3024, 4032, 1600)).toEqual({ width: 1200, height: 1600 })
  })

  it("never upscales a photo that already fits", () => {
    expect(fitWithin(800, 600, 1600)).toEqual({ width: 800, height: 600 })
  })

  it("keeps at least one pixel on a very thin image", () => {
    expect(fitWithin(10000, 2, 1600)).toEqual({ width: 1600, height: 1 })
  })

  it("returns zero for an empty image instead of dividing by zero", () => {
    expect(fitWithin(0, 0, 1600)).toEqual({ width: 0, height: 0 })
  })

  it("uses a cap the model can still read detail at", () => {
    expect(REPAIR_PHOTO_MAX_DIMENSION).toBeGreaterThanOrEqual(1024)
  })
})
