import { NextResponse } from "next/server"
import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"

import { checkAiRateLimit, getClientIp } from "@/lib/ai/rate-limit"
import {
  MAX_REPAIR_IMAGE_BYTES,
  repairAssessmentSchema,
  repairIntakeRequestSchema,
} from "@/lib/schemas/repair-intake"
import { TRADE_CATEGORIES } from "@/lib/data"

const MODEL = process.env.OPENAI_MODEL || "gpt-6-luna"

const REPAIR_INSTRUCTIONS = `You are Book A Fixer's repair triage assistant. Assess home repair requests using the customer's description and optional image. Your job is to help the customer choose the right local trade and understand the next safe step, not to diagnose with certainty.

Only classify a request as a home repair when it is actually about a home repair or maintenance issue. For unrelated requests, set isHomeRepair to false and tradeCategory to null. For a home repair, choose exactly one available trade category that best fits from this list: ${TRADE_CATEGORIES.join(", ")}. Choose the closest category when the evidence is incomplete and use followUpQuestion to ask one concise clarifying question.

Set urgency as follows: routine means it can be scheduled normally; soon means it should be checked within a few days to prevent worsening; urgent means arrange same-day help because damage or loss of service is active; emergency means there may be immediate danger to people or property. Do not label a problem an emergency based only on uncertainty.

Safety comes first. If the user reports or the image strongly suggests gas smell, fire, smoke, sparking, exposed live wiring, structural collapse, or another immediate hazard, classify as emergency and give short, conservative guidance such as moving away, leaving the area, and contacting local emergency services or a qualified professional. Never tell the user to touch live wiring, enter a dangerous area, or perform hazardous repairs. If the image is unclear, say so in the summary or follow-up question and do not invent details.

Return concise, plain-language content. summary explains what the customer described or what is visibly apparent without claiming certainty. urgencyExplanation explains the urgency level. safetyGuidance contains only practical precautions relevant to this case and may be empty when none are needed. nextStep tells the customer what to do next. followUpQuestion should be an empty string when no clarification is needed. Respond in the language the customer used when you can.`

export async function POST(request: Request) {
  const { allowed, retryAfter } = checkAiRateLimit(getClientIp(request))
  if (!allowed) {
    return NextResponse.json(
      { error: "You're sending requests too quickly. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    )
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "Repair help is not configured yet. Please set OPENAI_API_KEY." },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const parsed = repairIntakeRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Add a repair description, choose a city, and use a supported image under 3 MB." },
      { status: 400 }
    )
  }

  const { city, message, imageDataUrl, history } = parsed.data
  if (imageDataUrl) {
    const encodedImage = imageDataUrl.slice(imageDataUrl.indexOf(",") + 1)
    if (Buffer.from(encodedImage, "base64").byteLength > MAX_REPAIR_IMAGE_BYTES) {
      return NextResponse.json({ error: "Photos must be 3 MB or smaller." }, { status: 413 })
    }
  }

  const userContent = [
    {
      type: "input_text" as const,
      text: `Selected city: ${city}\nCustomer's latest message: ${message}`,
    },
    ...(imageDataUrl
      ? [{ type: "input_image" as const, image_url: imageDataUrl, detail: "auto" as const }]
      : []),
  ]

  try {
    const openai = new OpenAI({ apiKey, timeout: 45_000, maxRetries: 1 })
    const response = await openai.responses.parse({
      model: MODEL,
      instructions: REPAIR_INSTRUCTIONS,
      input: [
        ...history,
        { role: "user", content: userContent },
      ],
      text: {
        format: zodTextFormat(repairAssessmentSchema, "repair_assessment"),
      },
      max_output_tokens: 900,
      store: false,
    })

    if (!response.output_parsed) {
      return NextResponse.json(
        { error: "The repair assessment could not be completed. Please try describing it another way." },
        { status: 502 }
      )
    }

    return NextResponse.json({ assessment: response.output_parsed })
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI repair-intake request failed:", {
        status: error.status,
        code: error.code,
        requestId: error.requestID,
      })
    } else {
      console.error(
        "Repair-intake route failed:",
        error instanceof Error ? error.message : "Unknown error"
      )
    }
    return NextResponse.json(
      { error: "We couldn't analyze the repair right now. Please try again." },
      { status: 502 }
    )
  }
}
