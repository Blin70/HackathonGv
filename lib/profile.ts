/**
 * Profile-domain models, defaults, and pure helpers.
 * Data access to Supabase lives in `lib/workers.ts`; this module stays free of
 * React and network concerns so it's trivial to reuse and test.
 */

export type ProfileTab = "client" | "worker"

export type ProfileRole = "client" | "tradesman"

export type StatusVariant = "success" | "error"

export type StatusMessage = {
  type: StatusVariant
  text: string
}

export interface ClientProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

export interface WorkerProfileForm {
  businessName: string
  tradeType: string
  price: string
  tagline: string
  aboutUs: string
  bannerImage: string
  availableDays: string
  services: string[]
}

export interface ImagePreset {
  label: string
  url: string
}

/** Fallback banner used by both the worker form default and the live preview. */
export const FALLBACK_BANNER_IMAGE =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop"

/** Curated cover images offered as one-click presets on the worker form. */
export const IMAGE_PRESETS: ImagePreset[] = [
  { label: "Carpentry & Woodwork", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop" },
  { label: "Plumbing & Pipes", url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1200&auto=format&fit=crop" },
  { label: "Electrical & Wiring", url: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1200&auto=format&fit=crop" },
  { label: "Painting & Decorating", url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1200&auto=format&fit=crop" },
  { label: "Roofing & Gutters", url: "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=1200&auto=format&fit=crop" },
  { label: "Tiling & Flooring", url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop" },
  { label: "Masonry & Stone", url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop" },
]

export const EMPTY_CLIENT_FORM: ClientProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
}

export const EMPTY_WORKER_FORM: WorkerProfileForm = {
  businessName: "",
  tradeType: "",
  price: "",
  tagline: "",
  aboutUs: "",
  bannerImage: "",
  availableDays: "",
  services: [],
}

export function splitFullName(fullName?: string | null): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: "", lastName: "" }
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  }
}

export function joinName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}

/** Ensures a price string is rendered with a leading `$`. */
export function formatPrice(price: string): string {
  const trimmed = price.trim()
  if (!trimmed) return ""
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`
}
