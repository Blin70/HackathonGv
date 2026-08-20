"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, User as UserIcon, MapPin, Phone, RefreshCw, Briefcase, Plus, X, ExternalLink, Image as ImageIcon, CheckCircle2, Star } from "lucide-react"
import Link from "next/link"
import { TYPES, getStoredCompanies, saveWorkerCompany, Company } from "@/lib/data"

const IMAGE_PRESETS = [
  { label: "Carpentry & Woodwork", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop" },
  { label: "Plumbing & Pipes", url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1200&auto=format&fit=crop" },
  { label: "Electrical & Wiring", url: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1200&auto=format&fit=crop" },
  { label: "Painting & Decorating", url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1200&auto=format&fit=crop" },
  { label: "Roofing & Gutters", url: "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=1200&auto=format&fit=crop" },
  { label: "Tiling & Flooring", url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop" },
  { label: "Masonry & Stone", url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop" },
]

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<"client" | "worker">(
    searchParams.get("tab") === "worker" ? "worker" : "client"
  )

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [userRole, setUserRole] = useState<string>("client")
  const [userId, setUserId] = useState<string>("")

  // Client Profile Form State
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")

  // Worker / Company Profile Form State
  const [companyId, setCompanyId] = useState<number>(999)
  const [businessName, setBusinessName] = useState("Oak & Timber Carpentry")
  const [tradeType, setTradeType] = useState("Carpenter")
  const [price, setPrice] = useState("$120")
  const [tagline, setTagline] = useState("Custom built-ins, doors, decking & structural woodwork.")
  const [aboutUs, setAboutUs] = useState("Master craftsmen dedicated to creating beautiful, enduring woodwork. We build custom solutions tailored precisely to your space.")
  const [bannerImage, setBannerImage] = useState("https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop")
  const [availableDays, setAvailableDays] = useState("Monday - Saturday (8am - 6pm)")
  const [services, setServices] = useState<string[]>([
    "Custom Built-ins",
    "Deck Construction",
    "Door Installation",
    "Structural Framing"
  ])
  const [newServiceInput, setNewServiceInput] = useState("")

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push("/auth/login")
          return
        }

        setUserId(user.id)
        setEmail(user.email || "")

        const userMetaRole = user.user_metadata?.role
        if (userMetaRole === "tradesman" || userMetaRole === "worker") {
          setUserRole("tradesman")
          if (!searchParams.get("tab")) {
            setActiveTab("worker")
          }
        }

        // Fetch user profile from Supabase
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profile) {
          if (profile.full_name) {
            const parts = profile.full_name.split(" ")
            setFirstName(parts[0] || "")
            setLastName(parts.slice(1).join(" ") || "")
          }
          if (profile.phone_number) setPhone(profile.phone_number)
          if (profile.address_line_1) setAddress(profile.address_line_1)
          if (profile.city) setCity(profile.city)
          if (profile.postal_code) setPostalCode(profile.postal_code)
        }

        // Load existing worker company profile from localStorage/data if available
        const numericId = Math.abs(user.id.split("-").join("").split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % 10000 + 100
        setCompanyId(numericId)

        const allCompanies = getStoredCompanies()
        const existingWorkerComp = allCompanies.find(c => c.id === numericId || c.name.toLowerCase() === (user.user_metadata?.full_name || "").toLowerCase())

        if (existingWorkerComp) {
          setBusinessName(existingWorkerComp.name)
          setTradeType(existingWorkerComp.type)
          setPrice(existingWorkerComp.price)
          setTagline(existingWorkerComp.desc)
          setAboutUs(existingWorkerComp.aboutUs)
          setBannerImage(existingWorkerComp.image)
          setAvailableDays(existingWorkerComp.availableDays)
          if (existingWorkerComp.services && existingWorkerComp.services.length > 0) {
            setServices(existingWorkerComp.services)
          }
        } else if (user.user_metadata?.firstName) {
          setBusinessName(`${user.user_metadata.firstName}'s Fixer Service`)
        }

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router, supabase, searchParams])

  const handleAddService = () => {
    if (!newServiceInput.trim()) return
    if (!services.includes(newServiceInput.trim())) {
      setServices([...services, newServiceInput.trim()])
    }
    setNewServiceInput("")
  }

  const handleRemoveService = (serviceToRemove: string) => {
    setServices(services.filter((s) => s !== serviceToRemove))
  }

  const handleSaveClientProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const updates = {
        id: userId,
        full_name: `${firstName} ${lastName}`.trim(),
        phone_number: phone,
        address_line_1: address,
        city: city,
        postal_code: postalCode,
        updated_at: new Date().toISOString(),
      }

      await supabase.from("profiles").update(updates).eq("id", userId)
      setMessage({ type: "success", text: "Client profile updated successfully!" })
    } catch (err: any) {
      console.error(err)
      setMessage({ type: "error", text: err.message || "Failed to update profile." })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveWorkerProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const formattedPrice = price.startsWith("$") ? price : `$${price}`
      const updatedCompany: Company = {
        id: companyId,
        name: businessName || "Pro Worker",
        type: tradeType,
        desc: tagline || "Professional repair and fix service.",
        aboutUs: aboutUs || "Dedicated professional providing top quality work.",
        services: services.length > 0 ? services : ["General Repairs"],
        availableDays: availableDays || "Monday - Saturday",
        rating: 4.9,
        reviews: 189,
        price: formattedPrice,
        image: bannerImage,
      }

      saveWorkerCompany(updatedCompany)
      setMessage({ 
        type: "success", 
        text: `Worker profile saved & published live! Click "View Live Public Profile" below to see how it looks to clients.` 
      })
    } catch (err: any) {
      console.error(err)
      setMessage({ type: "error", text: "Failed to publish worker profile." })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-semibold tracking-wider uppercase text-sm">Loading Profile...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 container max-w-5xl mx-auto px-4 py-10 md:py-16">
      
      {/* Header & Role Badges */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Account & Profile Setup</h1>
            <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-bold uppercase tracking-wider px-3 py-1">
              {userRole === "tradesman" ? "Worker / Company Account" : "Client Account"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-base mt-1.5">
            Configure your personal details or build your public worker profile page.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-secondary/50 border border-border/50 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("client")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === "client"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserIcon size={16} /> Personal Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("worker")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === "worker"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase size={16} /> Worker / Company Page Form
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center justify-between gap-3 ${
          message.type === 'success' ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-600 border border-red-500/30'
        }`}>
          <span>{message.text}</span>
          {activeTab === "worker" && message.type === "success" && (
            <Button asChild size="sm" className="bg-[#1a7a4a] text-white font-bold rounded-xl gap-1.5 shadow-sm">
              <Link href={`/book/${companyId}`} target="_blank">
                <ExternalLink size={14} /> View Live Profile
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* TAB 1: CLIENT PERSONAL INFO */}
      {activeTab === "client" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6">
            <Card className="border-border/50 bg-white shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border-4 border-background shadow-lg">
                  <UserIcon className="h-10 w-10" />
                </div>
                <h3 className="font-extrabold text-xl">{firstName || "Client"} {lastName}</h3>
                <p className="text-sm text-muted-foreground mt-1">{email}</p>
                
                <div className="mt-6 pt-6 border-t border-border/50 w-full">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground bg-secondary/50 p-3 rounded-2xl">
                    <MapPin className="h-4 w-4 text-primary" />
                    {city ? `${city}${postalCode ? `, ${postalCode}` : ''}` : 'Location not configured'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-8">
            <Card className="border-border/50 shadow-xl rounded-3xl overflow-hidden bg-white">
              <div className="h-2 bg-primary w-full" />
              <form onSubmit={handleSaveClientProfile}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-black">Personal Contact Information</CardTitle>
                  <CardDescription>
                    Your details are used when placing booking requests with tradespeople.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field>
                        <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-primary"
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-primary"
                          required
                        />
                      </Field>
                    </div>
                  </FieldGroup>

                  <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field>
                        <FieldLabel htmlFor="email">Email Address</FieldLabel>
                        <Input
                          id="email"
                          value={email}
                          disabled
                          className="h-12 rounded-2xl bg-secondary/50 cursor-not-allowed text-muted-foreground"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="h-12 pl-10 rounded-2xl bg-secondary/30 focus-visible:ring-primary"
                          />
                        </div>
                      </Field>
                    </div>
                  </FieldGroup>

                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="address">Street Address</FieldLabel>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main St, Apt 4B"
                        className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-primary"
                      />
                    </Field>
                    
                    <div className="grid grid-cols-2 gap-5 mt-5">
                      <Field>
                        <FieldLabel htmlFor="city">City</FieldLabel>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="New York"
                          className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-primary"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                        <Input
                          id="postalCode"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="10001"
                          className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-primary"
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </CardContent>
                
                <CardFooter className="bg-secondary/10 px-6 py-4 border-t border-border/30 mt-4">
                  <Button 
                    type="submit" 
                    disabled={saving} 
                    className="w-full sm:w-auto sm:ml-auto h-12 px-8 font-bold text-md rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    style={{ background: "#1a7a4a" }}
                  >
                    {saving ? "Saving..." : "Save Personal Info"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: WORKER / COMPANY PUBLIC PROFILE SETUP FORM */}
      {activeTab === "worker" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-border/50 shadow-xl rounded-3xl overflow-hidden bg-white">
              <div className="h-2 bg-[#1a7a4a] w-full" />
              <form onSubmit={handleSaveWorkerProfile}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-black flex items-center gap-2">
                      <Briefcase className="text-[#1a7a4a]" /> Worker & Business Public Profile Form
                    </CardTitle>
                    <Badge className="bg-[#1a7a4a] text-white border-0 text-xs px-3 py-1 font-bold">
                      Public Listing
                    </Badge>
                  </div>
                  <CardDescription className="text-base leading-relaxed mt-1">
                    Fill out all required and optional business information below to generate your public worker page.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">

                  {/* Company Name & Trade Type */}
                  <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field>
                        <FieldLabel htmlFor="businessName" className="font-bold text-foreground">
                          Company / Worker Name <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          id="businessName"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Oak & Timber Carpentry"
                          className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a] font-bold text-foreground"
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="tradeType" className="font-bold text-foreground">
                          Trade Category <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select value={tradeType} onValueChange={setTradeType}>
                          <SelectTrigger className="h-12 rounded-2xl font-bold text-foreground bg-secondary/30 border-border">
                            <SelectValue placeholder="Select trade type" />
                          </SelectTrigger>
                          <SelectContent>
                            {TYPES.filter(t => t !== "All Types").map((t) => (
                              <SelectItem key={t} value={t} className="font-semibold">
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                  </FieldGroup>

                  {/* Hourly Rate & Working Days */}
                  <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field>
                        <FieldLabel htmlFor="price" className="font-bold text-foreground">
                          Starting Rate ($/hr) <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          id="price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
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
                          value={availableDays}
                          onChange={(e) => setAvailableDays(e.target.value)}
                          placeholder="e.g. Monday - Saturday (8am - 6pm)"
                          className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a]"
                        />
                      </Field>
                    </div>
                  </FieldGroup>

                  {/* Short Catchphrase / Summary */}
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="tagline" className="font-bold text-foreground">
                        Short Tagline / Summary <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id="tagline"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. Custom built-ins, doors, decking & structural woodwork."
                        className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a]"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">Appears on your worker card in search results.</p>
                    </Field>
                  </FieldGroup>

                  {/* About Us Description */}
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="aboutUs" className="font-bold text-foreground">
                        About Us / Detailed Description <span className="text-red-500">*</span>
                      </FieldLabel>
                      <textarea
                        id="aboutUs"
                        rows={4}
                        value={aboutUs}
                        onChange={(e) => setAboutUs(e.target.value)}
                        placeholder="Describe your background, years of experience, and dedication to quality craftsmen..."
                        className="w-full p-4 rounded-2xl bg-secondary/30 border border-border focus-visible:ring-2 focus-visible:ring-[#1a7a4a] text-sm leading-relaxed"
                        required
                      />
                    </Field>
                  </FieldGroup>

                  {/* Banner / Cover Photo Preset & Input */}
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="bannerImage" className="font-bold text-foreground flex items-center justify-between">
                        <span>Cover / Banner Image URL</span>
                        <span className="text-xs text-muted-foreground font-normal">Choose preset or paste custom URL</span>
                      </FieldLabel>
                      <div className="relative">
                        <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="bannerImage"
                          value={bannerImage}
                          onChange={(e) => setBannerImage(e.target.value)}
                          placeholder="https://..."
                          className="h-12 pl-10 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a] text-xs font-mono"
                        />
                      </div>

                      {/* Image Presets Selector */}
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Popular Trade Cover Presets:</p>
                        <div className="flex flex-wrap gap-2">
                          {IMAGE_PRESETS.map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setBannerImage(preset.url)}
                              className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all ${
                                bannerImage === preset.url
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

                  {/* Services Offered List (Tag Input) */}
                  <FieldGroup>
                    <Field>
                      <FieldLabel className="font-bold text-foreground">
                        Services Offered <span className="text-red-500">*</span>
                      </FieldLabel>
                      <div className="flex items-center gap-2 mb-3">
                        <Input
                          value={newServiceInput}
                          onChange={(e) => setNewServiceInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddService();
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

                      {/* Service Tags Display */}
                      <div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-2xl bg-secondary/20 border border-border/50 items-center">
                        {services.length === 0 ? (
                          <span className="text-xs text-muted-foreground italic">No services added yet. Type above and click Add.</span>
                        ) : (
                          services.map((s) => (
                            <Badge
                              key={s}
                              className="bg-white text-foreground border border-border/60 shadow-xs px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 group hover:border-red-300"
                            >
                              <CheckCircle2 size={13} className="text-[#1a7a4a]" />
                              <span>{s}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveService(s)}
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
                    <Link href={`/book/${companyId}`} target="_blank">
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

          {/* Right Column: Live Card Preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              <Card className="border border-border/60 bg-white shadow-xl rounded-3xl overflow-hidden p-0">
                <div className="bg-gradient-to-r from-[#1a7a4a] to-[#25c26e] p-4 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Live Card Preview</span>
                  <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[10px]">Real-time</span>
                </div>

                <div className="relative w-full h-44 overflow-hidden">
                  <img
                    src={bannerImage || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop"}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-white text-[#1a7a4a] font-bold text-xs rounded-full px-3 py-1 border-0">
                    {tradeType}
                  </Badge>
                </div>

                <CardContent className="p-5 space-y-3">
                  <h3 className="font-extrabold text-xl leading-snug text-foreground">
                    {businessName || "Your Company Name"}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {tagline || "Your short tagline..."}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="font-bold">4.9</span>
                      <span className="text-muted-foreground">(189 reviews)</span>
                    </div>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Verified</span>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/30 mt-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">Starting rate</span>
                    <span className="text-2xl font-black text-foreground">{price.startsWith("$") ? price : `$${price}`}</span>
                    <span className="text-xs text-muted-foreground">/hr</span>
                  </div>

                  <Button asChild size="sm" className="rounded-xl font-bold bg-[#1a7a4a] text-white">
                    <Link href={`/book/${companyId}`} target="_blank">
                      View Page →
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Quick tip box */}
              <div className="p-5 rounded-3xl bg-secondary/40 border border-border/50 text-xs text-muted-foreground space-y-2">
                <p className="font-bold text-foreground text-sm flex items-center gap-2">
                  💡 How this works
                </p>
                <p className="leading-relaxed">
                  When you save this form, your company is immediately published to the <strong>/book</strong> market directory and generates your dedicated public page at <strong>/book/{companyId}</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
