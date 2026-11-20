"use client"

import { useEffect, useState } from "react"

import { useAuthUser } from "@/hooks/use-auth-user"
import { getCompanyById } from "@/lib/workers"
import type { Company } from "@/lib/data"

/**
 * Loads one worker listing by id, plus the signed-in user the booking panel
 * needs in order to decide between "Request booking" and "Sign in first".
 *
 * The auth half comes from `useAuthUser` rather than a second `getUser()` and
 * `onAuthStateChange` pair: one subscription per concern, in one place.
 */
export function useWorkerDetail(id: string) {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthUser()

  useEffect(() => {
    let active = true

    getCompanyById(id).then((found) => {
      if (!active) return
      setCompany(found)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [id])

  return { company, loading, user }
}
