"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { ImagePlus, LoaderCircle, MapPin, MessageCircle, RotateCcw, Send, X } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CITIES } from "@/lib/data"
import { MAX_REPAIR_IMAGE_BYTES } from "@/lib/schemas/repair-intake"
import type { RepairChatMessage } from "@/hooks/use-repair-intake"

const EXAMPLE_PROMPTS = [
  "Water is leaking under my kitchen sink",
  "A wall outlet sparked when I plugged something in",
  "I need help repairing a cracked bathroom tile",
]

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

interface RepairConversationProps {
  messages: RepairChatMessage[]
  loading: boolean
  error: string | null
  onSubmit: (input: { message: string; city: string; imageDataUrl?: string }) => Promise<boolean>
  onReset: () => void
}

function fileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result)
      else reject(new Error("We couldn't read that photo. Please choose another one."))
    }
    reader.onerror = () => reject(new Error("We couldn't read that photo. Please choose another one."))
    reader.readAsDataURL(file)
  })
}

export function RepairConversation({ messages, loading, error, onSubmit, onReset }: RepairConversationProps) {
  const [message, setMessage] = useState("")
  const [city, setCity] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  const clearImage = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    previewUrlRef.current = null
    setPreviewUrl(null)
    setImage(null)
    if (imageInputRef.current) imageInputRef.current.value = ""
  }

  const chooseImage = (file: File | undefined) => {
    setImageError(null)
    if (!file) return

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Choose a JPEG, PNG, or WebP photo.")
      return
    }
    if (file.size > MAX_REPAIR_IMAGE_BYTES) {
      setImageError("Photos must be 3 MB or smaller.")
      return
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const nextPreviewUrl = URL.createObjectURL(file)
    previewUrlRef.current = nextPreviewUrl
    setPreviewUrl(nextPreviewUrl)
    setImage(file)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    if (!city) {
      setFormError("Choose the city where the repair is needed.")
      return
    }
    if (!message.trim() && !image) {
      setFormError("Describe the repair or attach a photo.")
      return
    }

    try {
      const imageDataUrl = image ? await fileAsDataUrl(image) : undefined
      const submitted = await onSubmit({ message, city, imageDataUrl })
      if (submitted) {
        setMessage("")
        clearImage()
        setImageError(null)
      }
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "We couldn't read that photo.")
    }
  }

  const handleReset = () => {
    onReset()
    setMessage("")
    clearImage()
    setImageError(null)
    setFormError(null)
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-border/70 bg-white shadow-lg shadow-slate-900/5">
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/60 px-5 py-5 sm:px-7">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg font-bold sm:text-xl">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle className="size-4" />
            </span>
            Describe the repair
          </CardTitle>
          <p className="pl-11 text-sm text-muted-foreground">A photo is optional. A few details are enough to start.</p>
        </div>
        {messages.length > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="shrink-0 gap-1.5 rounded-xl text-xs">
            <RotateCcw className="size-3.5" /> New repair
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-5 p-5 sm:p-7">
        {messages.length > 0 ? (
          <div className="max-h-72 space-y-4 overflow-y-auto rounded-2xl bg-muted/35 p-4 sm:p-5" aria-live="polite" aria-label="Repair conversation">
            {messages.map((item) => (
              <div key={item.id} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${item.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border border-border/70 bg-white text-foreground"}`}>
                  <p className="whitespace-pre-wrap break-words">{item.text}</p>
                  {item.hasImage && (
                    <p className={`mt-2 flex items-center gap-1.5 text-xs ${item.role === "user" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      <ImagePlus className="size-3.5" /> Photo attached
                    </p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin text-primary" /> Reviewing the repair details…
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 sm:p-6">
            <p className="text-sm font-semibold text-foreground">Not sure what to write?</p>
            <p className="mt-1 text-sm text-muted-foreground">Try one of these, then add details that matter.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <Button key={prompt} type="button" variant="outline" size="sm" onClick={() => setMessage(prompt)} className="h-auto whitespace-normal rounded-full bg-white px-3 py-2 text-left text-xs leading-snug">
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2 sm:max-w-xs">
            <Label htmlFor="repair-city" className="text-sm font-semibold">Where is the repair?</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger id="repair-city" className="h-11 rounded-xl bg-white" aria-label="Choose city">
                <MapPin className="mr-1 size-4 text-muted-foreground" />
                <SelectValue placeholder="Choose a city" />
              </SelectTrigger>
              <SelectContent className="max-h-72 rounded-xl">
                {CITIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="repair-description" className="sr-only">Describe the repair</Label>
            <Textarea
              id="repair-description"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="What happened? When did you notice it? Is anything still leaking, sparking, or making noise?"
              maxLength={2000}
              rows={4}
              disabled={loading}
              className="min-h-28 resize-y rounded-2xl border-border/80 bg-white px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/80 focus-visible:ring-primary/25"
            />
            <div className="flex justify-end text-xs text-muted-foreground">{message.length}/2000</div>
          </div>

          {image && previewUrl && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-2.5">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={previewUrl} alt="Selected repair photo" fill unoptimized sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{image.name}</p>
                <p className="text-xs text-muted-foreground">{(image.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={clearImage} aria-label="Remove photo" className="size-9 shrink-0 rounded-full">
                <X className="size-4" />
              </Button>
            </div>
          )}

          {(formError || imageError || error) && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertDescription>{formError || imageError || error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                aria-label="Attach a repair photo"
                onChange={(event) => {
                  chooseImage(event.target.files?.[0])
                  event.currentTarget.value = ""
                }}
              />
              <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={loading} className="w-full gap-2 rounded-xl sm:w-auto">
                <ImagePlus className="size-4" /> Add a photo
              </Button>
              <Button type="submit" disabled={loading || (!message.trim() && !image)} className="w-full gap-2 rounded-xl bg-primary font-semibold text-primary-foreground sm:w-auto">
                {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
                {loading ? "Reviewing…" : "Get repair guidance"}
              </Button>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Your repair description, selected city, and optional photo are sent to OpenAI for analysis. Photos aren&apos;t saved to your Book A Fixer account. Avoid including faces, documents, or sensitive details. See our{" "}
            <Link href="/privacy-policy" className="font-medium text-primary underline underline-offset-2">privacy policy</Link>.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
