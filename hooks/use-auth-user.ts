"use client"

import { useCallback, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

import { createClient } from "@/lib/client"

/**
 * The signed-in user, for components that render different things to guests
 * and members — the header and the footer both do.
 *
 * It subscribes to auth changes, so signing in or out updates every consumer
 * without a reload. `loading` starts true: render a neutral state until it
 * clears, or a signed-in visitor sees a flash of "Sign in" first.
 */
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  /** Workers signed up under either spelling of the role; both are current. */
  const isWorker =
    user?.user_metadata?.role === "tradesman" || user?.user_metadata?.role === "worker"

  return { user, loading, isWorker, signOut }
}
