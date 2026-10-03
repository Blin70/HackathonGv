"use client"

import { useState } from "react"
import { TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MIN_REASON = 10

interface CancelJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientName: string
  busy: boolean
  onConfirm: (reason: string) => void
}

/**
 * Asks a worker why they're dropping a job they already accepted.
 *
 * The reason is required (and enforced by a DB constraint) because a cancelled
 * job costs the client a booking they were relying on — recording who walked
 * away and why is what makes the rate on a worker's profile meaningful.
 */
export function CancelJobDialog({
  open,
  onOpenChange,
  clientName,
  busy,
  onConfirm,
}: CancelJobDialogProps) {
  const [reason, setReason] = useState("")
  const [touched, setTouched] = useState(false)

  const tooShort = reason.trim().length < MIN_REASON
  const error = touched && tooShort ? `Give at least ${MIN_REASON} characters.` : null

  const handleConfirm = () => {
    setTouched(true)
    if (tooShort) return
    onConfirm(reason.trim())
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setReason("")
          setTouched(false)
        }
      }}
    >
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader className="text-left">
          <div className="h-11 w-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
            <TriangleAlert size={20} />
          </div>
          <DialogTitle className="text-lg font-black">Cancel this job?</DialogTitle>
          <DialogDescription className="text-sm">
            {clientName} is expecting you. They&apos;ll see the reason you give. We keep a record of
            cancellations to help build a reliable marketplace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="cancel-reason" className="font-bold text-sm">
            Why are you cancelling? <span className="text-red-600">*</span>
          </Label>
          <Textarea
            id="cancel-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g. The part needed is out of stock until next month."
            rows={3}
            aria-invalid={Boolean(error)}
            className="rounded-2xl resize-none"
          />
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={busy}
            className="rounded-2xl font-bold border-border w-full sm:w-auto"
          >
            Keep the job
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={busy}
            className="rounded-2xl font-bold w-full sm:w-auto"
          >
            {busy ? "Cancelling..." : "Cancel job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
