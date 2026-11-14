import { describe, expect, it } from "vitest"

import { cn, getErrorMessage } from "@/lib/utils"

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
