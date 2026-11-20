import { createClient } from "@/lib/client"
import { formatPriceOrDash, stripCurrency } from "@/lib/currency"
import { COMPANIES, type Company } from "@/lib/data"
import { FALLBACK_BANNER_IMAGE, type WorkerProfileForm } from "@/lib/profile"
import { fetchReviewStats, type ReviewStat } from "@/lib/reviews"
import { describeError } from "@/lib/utils"

/** Shape of a `public.worker_profiles` row. */
export interface WorkerProfileRow {
  user_id: string
  account_type: string
  display_name: string
  business_name: string | null
  trade_type: string | null
  phone: string | null
  city: string | null
  tagline: string | null
  about_us: string | null
  services: string[] | null
  available_days: string | null
  price: string | null
  banner_image: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

/**
 * The columns a signed-out visitor needs to render a listing.
 *
 * Deliberately not `*`. `worker_profiles` is world-readable (its RLS policy is
 * `USING (true)`, because the marketplace has to work signed out), so every
 * column in a `select("*")` is shipped to every anonymous visitor — including
 * `phone`, which no public screen ever displays. Asking for the twelve columns
 * the UI actually uses keeps tradespeople's numbers out of the page payload.
 *
 * This narrows exposure; it does not close it. RLS is row-level, so anyone
 * with the publishable key can still request `phone` directly. The fix for
 * that is a column grant on the table — see the note in
 * supabase/migrations/20261120090000_profiles_rls_policies.sql.
 */
export const PUBLIC_WORKER_COLUMNS =
  "user_id, display_name, business_name, trade_type, tagline, about_us, services, available_days, price, banner_image, city, is_verified"

/** A `worker_profiles` row reduced to the publicly visible columns. */
export type PublicWorkerProfileRow = Pick<
  WorkerProfileRow,
  | "user_id"
  | "display_name"
  | "business_name"
  | "trade_type"
  | "tagline"
  | "about_us"
  | "services"
  | "available_days"
  | "price"
  | "banner_image"
  | "city"
  | "is_verified"
>

/** Maps a DB row onto the `Company` shape the marketplace UI already renders. */
export function rowToCompany(row: PublicWorkerProfileRow): Company {
  return {
    id: row.user_id,
    name: row.display_name || row.business_name || "Fixer",
    type: row.trade_type || "General",
    desc: row.tagline || "Professional repair and fix service.",
    aboutUs: row.about_us || "",
    services: row.services ?? [],
    availableDays: row.available_days || "By appointment",
    // Real rating + count are folded in by getMarketplaceCompanies from the
    // reviews table; 0 here means "no reviews yet" → renders as a "New" badge.
    rating: 0,
    reviews: 0,
    price: formatPriceOrDash(row.price),
    image: row.banner_image || FALLBACK_BANNER_IMAGE,
    city: row.city || "",
    isVerified: row.is_verified,
  }
}

/** One requirement on a worker's listing, used to score profile completeness. */
export interface ProfileChecklistItem {
  label: string
  done: boolean
}

/**
 * The listing fields that make a worker discoverable and bookable.
 *
 * Deliberately excludes verification: that is opt-in and positive-only, so
 * scoring it here would pressure unregistered tradespeople into disclosing
 * their status just to clear the meter.
 */
export function profileChecklist(row: WorkerProfileRow): ProfileChecklistItem[] {
  return [
    { label: "Trade category", done: Boolean(row.trade_type) },
    { label: "Starting rate", done: Boolean(row.price) },
    { label: "Tagline", done: Boolean(row.tagline) },
    { label: "About", done: Boolean(row.about_us) },
    { label: "Services", done: (row.services?.length ?? 0) > 0 },
    { label: "Availability", done: Boolean(row.available_days) },
    { label: "Cover image", done: Boolean(row.banner_image) },
  ]
}

/** Share of checklist items completed, as a whole percentage. */
export function profileCompleteness(items: ProfileChecklistItem[]): number {
  if (items.length === 0) return 100
  return Math.round((items.filter((item) => item.done).length / items.length) * 100)
}

/** Maps a DB row onto the editable worker form model. */
export function rowToWorkerForm(row: WorkerProfileRow): WorkerProfileForm {
  return {
    businessName: row.business_name || row.display_name || "",
    tradeType: row.trade_type || "",
    price: stripCurrency(row.price ?? ""),
    tagline: row.tagline || "",
    aboutUs: row.about_us || "",
    bannerImage: row.banner_image || "",
    availableDays: row.available_days || "",
    services: row.services ?? [],
  }
}

/**
 * Builds the upsert payload for a worker's own row. Only listing columns are
 * included — `account_type`, verification, and timestamps set elsewhere are
 * left untouched on update.
 */
function workerFormToRow(form: WorkerProfileForm, userId: string) {
  const name = form.businessName.trim()
  return {
    user_id: userId,
    display_name: name,
    business_name: name || null,
    trade_type: form.tradeType || null,
    // phone/city/account_type are set at signup and not edited here — omitting
    // them from the upsert leaves the existing values untouched.
    tagline: form.tagline || null,
    about_us: form.aboutUs || null,
    services: form.services,
    available_days: form.availableDays || null,
    price: stripCurrency(form.price) || null,
    banner_image: form.bannerImage || null,
    updated_at: new Date().toISOString(),
  }
}

/** Overlays each listing's real review aggregate (avg rating + count) from the reviews table. */
function applyReviewStats(companies: Company[], stats: Map<string, ReviewStat>): Company[] {
  return companies.map((company) => {
    const stat = stats.get(String(company.id))
    return { ...company, rating: stat?.rating ?? 0, reviews: stat?.count ?? 0 }
  })
}

export type DemoListingMode = "always" | "never" | "until-real"

/**
 * How the seeded example listings behave, from `NEXT_PUBLIC_SHOW_DEMO_LISTINGS`.
 *
 * `always` is the default while the marketplace is being built out: a single
 * test account should not empty the page, and an example is honest as long as
 * it is badged, which every surface does. Switch to `until-real` to have
 * examples retire themselves once any real listing exists, or `never` to hide
 * them outright — that is the switch to throw at launch.
 */
export function demoListingMode(): DemoListingMode {
  const mode = process.env.NEXT_PUBLIC_SHOW_DEMO_LISTINGS
  return mode === "never" || mode === "until-real" ? mode : "always"
}

/** Whether the seeded example listings should appear alongside real ones. */
export function shouldIncludeDemoListings(realListingCount: number): boolean {
  const mode = demoListingMode()
  if (mode === "never") return false
  if (mode === "until-real") return realListingCount === 0
  return true
}

/**
 * All marketplace listings (real workers first, then example listings if they
 * still apply), each with its real review rating + count folded in. Unreviewed
 * listings come back with 0/0, which the UI renders as a "New" badge.
 */
export async function getMarketplaceCompanies(): Promise<Company[]> {
  const supabase = createClient()
  const [workers, stats] = await Promise.all([
    supabase
      .from("worker_profiles")
      .select(PUBLIC_WORKER_COLUMNS)
      .order("updated_at", { ascending: false }),
    fetchReviewStats(),
  ])

  if (workers.error) {
    console.error("Failed to load worker profiles, falling back to demo data:", workers.error)
    return applyReviewStats(COMPANIES, stats)
  }

  const real = (workers.data as PublicWorkerProfileRow[]).map(rowToCompany)
  const companies = shouldIncludeDemoListings(real.length) ? [...real, ...COMPANIES] : real
  return applyReviewStats(companies, stats)
}

/** A single listing by id — a seeded example (numeric id) or a real worker (uuid). */
export async function getCompanyById(id: string): Promise<Company | null> {
  const seeded = COMPANIES.find((c) => String(c.id) === id)
  if (seeded) {
    const mode = demoListingMode()
    if (mode === "never") return null
    if (mode === "always") return seeded

    // Only `until-real` needs to know how many real listings there are, so the
    // count query is not paid for on every example page view.
    const { count } = await createClient()
      .from("worker_profiles")
      .select("user_id", { count: "exact", head: true })
    return (count ?? 0) === 0 ? seeded : null
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("worker_profiles")
      .select(PUBLIC_WORKER_COLUMNS)
      .eq("user_id", id)
      .maybeSingle()

    if (error) throw error
    return data ? rowToCompany(data as PublicWorkerProfileRow) : null
  } catch (err) {
    console.error(`Failed to load worker profile: ${describeError(err)}`)
    return null
  }
}

/** Loads the signed-in worker's own row (may not exist yet). */
export async function fetchWorkerRow(userId: string): Promise<WorkerProfileRow | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (error) throw error
  return (data as WorkerProfileRow | null) ?? null
}

/** Upserts the signed-in worker's listing. Returns Supabase's `{ error }`. */
export async function saveWorkerRow(form: WorkerProfileForm, userId: string) {
  const supabase = createClient()
  return supabase
    .from("worker_profiles")
    .upsert(workerFormToRow(form, userId), { onConflict: "user_id" })
}
