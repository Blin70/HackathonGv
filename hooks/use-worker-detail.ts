"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

import { createClient } from "@/lib/client"
import { getCompanyById } from "@/lib/workers"
import type { Company } from "@/lib/data"

/** Loads a worker listing by id plus the current auth user (kept in sync). */
export function useWorkerDetail(id: string) {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let active = true

    getCompanyById(id).then((found) => {
      if (!active) return
      setCompany(found)
      setLoading(false)
    })

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (active) setUser(user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [id])

  return { company, loading, user }
}
