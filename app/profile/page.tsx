"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Save, User as UserIcon, MapPin, Phone, RefreshCw } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  // Profile Form State
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push("/auth/login")
          return
        }

        setEmail(user.email || "")

        // Fetch profile data
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error)
        }

        if (profile) {
          // Parse full_name if available, or use existing profile fields if they exist
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
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router, supabase])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("No user logged in")
      }

      const updates = {
        id: user.id,
        full_name: `${firstName} ${lastName}`.trim(),
        phone_number: phone,
        address_line_1: address,
        city: city,
        postal_code: postalCode,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)

      if (error) {
        throw error
      }

      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (err: any) {
      console.error(err)
      setMessage({ type: "error", text: err.message || "Failed to update profile." })
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
    <div className="flex-1 container max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">My Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your personal information and booking details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Info */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-border/50 bg-secondary/20 shadow-lg">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border-4 border-background shadow-xl">
                <UserIcon className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-xl">{firstName} {lastName}</h3>
              <p className="text-sm text-muted-foreground mt-1">{email}</p>
              
              <div className="mt-6 pt-6 border-t border-border/50 w-full">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-3 rounded-xl">
                  <MapPin className="h-4 w-4 text-primary" />
                  {city ? `${city}${postalCode ? `, ${postalCode}` : ''}` : 'Location not set'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-8">
          <Card className="border-border/50 shadow-xl overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            <form onSubmit={handleSaveProfile}>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Contact & Address Info</CardTitle>
                <CardDescription>
                  This information will be securely shared with tradesmen when you book a service.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {message && (
                  <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${
                    message.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  }`}>
                    {message.text}
                  </div>
                )}

                <FieldGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field>
                      <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="h-12 bg-secondary/30 focus-visible:ring-primary"
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
                        className="h-12 bg-secondary/30 focus-visible:ring-primary"
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
                        className="h-12 bg-secondary/50 cursor-not-allowed text-muted-foreground"
                      />
                      <p className="text-[11px] text-muted-foreground mt-1.5 ml-1">Email is tied to your login credentials.</p>
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
                          className="h-12 pl-10 bg-secondary/30 focus-visible:ring-primary"
                          required
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
                      className="h-12 bg-secondary/30 focus-visible:ring-primary"
                      required
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
                        className="h-12 bg-secondary/30 focus-visible:ring-primary"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                      <Input
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="10001"
                        className="h-12 bg-secondary/30 focus-visible:ring-primary"
                        required
                      />
                    </Field>
                  </div>
                </FieldGroup>
              </CardContent>
              
              <CardFooter className="bg-secondary/10 px-6 py-4 border-t border-border/30 mt-4">
                <Button 
                  type="submit" 
                  disabled={saving} 
                  className="w-full sm:w-auto sm:ml-auto h-12 px-8 font-bold text-md rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                  {saving ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</>
                  ) : (
                    <><Save className="mr-2 h-5 w-5" /> Save Profile</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
