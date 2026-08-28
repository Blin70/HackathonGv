import { NextResponse } from "next/server"

const GEMINI_MODEL = "gemini-2.5-flash"
const MAX_MESSAGE_LENGTH = 2000

const SYSTEM_INSTRUCTION = `You are the Book A Fixer AI Concierge, a helpful assistant built for our website 'Book A Fixer'.
Your goal is to help users diagnose home repair issues, explain options, estimate costs, and suggest the right tradesman category.
The available categories are:
- Plumber (emergency repairs, pipe fitting, bathroom installs)
- Electrician (rewiring, panels, smart home setups)
- Painter (interior & exterior painting)
- Carpenter (custom built-ins, doors, decking, structural woodwork)
- Gardener (landscaping, lawn care, planting)
- Roofer (roof repairs, full replacements, gutters, waterproofing)
- Tiler (bathroom, kitchen & floor tiling)
- HVAC (heating, cooling, ventilation, gas safety)
- Mason (stone walls, concrete, patios, brick restoration)
- Locksmith (emergency lockouts, smart locks)
- Cleaner (deep home cleaning, office cleaning)
- Flooring (laminate, hardwood, luxury vinyl)

When recommending a professional, ALWAYS suggest one of these categories and advise the user to visit our '/book' page to search and book.
Format your responses using clean Markdown structure, bold headers, and bullet points where helpful. Keep responses friendly, structured, concise, and professional.`


const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 15
const rateLimitHits = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}

/**
 * Best-effort per-IP throttle to curb abuse of this public endpoint. It lives in
 * process memory (per-instance only) — fine for dev/preview, but we could move to a shared
 * store (Upstash / Vercel KV) for real production traffic.
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = rateLimitHits.get(ip)

  if (!entry || now > entry.resetAt) {
    // Opportunistically drop expired buckets so the map can't grow unbounded.
    if (rateLimitHits.size > 10_000) {
      for (const [key, value] of rateLimitHits) {
        if (now > value.resetAt) rateLimitHits.delete(key)
      }
    }
    rateLimitHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, retryAfter: 0 }
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  return { allowed: true, retryAfter: 0 }
}

export async function POST(request: Request) {
  const { allowed, retryAfter } = checkRateLimit(getClientIp(request))
  if (!allowed) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    )
  }

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "The AI concierge is not configured yet. Please set GEMINI_API_KEY." },
      { status: 503 }
    )
  }

  let message: string
  try {
    const body = await request.json()
    message = typeof body?.message === "string" ? body.message.trim() : ""
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!message) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 })
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Your message is too long." }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error("Gemini API error:", data)
      return NextResponse.json(
        { error: "The AI service returned an error. Please try again." },
        { status: 502 }
      )
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I was unable to formulate a response. Please try again."

    return NextResponse.json({ text })
  } catch (error) {
    console.error("AI route failed:", error)
    return NextResponse.json(
      { error: "Failed to reach the AI service. Please try again." },
      { status: 502 }
    )
  }
}