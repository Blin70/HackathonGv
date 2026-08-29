import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BookingConfirmationDialogProps {
  open: boolean
  onClose: () => void
  companyName: string
}

export function BookingConfirmationDialog({
  open,
  onClose,
  companyName,
}: BookingConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl p-8 border-0 shadow-2xl">
        <DialogHeader>
          <div className="h-16 w-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-4 mx-auto">
            <CheckCircle2 size={32} className="text-[#1a7a4a]" />
          </div>
          <DialogTitle className="text-2xl font-black mb-2 text-center text-foreground">
            Booking Requested!
          </DialogTitle>
          <DialogDescription className="text-base text-center text-muted-foreground leading-relaxed mt-2">
            Your request for <strong className="text-foreground">{companyName}</strong> has been
            successfully sent. A professional will contact you shortly to confirm details.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={onClose}
            className="rounded-2xl w-full h-12 font-bold bg-[#1a7a4a] text-white hover:opacity-90 transition-all"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
