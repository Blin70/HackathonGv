import { describe, expect, it } from "vitest"

import {
  BOOKING_STATUSES,
  BOOKING_TIME_SLOTS,
  bookingBlockReason,
  monthlyBookingActivity,
  type BookingStatus,
} from "@/lib/bookings"

/** Only the fields the activity chart reads. */
function booking(status: BookingStatus, created: Date) {
  return { status, created_at: created.toISOString() }
}

function monthsAgo(n: number): Date {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth() - n, 15)
}

// monthlyBookingActivity takes the full booking rows; the chart only reads
// status and created_at, so the test supplies those.
const activity = monthlyBookingActivity as unknown as (
  rows: ReturnType<typeof booking>[],
  months: number
) => { month: string; accepted: number; notAccepted: number }[]

describe("monthlyBookingActivity", () => {
  it("returns one bucket per month, oldest first, including empty ones", () => {
    const points = activity([], 6)
    expect(points).toHaveLength(6)
    for (const p of points) {
      expect(p.accepted).toBe(0)
      expect(p.notAccepted).toBe(0)
    }
  })

  it("counts a finished job as accepted, not as a miss", () => {
    // The bug this guards: keying on the literal "confirmed" status put
    // in-progress and completed jobs in the "not accepted" bucket, so a
    // worker's own finished work showed up as negative on their dashboard.
    for (const status of ["confirmed", "in_progress", "completed"] as const) {
      const points = activity([booking(status, monthsAgo(1))], 6)
      const month = points.at(-2)!
      expect(month.accepted, `${status} should count as accepted`).toBe(1)
      expect(month.notAccepted, `${status} should not count as a miss`).toBe(0)
    }
  })

  it("counts pending, declined and cancelled as not accepted", () => {
    for (const status of ["pending", "declined", "cancelled"] as const) {
      const points = activity([booking(status, monthsAgo(1))], 6)
      const month = points.at(-2)!
      expect(month.notAccepted, `${status} should count as not accepted`).toBe(1)
      expect(month.accepted).toBe(0)
    }
  })

  it("puts every known status in exactly one bucket", () => {
    for (const status of BOOKING_STATUSES) {
      const month = activity([booking(status, monthsAgo(1))], 6).at(-2)!
      expect(month.accepted + month.notAccepted, `${status} must be counted once`).toBe(1)
    }
  })

  it("groups several bookings into the right months", () => {
    const points = activity(
      [
        booking("completed", monthsAgo(0)),
        booking("completed", monthsAgo(0)),
        booking("pending", monthsAgo(0)),
        booking("declined", monthsAgo(2)),
      ],
      6
    )
    expect(points.at(-1)).toMatchObject({ accepted: 2, notAccepted: 1 })
    expect(points.at(-3)).toMatchObject({ accepted: 0, notAccepted: 1 })
  })

  it("ignores bookings older than the window rather than folding them in", () => {
    const points = activity([booking("completed", monthsAgo(11))], 6)
    expect(points.reduce((n, p) => n + p.accepted + p.notAccepted, 0)).toBe(0)
  })

  it("ignores an unparseable created_at instead of throwing", () => {
    const points = activity([{ status: "completed", created_at: "not a date" }], 6)
    expect(points).toHaveLength(6)
    expect(points.reduce((n, p) => n + p.accepted + p.notAccepted, 0)).toBe(0)
  })
})

describe("BOOKING_TIME_SLOTS", () => {
  it("covers the working day in half-hour steps", () => {
    expect(BOOKING_TIME_SLOTS[0]).toBe("08:00")
    expect(BOOKING_TIME_SLOTS.at(-1)).toBe("20:00")
  })
})

describe("bookingBlockReason", () => {
  const WORKER_ID = "3f1b9c2e-0000-4000-8000-000000000001"
  const OTHER_ID = "3f1b9c2e-0000-4000-8000-000000000002"

  it("lets a signed-in client book someone else's real listing", () => {
    expect(bookingBlockReason({ id: WORKER_ID, isDemo: false }, OTHER_ID)).toBeNull()
  })

  it("lets a guest through, so the page can ask them to sign in", () => {
    expect(bookingBlockReason({ id: WORKER_ID, isDemo: false }, null)).toBeNull()
  })

  it("stops a tradesperson booking their own listing", () => {
    // Self-dealing: it is also the only route to reviewing yourself, since a
    // review is written by the client of a completed booking.
    expect(bookingBlockReason({ id: WORKER_ID, isDemo: false }, WORKER_ID)).toBe("own-listing")
  })

  it("stops anyone booking an example listing", () => {
    // Its id belongs to no account, so the request would reach nobody and the
    // customer would wait for a reply that cannot come.
    expect(bookingBlockReason({ id: 1, isDemo: true }, OTHER_ID)).toBe("example-listing")
    expect(bookingBlockReason({ id: 1, isDemo: true }, null)).toBe("example-listing")
  })

  it("compares a numeric listing id against the user id as text", () => {
    // Company.id is a number for examples and a uuid string for real rows;
    // a loose == would make listing 1 "owned" by a user whose id is "1".
    expect(bookingBlockReason({ id: 7, isDemo: false }, "7")).toBe("own-listing")
    expect(bookingBlockReason({ id: 7, isDemo: false }, "8")).toBeNull()
  })
})
