import { describe, expect, it } from "vitest"

import { describeError, cn, getErrorMessage } from "@/lib/utils"

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("rounded-xl", "border")).toBe("rounded-xl border")
  })

  it("lets the last conflicting Tailwind utility win", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
    expect(cn("text-primary", "text-muted-foreground")).toBe("text-muted-foreground")
  })

  it("drops falsy values so conditional classes stay readable", () => {
    expect(cn("border", false && "hidden", undefined, null, "p-2")).toBe("border p-2")
  })
})

describe("getErrorMessage", () => {
  it("prefers the message of a real Error", () => {
    expect(getErrorMessage(new Error("Supabase is unreachable."), "fallback")).toBe(
      "Supabase is unreachable."
    )
  })

  it("uses the fallback for an Error with an empty message", () => {
    expect(getErrorMessage(new Error(""), "fallback")).toBe("fallback")
  })

  it("accepts a thrown string", () => {
    expect(getErrorMessage("plain string failure", "fallback")).toBe("plain string failure")
  })

  it("uses the fallback for values that carry no message", () => {
    for (const thrown of [null, undefined, 0, "", {}, [], new Error()]) {
      expect(getErrorMessage(thrown, "fallback")).toBe("fallback")
    }
  })

  it("does not leak a non-Error object into the UI as '[object Object]'", () => {
    expect(getErrorMessage({ status: 500, detail: "internal" }, "Something went wrong.")).toBe(
      "Something went wrong."
    )
  })
})

describe("describeError", () => {
  it("renders a Supabase-style plain object instead of an empty one", () => {
    // The bug this exists for: `console.error("msg", err)` printed `msg {}`
    // because Supabase errors are plain objects, not Errors, and the Next dev
    // overlay renders object arguments as `{}`.
    const pgError = { code: "42501", message: "row violates row-level security", details: null }
    const described = describeError(pgError)
    expect(described).toContain("42501")
    expect(described).toContain("row-level security")
    expect(described).not.toBe("{}")
  })

  it("keeps an Error's name and message", () => {
    expect(describeError(new TypeError("boom"))).toBe("TypeError: boom")
  })

  it("passes a string through", () => {
    expect(describeError("plain failure")).toBe("plain failure")
  })

  it("survives something that cannot be serialised", () => {
    const circular: Record<string, unknown> = {}
    circular.self = circular
    expect(() => describeError(circular)).not.toThrow()
  })

  it("does not lose a non-enumerable field", () => {
    const err = {}
    Object.defineProperty(err, "code", { value: "23514", enumerable: false })
    expect(describeError(err)).toContain("23514")
  })
})
