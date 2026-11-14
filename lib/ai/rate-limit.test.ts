import { afterEach, describe, expect, it, vi } from "vitest"

import { checkAiRateLimit, getClientIp } from "@/lib/ai/rate-limit"

/**
 * The limiter keeps its counters in a module-level Map, so each test uses its
 * own IP rather than resetting shared state.
 */
let ipCounter = 0
function freshIp(): string {
  ipCounter += 1
  return `203.0.113.${ipCounter}`
}

const LIMIT = 15

afterEach(() => {
  vi.useRealTimers()
})

describe("getClientIp", () => {
  it("takes the first address from x-forwarded-for", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "198.51.100.7, 203.0.113.9, 192.0.2.1" },
    })
    expect(getClientIp(request)).toBe("198.51.100.7")
  })

  it("trims whitespace around the forwarded address", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "  198.51.100.7  , 203.0.113.9" },
    })
    expect(getClientIp(request)).toBe("198.51.100.7")
  })

  it("falls back to x-real-ip when there is no forwarded header", () => {
    const request = new Request("https://example.com", {
      headers: { "x-real-ip": "198.51.100.8" },
    })
    expect(getClientIp(request)).toBe("198.51.100.8")
  })

  it("returns 'unknown' when neither header is present", () => {
    expect(getClientIp(new Request("https://example.com"))).toBe("unknown")
  })

  it("prefers the proxy header over the direct one", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "198.51.100.7", "x-real-ip": "192.0.2.1" },
    })
    expect(getClientIp(request)).toBe("198.51.100.7")
  })
})

describe("checkAiRateLimit", () => {
  it("allows requests up to the limit", () => {
    const ip = freshIp()
    for (let i = 0; i < LIMIT; i += 1) {
      expect(checkAiRateLimit(ip).allowed, `request ${i + 1} should pass`).toBe(true)
    }
  })

  it("blocks the request after the limit and reports a retry delay", () => {
    const ip = freshIp()
    for (let i = 0; i < LIMIT; i += 1) checkAiRateLimit(ip)

    const blocked = checkAiRateLimit(ip)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfter).toBeGreaterThan(0)
    // The window is 60s, so the caller is never told to wait longer than that.
    expect(blocked.retryAfter).toBeLessThanOrEqual(60)
  })

  it("counts each caller separately", () => {
    const noisy = freshIp()
    const quiet = freshIp()
    for (let i = 0; i < LIMIT + 5; i += 1) checkAiRateLimit(noisy)

    expect(checkAiRateLimit(noisy).allowed).toBe(false)
    expect(checkAiRateLimit(quiet).allowed).toBe(true)
  })

  it("lets a blocked caller through again once the window has passed", () => {
    vi.useFakeTimers()
    const ip = freshIp()

    for (let i = 0; i < LIMIT; i += 1) checkAiRateLimit(ip)
    expect(checkAiRateLimit(ip).allowed).toBe(false)

    vi.advanceTimersByTime(60_001)
    expect(checkAiRateLimit(ip).allowed).toBe(true)
  })

  it("keeps blocking while still inside the window", () => {
    vi.useFakeTimers()
    const ip = freshIp()

    for (let i = 0; i < LIMIT; i += 1) checkAiRateLimit(ip)
    vi.advanceTimersByTime(30_000)
    expect(checkAiRateLimit(ip).allowed).toBe(false)
  })

  it("throttles callers that arrive without identifiable headers as one bucket", () => {
    // Everything behind a missing header collapses to "unknown". Worth pinning:
    // it is a shared bucket, so one anonymous flood can throttle others.
    const anonymous = new Request("https://example.com")
    const results = Array.from({ length: LIMIT + 1 }, () =>
      checkAiRateLimit(getClientIp(anonymous)).allowed
    )
    expect(results.at(-1)).toBe(false)
  })
})
