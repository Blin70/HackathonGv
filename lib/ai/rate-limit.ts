const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 15
const rateLimitHits = new Map<string, { count: number; resetAt: number }>()

/** Prefer the proxy-provided address, falling back to the direct request IP. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}

/** Best-effort per-instance throttle shared by the public AI endpoints. */
export function checkAiRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = rateLimitHits.get(ip)

  if (!entry || now > entry.resetAt) {
    if (rateLimitHits.size > 10_000) {
      for (const [key, value] of rateLimitHits) {
        if (now > value.resetAt) rateLimitHits.delete(key)
      }
    }
    rateLimitHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, retryAfter: 0 }
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  return { allowed: true, retryAfter: 0 }
}
