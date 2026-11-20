"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

import { createClient } from "@/lib/client"

/** True for accounts that signed up as a tradesperson or company. */
export function isWorkerUser(user: User | null): boolean {
  const role = user?.user_metadata?.role
  return role === "tradesman" || role === "worker"
}

/**
 * The signed-in Supabase user, kept in sync with sign-in and sign-out.
 * `loading` is true until the first answer arrives, so callers can avoid
 * flashing signed-out UI at a signed-in user.
 */
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let active = true

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      setUser(data.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, isWorker: isWorkerUser(user) }
}
