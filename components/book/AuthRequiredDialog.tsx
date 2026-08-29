import Link from "next/link"
import { Lock, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AuthRequiredDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyName: string
}

export function AuthRequiredDialog({ open, onOpenChange, companyName }: AuthRequiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-8 border-0 shadow-2xl">
        <DialogHeader>
          <div className="h-16 w-16 bg-amber-100 text-amber-600 flex items-center justify-center rounded-full mb-4 mx-auto">
            <Lock size={32} className="text-amber-600" />
          </div>
          <DialogTitle className="text-2xl font-black mb-2 text-center text-foreground">
            Sign In Required
          </DialogTitle>
          <DialogDescription className="text-base text-center text-muted-foreground leading-relaxed mt-2">
            You are currently browsing as a guest. To book{" "}
            <strong className="text-foreground">{companyName}</strong> or submit ratings &amp;
            reviews, please sign in as a client.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            asChild
            className="rounded-2xl w-full h-12 font-bold bg-[#1a7a4a] text-white hover:opacity-90 transition-all gap-2"
          >
            <Link href="/auth/signup">
              <UserPlus size={18} />
              Sign In / Register as Client
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-2xl w-full h-12 font-bold border-border transition-all"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
