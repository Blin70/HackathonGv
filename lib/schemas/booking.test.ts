import { describe, expect, it } from "vitest"

import { BOOKING_TIME_SLOTS } from "@/lib/bookings"
import {
  formatPhoneForDisplay,
  toE164,
  validateBookingRequest,
} from "@/lib/schemas/booking"

/** A date that is always valid for a booking, regardless of when tests run. */
function tomorrow(): Date {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(0, 0, 0, 0)
  return date
}

function validValues(overrides: Record<string, unknown> = {}) {
  return {
    message: "The kitchen tap has been dripping for two days.",
    address: "Partizanski Odredi 12, Skopje",
    phone: "070 123 456",
    date: tomorrow(),
    time: BOOKING_TIME_SLOTS[0],
    ...overrides,
  }
}

describe("toE164", () => {
  it("reads a bare local number as North Macedonian", () => {
    expect(toE164("070 123 456")).toBe("+38970123456")
  })

  it("ignores surrounding whitespace and punctuation", () => {
    expect(toE164("  070-123-456  ")).toBe("+38970123456")
  })

  it("keeps the country of an explicitly prefixed number", () => {
    // Guards the comment in booking.ts: the MK default must not clobber a
    // number the user gave a country code for.
    expect(toE164("+44 20 7183 8750")).toBe("+442071838750")
  })

  it("returns null for input that is not a dialable number", () => {
    expect(toE164("not a phone")).toBeNull()
    expect(toE164("")).toBeNull()
    expect(toE164("070 12")).toBeNull()
  })
})

describe("formatPhoneForDisplay", () => {
  it("renders a stored E.164 number in national form", () => {
    const display = formatPhoneForDisplay("+38970123456")
    expect(display).not.toBe("+38970123456")
    expect(display.replace(/\D/g, "")).toBe("070123456")
  })

  it("passes through anything it cannot parse, rather than throwing", () => {
    expect(formatPhoneForDisplay("whatever")).toBe("whatever")
  })

  it("formats numbers stored in national form, not just E.164", () => {
    // Rows written before storage was normalised hold national-format
    // numbers. Without a default region these parsed as nothing and rendered
    // raw, so one booking showed "072 522 138" and another "072-522-138".
    const fromE164 = formatPhoneForDisplay("+38972522138")
    for (const stored of ["072522138", "072-522-138", "072 522 138", " 072 522 138 "]) {
      expect(formatPhoneForDisplay(stored), `${stored} should render canonically`).toBe(fromE164)
    }
  })

  it("still renders an unparseable number unchanged", () => {
    expect(formatPhoneForDisplay("072 52")).toBe("072 52")
  })

  it("handles a missing number instead of throwing", () => {
    // Bookings can carry no phone at all; .trim() on null would crash the
    // whole bookings list rather than hiding one field.
    expect(formatPhoneForDisplay(null)).toBe("")
    expect(formatPhoneForDisplay(undefined)).toBe("")
    expect(formatPhoneForDisplay("")).toBe("")
  })
})

describe("validateBookingRequest", () => {
  it("accepts a complete request and stores the phone in E.164", () => {
    const result = validateBookingRequest(validValues())
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.phone).toBe("+38970123456")
    expect(result.data.message).toBe("The kitchen tap has been dripping for two days.")
  })

  it("trims the free-text fields", () => {
    const result = validateBookingRequest(
      validValues({ message: "  Boiler is making a loud noise.  " })
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.message).toBe("Boiler is making a loud noise.")
  })

  it("rejects a description that is too short to act on", () => {
    const result = validateBookingRequest(validValues({ message: "leak" }))
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errors.message).toBeDefined()
  })

  it("rejects an address that cannot be visited", () => {
    const result = validateBookingRequest(validValues({ address: "x" }))
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errors.address).toBeDefined()
  })

  it("rejects an unreachable phone number", () => {
    const result = validateBookingRequest(validValues({ phone: "123" }))
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errors.phone).toContain("valid phone number")
  })

  it("rejects a date in the past", () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const result = validateBookingRequest(validValues({ date: yesterday }))
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errors.date).toBe("Pick today or a later date.")
  })

  it("accepts today, since same-day jobs are the common case", () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const result = validateBookingRequest(validValues({ date: today }))
    expect(result.success).toBe(true)
  })

  it("rejects a time that is not one of the offered slots", () => {
    const result = validateBookingRequest(validValues({ time: "03:17" }))
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errors.time).toBe("Pick a time from the list.")
  })

  it("reports every invalid field at once, one message each", () => {
    const result = validateBookingRequest({
      message: "no",
      address: "",
      phone: "nope",
      date: new Date("not a date"),
      time: "",
    })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(Object.keys(result.errors).sort()).toEqual([
      "address",
      "date",
      "message",
      "phone",
      "time",
    ])
    for (const message of Object.values(result.errors)) {
      expect(message).toBeTruthy()
    }
  })

  it("rejects a payload that is not an object at all", () => {
    expect(validateBookingRequest(null).success).toBe(false)
    expect(validateBookingRequest("nope").success).toBe(false)
  })
})

describe("BOOKING_TIME_SLOTS", () => {
  it("runs from 08:00 to 20:00 in half-hour steps", () => {
    expect(BOOKING_TIME_SLOTS[0]).toBe("08:00")
    expect(BOOKING_TIME_SLOTS.at(-1)).toBe("20:00")
    expect(BOOKING_TIME_SLOTS).toHaveLength(25)
  })

  it("holds no duplicates, so the picker cannot show one twice", () => {
    expect(new Set(BOOKING_TIME_SLOTS).size).toBe(BOOKING_TIME_SLOTS.length)
  })
})
