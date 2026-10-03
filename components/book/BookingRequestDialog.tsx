"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BOOKING_TIME_SLOTS } from "@/lib/bookings"
import type { BookingRequestErrors, BookingRequestForm } from "@/hooks/use-booking-request"

interface BookingRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyName: string
  form: BookingRequestForm
  errors: BookingRequestErrors
  submitting: boolean
  submitError: string | null
  /** The client already has an open request with this worker. */
  alreadyOpen: boolean
  onFieldChange: <K extends keyof BookingRequestForm>(
    key: K,
    value: BookingRequestForm[K]
  ) => void
  onSubmit: () => void
}

/** Inline validation message tied to a field. */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-xs font-semibold text-red-600">
      {message}
    </p>
  )
}

export function BookingRequestDialog({
  open,
  onOpenChange,
  companyName,
  form,
  errors,
  submitting,
  submitError,
  alreadyOpen,
  onFieldChange,
  onSubmit,
}: BookingRequestDialogProps) {
  const [dateOpen, setDateOpen] = useState(false)

  // Clients can't book a job in the past.
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Bounded flex column: the body scrolls and the footer stays pinned, so
          the form fits any screen height. `dvh` tracks mobile browser chrome. */}
      <DialogContent className="sm:max-w-lg rounded-3xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90dvh]">
        <DialogHeader className="px-6 pt-6 pb-4 text-left shrink-0">
          <DialogTitle className="text-xl font-black text-foreground">
            Request {companyName}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Tell them what you need. They&apos;ll confirm before any work starts.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5 flex-1 min-h-0 overflow-y-auto">
          {alreadyOpen && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-semibold text-amber-900 leading-relaxed">
              You already have an open request with {companyName}. Wait for them to finish it before
              sending another — you can track it under My Bookings.
            </div>
          )}

          {/* What */}
          <div className="space-y-2">
            <Label htmlFor="job-message" className="font-bold text-sm">
              What needs doing? <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="job-message"
              value={form.message}
              onChange={(event) => onFieldChange("message", event.target.value)}
              placeholder="e.g. The kitchen sink is leaking under the cabinet and the tap drips constantly."
              rows={4}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "job-message-error" : undefined}
              className="rounded-2xl resize-none"
            />
            <FieldError id="job-message-error" message={errors.message} />
          </div>

          {/* Where */}
          <div className="space-y-2">
            <Label htmlFor="job-address" className="font-bold text-sm">
              Address <span className="text-red-600">*</span>
            </Label>
            <Input
              id="job-address"
              value={form.address}
              onChange={(event) => onFieldChange("address", event.target.value)}
              placeholder="Street, number, city"
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "job-address-error" : undefined}
              className="rounded-2xl h-11"
            />
            <FieldError id="job-address-error" message={errors.address} />
          </div>

          {/* How to reach */}
          <div className="space-y-2">
            <Label htmlFor="job-phone" className="font-bold text-sm">
              Phone <span className="text-red-600">*</span>
            </Label>
            <Input
              id="job-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => onFieldChange("phone", event.target.value)}
              placeholder="070 123 456"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "job-phone-error" : undefined}
              className="rounded-2xl h-11"
            />
            <FieldError id="job-phone-error" message={errors.phone} />
          </div>

          {/* When — both required so the worker can plan a real visit */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 min-w-0">
              <Label className="font-bold text-sm">
                Date <span className="text-red-600">*</span>
              </Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 rounded-2xl justify-start gap-2 font-semibold border-border"
                  >
                    <CalendarIcon size={16} className="shrink-0 text-muted-foreground" />
                    <span className="truncate">
                      {form.date ? format(form.date, "d MMM yyyy") : "Pick a date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                  <Calendar
                    mode="single"
                    selected={form.date}
                    onSelect={(date) => {
                      onFieldChange("date", date)
                      setDateOpen(false)
                    }}
                    disabled={{ before: today }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FieldError id="job-date-error" message={errors.date} />
            </div>

            <div className="space-y-2 min-w-0">
              <Label htmlFor="job-time" className="font-bold text-sm">
                Time <span className="text-red-600">*</span>
              </Label>
              <Select value={form.time} onValueChange={(value) => onFieldChange("time", value)}>
                <SelectTrigger
                  id="job-time"
                  aria-invalid={Boolean(errors.time)}
                  className="w-full h-11 rounded-2xl font-semibold border-border"
                >
                  <SelectValue placeholder="Pick a time" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl max-h-64">
                  {BOOKING_TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot} className="font-semibold">
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError id="job-time-error" message={errors.time} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Your phone number and address are shared only with {companyName} so they can reach you
            about this job.
          </p>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20 flex-col-reverse sm:flex-row gap-2 shrink-0">
          {submitError && (
            <p className="text-xs font-semibold text-red-600 sm:mr-auto sm:self-center">
              {submitError}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="rounded-2xl font-bold border-border w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={submitting || alreadyOpen}
            className="rounded-2xl font-bold gap-2 bg-[#1a7a4a] text-white hover:opacity-90 w-full sm:w-auto"
          >
            <Send size={16} />
            {submitting ? "Sending..." : "Send request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
