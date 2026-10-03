"use client"

import { useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import type { User } from "@supabase/supabase-js"

import { createBooking, hasOpenBooking, DuplicateBookingError } from "@/lib/bookings"
import { fetchClientContact } from "@/lib/clients"
import type { Company } from "@/lib/data"
import { validateBookingRequest, type BookingRequestErrors } from "@/lib/schemas/booking"
import { getErrorMessage } from "@/lib/utils"

export interface BookingRequestForm {
  message: string
  address: string
  phone: string
  date: Date | undefined
  time: string
}

export type { BookingRequestErrors }

const EMPTY_FORM: BookingRequestForm = {
  message: "",
  address: "",
  phone: "",
  date: undefined,
  time: "",
}

/** Keeps the phone field to characters a number can actually contain. */
function sanitisePhoneInput(value: string): string {
  return value.replace(/[^\d+\s-]/g, "")
}

/**
 * Drives the booking request form: pre-fills contact details from the client's
 * saved profile, validates with the shared zod schema, and submits the request.
 *
 * `open` gates the network work so it happens when the client actually opens
 * the form, not on every worker profile page view. `company` is nullable
 * because the host page still resolves it when this hook first runs.
 */
export function useBookingRequest(company: Company | null, user: User | null, open: boolean) {
  const [form, setForm] = useState<BookingRequestForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<BookingRequestErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [booked, setBooked] = useState(false)
  const [alreadyOpen, setAlreadyOpen] = useState(false)

  const workerId = company ? String(company.id) : null

  useEffect(() => {
    if (!open || !user || !workerId) return
    let active = true

    async function load() {
      const [contact, duplicate] = await Promise.all([
        fetchClientContact(user!.id),
        hasOpenBooking(user!.id, workerId!),
      ])
      if (!active) return

      setAlreadyOpen(duplicate)
      // Only fill blanks — never clobber something the client already typed.
      setForm((prev) => ({
        ...prev,
        phone: prev.phone || contact.phone,
        address: prev.address || contact.address,
      }))
    }

    load()

    return () => {
      active = false
    }
  }, [open, user, workerId])

  const setField = useCallback(
    <K extends keyof BookingRequestForm>(key: K, value: BookingRequestForm[K]) => {
      const next =
        key === "phone" ? (sanitisePhoneInput(value as string) as BookingRequestForm[K]) : value

      setForm((prev) => ({ ...prev, [key]: next }))
      // Clear a field's error as soon as the client edits it.
      setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    },
    []
  )

  const reset = useCallback(() => {
    setForm(EMPTY_FORM)
    setErrors({})
    setSubmitError(null)
    setBooked(false)
    setAlreadyOpen(false)
  }, [])

  const submit = useCallback(async () => {
    if (!user || !company || submitting || alreadyOpen) return

    const result = validateBookingRequest(form)
    if (!result.success) {
      setErrors(result.errors)
      return
    }

    setErrors({})
    setSubmitting(true)
    setSubmitError(null)

    try {
      const { data } = result
      const { error } = await createBooking({
        clientId: user.id,
        clientName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Client",
        workerId: String(company.id),
        workerName: company.name,
        tradeType: company.type,
        message: data.message,
        // The column is a bare `date`, so format in local time rather than
        // toISOString(), which would shift the day for evening selections.
        preferredDate: format(data.date, "yyyy-MM-dd"),
        preferredTime: data.time,
        // Already normalised to E.164 by the schema.
        clientPhone: data.phone,
        address: data.address,
      })

      if (error) throw error
      setBooked(true)
    } catch (err) {
      if (err instanceof DuplicateBookingError) {
        setAlreadyOpen(true)
        setSubmitError(err.message)
      } else {
        console.error("Failed to create booking:", err)
        setSubmitError(getErrorMessage(err, "Couldn't send your request. Please try again."))
      }
    } finally {
      setSubmitting(false)
    }
  }, [user, company, submitting, alreadyOpen, form])

  return { form, setField, errors, submitting, submitError, booked, alreadyOpen, submit, reset }
}
