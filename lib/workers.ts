import { createClient } from "@/lib/client"
import { COMPANIES, type Company } from "@/lib/data"
import { FALLBACK_BANNER_IMAGE, formatPrice, type WorkerProfileForm } from "@/lib/profile"
import { fetchReviewStats, type ReviewStat } from "@/lib/reviews"

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

/** Maps a DB row onto the `Company` shape the marketplace UI already renders. */
export function rowToCompany(row: WorkerProfileRow): Company {
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
    price: row.price || "$—",
    image: row.banner_image || FALLBACK_BANNER_IMAGE,
    isVerified: row.is_verified,
  }
}

/** Maps a DB row onto the editable worker form model. */
export function rowToWorkerForm(row: WorkerProfileRow): WorkerProfileForm {
  return {
    businessName: row.business_name || row.display_name || "",
    tradeType: row.trade_type || "",
    price: row.price || "",
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
    price: formatPrice(form.price) || null,
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

/**
 * All marketplace listings (real workers first, then the demo catalogue), each
 * with its real review rating + count folded in. Unreviewed listings come back
 * with 0/0, which the UI renders as a "New" badge.
 */
export async function getMarketplaceCompanies(): Promise<Company[]> {
  const supabase = createClient()
  const [workers, stats] = await Promise.all([
    supabase.from("worker_profiles").select("*").order("updated_at", { ascending: false }),
    fetchReviewStats(),
  ])

  let companies: Company[]
  if (workers.error) {
    console.error("Failed to load worker profiles, falling back to demo data:", workers.error)
    companies = COMPANIES
  } else {
    companies = [...(workers.data as WorkerProfileRow[]).map(rowToCompany), ...COMPANIES]
  }
  return applyReviewStats(companies, stats)
}

/** A single listing by id — a seeded demo company (numeric id) or a real worker (uuid). */
export async function getCompanyById(id: string): Promise<Company | null> {
  const seeded = COMPANIES.find((c) => String(c.id) === id)
  if (seeded) return seeded

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("worker_profiles")
      .select("*")
      .eq("user_id", id)
      .maybeSingle()

    if (error) throw error
    return data ? rowToCompany(data as WorkerProfileRow) : null
  } catch (err) {
    console.error("Failed to load worker profile:", err)
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
