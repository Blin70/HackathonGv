"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, CameraOff, LoaderCircle, SwitchCamera } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CameraCaptureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCapture: (photo: Blob) => void
  /** Called when the camera can't be used, so the caller can offer an upload instead. */
  onUnavailable: () => void
}

type FacingMode = "environment" | "user"

function cameraErrorMessage(error: unknown): string {
  const name = error instanceof DOMException ? error.name : ""
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Camera access was blocked. Allow the camera in your browser settings, or upload a photo instead."
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "We couldn't find a camera on this device. Upload a photo instead."
  }
  if (name === "NotReadableError") {
    return "Your camera is being used by another app. Close it and try again, or upload a photo instead."
  }
  return "We couldn't start the camera. Upload a photo instead."
}

/** Mounted only while the dialog is open, so each opening starts from a clean state. */
function CameraViewfinder({ onCapture, onUnavailable }: Pick<CameraCaptureDialogProps, "onCapture" | "onUnavailable">) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [facingMode, setFacingMode] = useState<FacingMode>("environment")
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [capturing, setCapturing] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    let cancelled = false

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      .then(async (mediaStream) => {
        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop())
          return
        }
        stream = mediaStream
        const video = videoRef.current
        if (!video) return
        video.srcObject = mediaStream
        await video.play()
        if (!cancelled) setReady(true)
      })
      .catch((caught: unknown) => {
        if (!cancelled) setError(cameraErrorMessage(caught))
      })

    return () => {
      cancelled = true
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [facingMode])

  const switchCamera = () => {
    setReady(false)
    setFacingMode((current) => (current === "environment" ? "user" : "environment"))
  }

  const capture = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    setCapturing(true)

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      (blob) => {
        setCapturing(false)
        if (blob) onCapture(blob)
        else setError("We couldn't capture that photo. Please try again.")
      },
      "image/jpeg",
      0.92
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <CameraOff className="size-5" />
        </span>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{error}</p>
        <Button type="button" variant="outline" className="rounded-xl" onClick={onUnavailable}>
          Upload a photo instead
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`size-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
          aria-label="Camera preview"
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-white/80">
            <LoaderCircle className="size-4 animate-spin" /> Starting camera…
          </div>
        )}
      </div>

      <DialogFooter className="flex-row gap-2 sm:justify-between">
        <Button type="button" variant="outline" onClick={switchCamera} disabled={!ready} className="gap-2 rounded-xl">
          <SwitchCamera className="size-4" /> <span className="hidden sm:inline">Switch camera</span>
        </Button>
        <Button type="button" onClick={capture} disabled={!ready || capturing} className="flex-1 gap-2 rounded-xl sm:flex-none">
          {capturing ? <LoaderCircle className="size-4 animate-spin" /> : <Camera className="size-4" />}
          Take photo
        </Button>
      </DialogFooter>
    </div>
  )
}

export function CameraCaptureDialog({ open, onOpenChange, onCapture, onUnavailable }: CameraCaptureDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Take a photo of the problem</DialogTitle>
          <DialogDescription>
            Get close enough to show the damage clearly — the leak, crack, or fitting — in good light.
          </DialogDescription>
        </DialogHeader>
        {open && <CameraViewfinder onCapture={onCapture} onUnavailable={onUnavailable} />}
      </DialogContent>
    </Dialog>
  )
}
