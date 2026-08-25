import type { Company } from "@/lib/data"

/**
 * Profile-domain models, defaults, and pure helpers.
 * Lives beside `lib/data.ts` (which owns the `Company` catalogue) so the whole
 * fixer/worker domain stays in one place and can be imported anywhere.
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

/** Demo defaults that pre-fill the worker form until a saved profile is loaded. */
export const DEFAULT_WORKER_FORM: WorkerProfileForm = {
  businessName: "Oak & Timber Carpentry",
  tradeType: "Carpenter",
  price: "$120",
  tagline: "Custom built-ins, doors, decking & structural woodwork.",
  aboutUs:
    "Master craftsmen dedicated to creating beautiful, enduring woodwork. We build custom solutions tailored precisely to your space.",
  bannerImage: FALLBACK_BANNER_IMAGE,
  availableDays: "Monday - Saturday (8am - 6pm)",
  services: ["Custom Built-ins", "Deck Construction", "Door Installation", "Structural Framing"],
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

/**
 * Deterministically maps a Supabase user id to a stable public company id, so
 * the same user always resolves to the same `/book/[id]` page (range 100–10099).
 */
export function deriveCompanyId(userId: string): number {
  const checksum = userId
    .replace(/-/g, "")
    .split("")
    .reduce<number>((sum, char) => sum + char.charCodeAt(0), 0)
  return (Math.abs(checksum) % 10000) + 100
}

/** Builds a persistable `Company` from the worker form state. */
export function toCompany(form: WorkerProfileForm, companyId: number): Company {
  return {
    id: companyId,
    name: form.businessName || "Pro Worker",
    type: form.tradeType,
    desc: form.tagline || "Professional repair and fix service.",
    aboutUs: form.aboutUs || "Dedicated professional providing top quality work.",
    services: form.services.length ? form.services : ["General Repairs"],
    availableDays: form.availableDays || "Monday - Saturday",
    rating: 4.9,
    reviews: 189,
    price: formatPrice(form.price),
    image: form.bannerImage,
  }
}

/** Maps a stored `Company` back onto the editable worker form model. */
export function toWorkerForm(company: Company): WorkerProfileForm {
  return {
    businessName: company.name,
    tradeType: company.type,
    price: company.price,
    tagline: company.desc,
    aboutUs: company.aboutUs,
    bannerImage: company.image,
    availableDays: company.availableDays,
    services: company.services?.length ? company.services : DEFAULT_WORKER_FORM.services,
  }
}

/** Ensures a price string is rendered with a leading `$`. */
export function formatPrice(price: string): string {
  const trimmed = price.trim()
  if (!trimmed) return ""
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`
}
