import { createClient } from "@/lib/client"

/** Shape of a `public.profiles` row. */
export interface ClientProfileRow {
  id: string
  full_name: string | null
  phone_number: string | null
  address_line_1: string | null
  city: string | null
  postal_code: string | null
  updated_at: string | null
}

/** The contact details a booking request pre-fills from the client's profile. */
export interface ClientContact {
  phone: string
  address: string
}

export const EMPTY_CLIENT_CONTACT: ClientContact = { phone: "", address: "" }

/**
 * Best-effort contact prefill for the booking form. Clients aren't required to
 * complete a profile, so a missing row is normal: this resolves to empty
 * strings rather than throwing, and the form simply starts blank.
 */
export async function fetchClientContact(userId: string): Promise<ClientContact> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("phone_number, address_line_1, city")
    .eq("id", userId)
    .maybeSingle()

  if (error || !data) return EMPTY_CLIENT_CONTACT

  const row = data as Pick<ClientProfileRow, "phone_number" | "address_line_1" | "city">
  return {
    phone: row.phone_number ?? "",
    address: [row.address_line_1, row.city].filter(Boolean).join(", "),
  }
}
