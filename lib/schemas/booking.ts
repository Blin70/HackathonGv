import { z } from "zod"
import { parsePhoneNumberFromString } from "libphonenumber-js"

import { BOOKING_TIME_SLOTS } from "@/lib/bookings"

/**
 * Numbers typed without a country code are read as North Macedonian, which is
 * where the marketplace operates. An explicit `+`-prefixed number keeps its own
 * country, so this doesn't break the day the site crosses a border.
 */
const DEFAULT_REGION = "MK" as const

/**
 * Converts anything the user typed into E.164 (`+38970123456`) — the storage
 * format: unambiguous, `tel:`-safe, and what every SMS gateway expects.
 * Returns null when the number isn't a real, dialable one.
 */
export function toE164(value: string): string | null {
  const parsed = parsePhoneNumberFromString(value.trim(), DEFAULT_REGION)
  return parsed?.isValid() ? parsed.format("E.164") : null
}

/** Renders a stored E.164 number in readable national form, e.g. `070 123 456`. */
export function formatPhoneForDisplay(value: string): string {
  const parsed = parsePhoneNumberFromString(value)
  return parsed?.isValid() ? parsed.formatNational() : value
}

/** Today at midnight — the earliest date a job can be requested for. */
function startOfToday(): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export const bookingRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Describe the job in at least 10 characters.")
    .max(1000, "Keep the description under 1000 characters."),

  address: z
    .string()
    .trim()
    .min(5, "Enter the street and city where the job is.")
    .max(200, "That address is too long."),

  phone: z
    .string()
    .trim()
    .min(1, "Add a phone number so the fixer can reach you.")
    // Stored in E.164, so the parsed form is what leaves this schema.
    .transform((value, ctx) => {
      const e164 = toE164(value)
      if (!e164) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid phone number, e.g. 070 123 456 or +389 70 123 456.",
        })
        return z.NEVER
      }
      return e164
    }),

  date: z
    .date({ error: "Pick the day you need the job done." })
    .refine((value) => value >= startOfToday(), "Pick today or a later date."),

  time: z
    .string({ error: "Pick a time." })
    .min(1, "Pick a time.")
    .refine((value) => BOOKING_TIME_SLOTS.includes(value), "Pick a time from the list."),
})

export type BookingRequestValues = z.infer<typeof bookingRequestSchema>

/** Field-keyed messages, ready to render next to each input. */
export type BookingRequestErrors = Partial<Record<keyof BookingRequestValues, string>>

/**
 * Validates the form and returns errors keyed by field. Zod's `treeifyError`
 * shape is flattened here so components stay unaware of the validation library.
 */
export function validateBookingRequest(
  values: unknown
): { success: true; data: BookingRequestValues } | { success: false; errors: BookingRequestErrors } {
  const result = bookingRequestSchema.safeParse(values)
  if (result.success) return { success: true, data: result.data }

  const errors: BookingRequestErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof BookingRequestValues | undefined
    // Keep the first message per field; later ones are usually less specific.
    if (field && !errors[field]) errors[field] = issue.message
  }
  return { success: false, errors }
}
