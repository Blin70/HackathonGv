"use client"

import { MapPin, Phone, User as UserIcon } from "lucide-react"

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
import type { ClientProfileForm as ClientProfileFormModel } from "@/lib/profile"

interface ClientProfileFormProps {
  form: ClientProfileFormModel
  onChange: <K extends keyof ClientProfileFormModel>(key: K, value: ClientProfileFormModel[K]) => void
  saving: boolean
  onSubmit: () => void
}

export function ClientProfileForm({ form, onChange, saving, onSubmit }: ClientProfileFormProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  const location = form.city
    ? `${form.city}${form.postalCode ? `, ${form.postalCode}` : ""}`
    : "Location not configured"

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Summary card */}
      <div className="md:col-span-4 space-y-6">
        <Card className="border-border/50 bg-white shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border-4 border-background shadow-lg">
              <UserIcon className="h-10 w-10" />
            </div>
            <h3 className="font-extrabold text-xl">
              {form.firstName || "Client"} {form.lastName}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{form.email}</p>

            <div className="mt-6 pt-6 border-t border-border/50 w-full">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground bg-secondary/50 p-3 rounded-2xl">
                <MapPin className="h-4 w-4 text-primary" />
                {location}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact form */}
      <div className="md:col-span-8">
        <Card className="border-border/50 shadow-xl rounded-3xl overflow-hidden bg-white">
          <div className="h-2 bg-primary w-full" />
          <form onSubmit={handleSubmit}>
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
                      value={form.firstName}
                      onChange={(e) => onChange("firstName", e.target.value)}
                      placeholder="John"
                      className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-primary"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => onChange("lastName", e.target.value)}
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
                      value={form.email}
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
                        value={form.phone}
                        onChange={(e) => onChange("phone", e.target.value)}
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
                    value={form.address}
                    onChange={(e) => onChange("address", e.target.value)}
                    placeholder="123 Main St, Apt 4B"
                    className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-primary"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-5 mt-5">
                  <Field>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => onChange("city", e.target.value)}
                      placeholder="New York"
                      className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-primary"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                    <Input
                      id="postalCode"
                      value={form.postalCode}
                      onChange={(e) => onChange("postalCode", e.target.value)}
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
  )
}
