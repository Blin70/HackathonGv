"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { createClient } from "@/lib/client"
import { getStoredCompanies, saveWorkerCompany } from "@/lib/data"
import {
  DEFAULT_WORKER_FORM,
  EMPTY_CLIENT_FORM,
  deriveCompanyId,
  joinName,
  splitFullName,
  toCompany,
  toWorkerForm,
  type ClientProfileForm,
  type ProfileRole,
  type ProfileTab,
  type StatusMessage,
  type WorkerProfileForm,
} from "@/lib/profile"
import { getErrorMessage } from "@/lib/utils"

const WORKER_ROLES = new Set(["tradesman", "worker"])

/**
 * Owns everything the profile page needs — the authenticated user, both form
 * models, and the persistence handlers — so the UI components stay
 * presentational and are driven entirely through props.
 */
export function useProfile() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Create the Supabase client once. Recreating it every render would make it an
  // unstable effect dependency and re-trigger the profile load on every render.
  const supabase = useMemo(() => createClient(), [])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<StatusMessage | null>(null)

  const [userId, setUserId] = useState("")
  const [role, setRole] = useState<ProfileRole>("client")
  const [companyId, setCompanyId] = useState(999)

  const [activeTab, setActiveTab] = useState<ProfileTab>(
    searchParams.get("tab") === "worker" ? "worker" : "client"
  )

  const [clientForm, setClientForm] = useState<ClientProfileForm>(EMPTY_CLIENT_FORM)
  const [workerForm, setWorkerForm] = useState<WorkerProfileForm>(DEFAULT_WORKER_FORM)

  useEffect(() => {
    let active = true

    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }
        if (!active) return

        setUserId(user.id)
        setClientForm((prev) => ({ ...prev, email: user.email ?? "" }))

        const resolvedRole: ProfileRole = WORKER_ROLES.has(user.user_metadata?.role)
          ? "tradesman"
          : "client"
        setRole(resolvedRole)
        if (resolvedRole === "tradesman" && !searchParams.get("tab")) {
          setActiveTab("worker")
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profile && active) {
          const { firstName, lastName } = splitFullName(profile.full_name)
          setClientForm((prev) => ({
            ...prev,
            firstName: firstName || prev.firstName,
            lastName: lastName || prev.lastName,
            phone: profile.phone_number || prev.phone,
            address: profile.address_line_1 || prev.address,
            city: profile.city || prev.city,
            postalCode: profile.postal_code || prev.postalCode,
          }))
        }

        const derivedId = deriveCompanyId(user.id)
        if (active) setCompanyId(derivedId)

        const fullName = (user.user_metadata?.full_name ?? "").toLowerCase()
        const existingCompany = getStoredCompanies().find(
          (company) => company.id === derivedId || company.name.toLowerCase() === fullName
        )

        if (existingCompany && active) {
          setWorkerForm(toWorkerForm(existingCompany))
        } else if (user.user_metadata?.firstName && active) {
          setWorkerForm((prev) => ({
            ...prev,
            businessName: `${user.user_metadata.firstName}'s Fixer Service`,
          }))
        }
      } catch (error) {
        console.error("Failed to load profile:", error)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [supabase, router, searchParams])

  const setClientField = useCallback(
    <K extends keyof ClientProfileForm>(key: K, value: ClientProfileForm[K]) => {
      setClientForm((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const setWorkerField = useCallback(
    <K extends keyof WorkerProfileForm>(key: K, value: WorkerProfileForm[K]) => {
      setWorkerForm((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const addService = useCallback((rawValue: string) => {
    const value = rawValue.trim()
    if (!value) return
    setWorkerForm((prev) =>
      prev.services.includes(value) ? prev : { ...prev, services: [...prev.services, value] }
    )
  }, [])

  const removeService = useCallback((value: string) => {
    setWorkerForm((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service !== value),
    }))
  }, [])

  const saveClientProfile = useCallback(async () => {
    setSaving(true)
    setStatus(null)

    try {
      // Supabase resolves with an `error` field instead of throwing, so it must
      // be checked explicitly — otherwise failed writes look like successes.
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: joinName(clientForm.firstName, clientForm.lastName),
          phone_number: clientForm.phone,
          address_line_1: clientForm.address,
          city: clientForm.city,
          postal_code: clientForm.postalCode,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) throw error

      setStatus({ type: "success", text: "Client profile updated successfully!" })
    } catch (error) {
      console.error("Failed to update client profile:", error)
      setStatus({ type: "error", text: getErrorMessage(error, "Failed to update profile.") })
    } finally {
      setSaving(false)
    }
  }, [supabase, clientForm, userId])

  const saveWorkerProfile = useCallback(() => {
    setSaving(true)
    setStatus(null)

    try {
      saveWorkerCompany(toCompany(workerForm, companyId))
      setStatus({
        type: "success",
        text: `Worker profile saved & published live! Click "View Live Public Profile" below to see how it looks to clients.`,
      })
    } catch (error) {
      console.error("Failed to publish worker profile:", error)
      setStatus({ type: "error", text: getErrorMessage(error, "Failed to publish worker profile.") })
    } finally {
      setSaving(false)
    }
  }, [companyId, workerForm])

  return {
    loading,
    saving,
    status,
    role,
    companyId,
    activeTab,
    setActiveTab,
    clientForm,
    setClientField,
    saveClientProfile,
    workerForm,
    setWorkerField,
    addService,
    removeService,
    saveWorkerProfile,
  }
}
