'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field'
import { Briefcase, User } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')
  const isWorker = roleParam === 'tradesman' || roleParam === 'worker'
  const isClient = roleParam === 'client'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-xl border-border/50">
      <CardHeader>
        {isWorker ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary w-fit mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Worker / Company Portal</span>
          </div>
        ) : isClient ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary w-fit mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Client Portal</span>
          </div>
        ) : null}
        <CardTitle className="text-2xl font-black">Sign in</CardTitle>
        <CardDescription>
          {isWorker
            ? 'Enter your credentials to access your worker dashboard'
            : isClient
            ? 'Enter your client email and password to continue'
            : 'Enter your email and password to continue'}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent>
          <FieldGroup>
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
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </Field>

            {error && <FieldError>{error}</FieldError>}
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col gap-4 mt-4">
          <Button type="submit" className="w-full h-11 font-bold rounded-xl" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>

          <div className="w-full pt-3 border-t border-border/40 text-center space-y-2.5">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Don&apos;t have an account?
            </p>

            {isWorker ? (
              <div className="flex flex-col gap-2 items-center">
                <Link
                  href="/auth/signup/tradesman"
                  className="w-full py-2.5 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Register as Worker or Company</span>
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
                >
                  Looking for client account? <span className="underline underline-offset-2 font-semibold">Sign up as Client</span>
                </Link>
              </div>
            ) : isClient ? (
              <div className="flex flex-col gap-2 items-center">
                <Link
                  href="/auth/signup"
                  className="w-full py-2.5 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Sign up as Client</span>
                </Link>
                <Link
                  href="/auth/signup/tradesman"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
                >
                  Are you a tradesman? <span className="underline underline-offset-2 font-semibold">Register as Worker</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                <Link
                  href="/auth/signup"
                  className="py-2.5 px-2.5 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-primary/5 text-foreground font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>Client Sign Up</span>
                </Link>
                <Link
                  href="/auth/signup/tradesman"
                  className="py-2.5 px-2.5 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-primary/5 text-foreground font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>Worker Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center py-6">
      <Suspense fallback={<div className="w-full max-w-sm h-80 animate-pulse bg-muted rounded-2xl" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
