import { z } from "zod"

import { CITIES, TRADE_CATEGORIES } from "@/lib/data"

export const REPAIR_URGENCIES = ["routine", "soon", "urgent", "emergency"] as const

export const MAX_REPAIR_IMAGE_BYTES = 3 * 1024 * 1024
const MAX_REPAIR_IMAGE_DATA_URL_LENGTH = 4_200_000

const conversationMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
})

export const repairIntakeRequestSchema = z.object({
  message: z.string().trim().min(1, "Describe the repair or attach a photo.").max(2000),
  city: z.enum(CITIES),
  imageDataUrl: z
    .string()
    .max(MAX_REPAIR_IMAGE_DATA_URL_LENGTH)
    .regex(/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/)
    .optional(),
  history: z.array(conversationMessageSchema).max(8).default([]),
})

export const repairAssessmentSchema = z.object({
  isHomeRepair: z.boolean(),
  tradeCategory: z.enum(TRADE_CATEGORIES).nullable(),
  urgency: z.enum(REPAIR_URGENCIES),
  summary: z.string(),
  urgencyExplanation: z.string(),
  safetyGuidance: z.array(z.string()),
  nextStep: z.string(),
  followUpQuestion: z.string(),
})

export type RepairIntakeRequest = z.infer<typeof repairIntakeRequestSchema>
export type RepairAssessment = z.infer<typeof repairAssessmentSchema>
export type RepairConversationMessage = RepairIntakeRequest["history"][number]
