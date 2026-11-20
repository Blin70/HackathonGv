import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Safely extracts a human-readable message from an unknown thrown value. */
/**
 * A loggable one-line description of anything thrown.
 *
 * `console.error("msg", err)` had been printing `msg {}` all over this app, for
 * two compounding reasons: Supabase returns plain objects rather than `Error`s,
 * and the Next dev overlay renders any object argument as `{}`. So the shape
 * never reached the console and every failure looked identical.
 *
 * Returning a string fixes both — the overlay prints strings — and
 * `getOwnPropertyNames` keeps non-enumerable fields that a plain
 * `JSON.stringify` would silently drop.
 *
 * This is for logs. User-facing copy goes through `getErrorMessage`, which
 * deliberately stays generic.
 */
export function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`
  if (typeof error === "string") return error
  try {
    return JSON.stringify(error, Object.getOwnPropertyNames(Object(error)))
  } catch {
    return String(error)
  }
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === "string" && error) return error
  return fallback
}
