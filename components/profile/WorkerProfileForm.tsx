"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TYPES } from "@/lib/data"
import { IMAGE_PRESETS, type WorkerProfileForm as WorkerProfileFormModel } from "@/lib/profile"

interface WorkerProfileFormProps {
  form: WorkerProfileFormModel
  onChange: <K extends keyof WorkerProfileFormModel>(key: K, value: WorkerProfileFormModel[K]) => void
  onAddService: (value: string) => void
  onRemoveService: (value: string) => void
  saving: boolean
  workerId: string
  onSubmit: () => void
}

export function WorkerProfileForm({
  form,
  onChange,
  onAddService,
  onRemoveService,
  saving,
  workerId,
  onSubmit,
}: WorkerProfileFormProps) {
  const [newService, setNewService] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  const handleAddService = () => {
    onAddService(newService)
    setNewService("")
  }

  return (
    <div className="lg:col-span-8 space-y-8">
      <Card className="border-border/50 shadow-xl rounded-3xl overflow-hidden bg-white">
        <div className="h-2 bg-[#1a7a4a] w-full" />
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                <Briefcase className="text-[#1a7a4a]" /> Worker &amp; Business Public Profile Form
              </CardTitle>
              <Badge className="bg-[#1a7a4a] text-white border-0 text-xs px-3 py-1 font-bold">
                Public Listing
              </Badge>
            </div>
            <CardDescription className="text-base leading-relaxed mt-1">
              Fill out all required and optional business information below to generate your public
              worker page.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Company name & trade type */}
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field>
                  <FieldLabel htmlFor="businessName" className="font-bold text-foreground">
                    Company / Worker Name <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="businessName"
                    value={form.businessName}
                    onChange={(e) => onChange("businessName", e.target.value)}
                    placeholder="e.g. Oak & Timber Carpentry"
                    className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a] font-bold text-foreground"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="tradeType" className="font-bold text-foreground">
                    Trade Category <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select value={form.tradeType} onValueChange={(value) => onChange("tradeType", value)}>
                    <SelectTrigger className="h-12 rounded-2xl font-bold text-foreground bg-secondary/30 border-border">
                      <SelectValue placeholder="Select trade type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.filter((type) => type !== "All Types").map((type) => (
                        <SelectItem key={type} value={type} className="font-semibold">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>

            {/* Hourly rate & working days */}
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field>
                  <FieldLabel htmlFor="price" className="font-bold text-foreground">
                    Starting Rate ($/hr) <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="price"
                    value={form.price}
                    onChange={(e) => onChange("price", e.target.value)}
                    placeholder="e.g. $120"
                    className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a] font-extrabold text-foreground"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="availableDays" className="font-bold text-foreground">
                    Availability / Schedule
                  </FieldLabel>
                  <Input
                    id="availableDays"
                    value={form.availableDays}
                    onChange={(e) => onChange("availableDays", e.target.value)}
                    placeholder="e.g. Monday - Saturday (8am - 6pm)"
                    className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a]"
                  />
                </Field>
              </div>
            </FieldGroup>

            {/* Short tagline */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="tagline" className="font-bold text-foreground">
                  Short Tagline / Summary <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="tagline"
                  value={form.tagline}
                  onChange={(e) => onChange("tagline", e.target.value)}
                  placeholder="e.g. Custom built-ins, doors, decking & structural woodwork."
                  className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a]"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Appears on your worker card in search results.
                </p>
              </Field>
            </FieldGroup>

            {/* About us */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="aboutUs" className="font-bold text-foreground">
                  About Us / Detailed Description <span className="text-red-500">*</span>
                </FieldLabel>
                <Textarea
                  id="aboutUs"
                  rows={4}
                  value={form.aboutUs}
                  onChange={(e) => onChange("aboutUs", e.target.value)}
                  placeholder="Describe your background, years of experience, and dedication to quality craftsmen..."
                  className="p-4 rounded-2xl bg-secondary/30 border border-border focus-visible:ring-2 focus-visible:ring-[#1a7a4a] text-sm leading-relaxed"
                  required
                />
              </Field>
            </FieldGroup>

            {/* Banner image preset & input */}
            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="bannerImage"
                  className="font-bold text-foreground flex items-center justify-between"
                >
                  <span>Cover / Banner Image URL</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Choose preset or paste custom URL
                  </span>
                </FieldLabel>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bannerImage"
                    value={form.bannerImage}
                    onChange={(e) => onChange("bannerImage", e.target.value)}
                    placeholder="https://..."
                    className="h-12 pl-10 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a] text-xs font-mono"
                  />
                </div>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    Popular Trade Cover Presets:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => onChange("bannerImage", preset.url)}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all ${
                          form.bannerImage === preset.url
                            ? "bg-[#1a7a4a] text-white border-[#1a7a4a] shadow-xs"
                            : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80 border-border"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Field>
            </FieldGroup>

            {/* Services offered (tag input) */}
            <FieldGroup>
              <Field>
                <FieldLabel className="font-bold text-foreground">
                  Services Offered <span className="text-red-500">*</span>
                </FieldLabel>
                <div className="flex items-center gap-2 mb-3">
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddService()
                      }
                    }}
                    placeholder="Add a service (e.g. Custom Built-ins)..."
                    className="h-11 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a]"
                  />
                  <Button
                    type="button"
                    onClick={handleAddService}
                    className="h-11 px-5 rounded-2xl font-bold bg-[#1a7a4a] text-white hover:opacity-90 shrink-0"
                  >
                    <Plus size={16} className="mr-1" /> Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-2xl bg-secondary/20 border border-border/50 items-center">
                  {form.services.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">
                      No services added yet. Type above and click Add.
                    </span>
                  ) : (
                    form.services.map((service) => (
                      <Badge
                        key={service}
                        className="bg-white text-foreground border border-border/60 shadow-xs px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 group hover:border-red-300"
                      >
                        <CheckCircle2 size={13} className="text-[#1a7a4a]" />
                        <span>{service}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveService(service)}
                          className="text-muted-foreground hover:text-red-600 transition-colors ml-1"
                        >
                          <X size={13} />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="bg-secondary/10 px-6 py-5 border-t border-border/30 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-12 rounded-2xl font-bold border-border gap-2"
            >
              <Link href={`/book/${workerId}`} target="_blank">
                <ExternalLink size={16} />
                Preview Live Page
              </Link>
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto h-12 px-8 font-black text-base rounded-2xl shadow-xl shadow-green-900/20 hover:scale-105 transition-transform"
              style={{ background: "#1a7a4a", color: "#ffffff" }}
            >
              {saving ? "Publishing Profile..." : "Save & Publish Worker Profile"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
