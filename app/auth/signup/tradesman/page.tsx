'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, MapPin, Phone, ShieldCheck, User } from 'lucide-react'

import { createClient } from '@/lib/client'
import { CITIES } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type AccountType = 'individual' | 'company'

const OTHER_CITY = 'Other'

export default function TradesmanSignupPage() {
  const [accountType, setAccountType] = useState<AccountType>('individual')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [cityOther, setCityOther] = useState('')
  const [showRegistration, setShowRegistration] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const isCompany = accountType === 'company'
  const resolvedCity = (city === OTHER_CITY ? cityOther : city).trim()
  const isRegistered = registrationNumber.trim().length > 0

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (isCompany && !businessName.trim()) {
      setError('Please enter your company / business name.')
      return
    }
    if (!resolvedCity) {
      setError('Please select or enter your city / service area.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const fullName = `${firstName} ${lastName}`.trim()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'tradesman',
          accountType,
          firstName,
          lastName,
          full_name: fullName,
          businessName: isCompany ? businessName.trim() : '',
          // Public-facing name: the business for companies, the person otherwise.
          displayName: isCompany ? businessName.trim() : fullName,
          phone: phone.trim(),
          city: resolvedCity,
          // Kept private — only used to render a "Registered Business" badge.
          registrationNumber: registrationNumber.trim(),
          isRegistered,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your{' '}
              {isCompany ? 'company' : 'tradesman'} account and start receiving job requests.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Card className="w-full max-w-2xl gap-4 py-5">
        <CardHeader>
          <CardTitle>Register as Worker or Company</CardTitle>
          <CardDescription>
            List your services as an individual fixer or a registered company.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignup}>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              {/* Account type */}
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="accountType">I&apos;m registering as</FieldLabel>
                <div
                  id="accountType"
                  className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-secondary/50 border border-border/50"
                >
                  <button
                    type="button"
                    onClick={() => setAccountType('individual')}
                    aria-pressed={!isCompany}
                    className={cn(
                      'flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all',
                      !isCompany
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <User size={16} /> Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('company')}
                    aria-pressed={isCompany}
                    className={cn(
                      'flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all',
                      isCompany
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Building2 size={16} /> Company
                  </button>
                </div>
              </Field>

              {/* Contact person */}
              <Field>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </Field>

              {/* Company name (companies only) */}
              {isCompany && (
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="businessName">Company / Business Name</FieldLabel>
                  <Input
                    id="businessName"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Oak & Timber Carpentry"
                    required
                  />
                </Field>
              )}

              {/* Email & phone */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+389 70 123 456"
                    className="pl-9"
                    required
                  />
                </div>
              </Field>

              {/* City & password */}
              <Field>
                <FieldLabel htmlFor="city" className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" /> City / Service Area
                </FieldLabel>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger id="city" className="w-full">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                    <SelectItem value={OTHER_CITY}>Other / Not listed</SelectItem>
                  </SelectContent>
                </Select>
                {city === OTHER_CITY && (
                  <Input
                    aria-label="Enter your city"
                    value={cityOther}
                    onChange={(e) => setCityOther(e.target.value)}
                    placeholder="Enter your city or area"
                    className="mt-2"
                  />
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </Field>

              {/* Optional verification — collapsed by default (opt-in) */}
              <div className="sm:col-span-2">
                {!showRegistration ? (
                  <button
                    type="button"
                    onClick={() => setShowRegistration(true)}
                    className="flex w-full items-center gap-2 rounded-xl border border-dashed border-border bg-secondary/20 px-3.5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Registered business? Add your reg. number for a verified badge
                    <span className="ml-auto text-xs font-normal">Optional</span>
                  </button>
                ) : (
                  <Field>
                    <FieldLabel htmlFor="registrationNumber" className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Registration № (ЕМБС / ЕДБ)
                    </FieldLabel>
                    <Input
                      id="registrationNumber"
                      type="text"
                      inputMode="numeric"
                      autoFocus
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="e.g. 7654321"
                    />
                    <FieldDescription>
                      Optional — earns a verified <strong>Registered Business</strong> badge. Kept
                      private, never shown publicly.
                    </FieldDescription>
                    {isRegistered && (
                      <div className="mt-1 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-bold text-primary">
                        <ShieldCheck size={14} />
                        You&apos;ll receive a verified “Registered Business” badge.
                      </div>
                    )}
                  </Field>
                )}
              </div>

              {error && <FieldError className="sm:col-span-2">{error}</FieldError>}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3 mt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login?role=tradesman" className="underline underline-offset-4 hover:text-primary font-semibold">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
