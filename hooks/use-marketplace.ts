"use client"

import { useEffect, useState } from "react"

import type { Company } from "@/lib/data"
import { getMarketplaceCompanies } from "@/lib/workers"

/**
 * The listings shown on the marketplace: real worker profiles, plus whatever
 * example listings `demoListingMode()` allows alongside them.
 *
 * `loading` starts true so the page can tell "still fetching" apart from
 * "nothing matched". Without it the marketplace rendered its count before the
 * first fetch settled and told every new visitor there were 0 fixers.
 */
export function useMarketplace() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    getMarketplaceCompanies()
      .then((found) => {
        if (active) setCompanies(found)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { companies, loading }
}
