import { createBrowserClient } from '@supabase/ssr'

/**
 * One browser client per tab.
 *
 * Every call used to build a fresh client, and a page mounts several: the
 * header, the footer and the page's own data hook each ask for one. Each
 * client runs its own auth instance, and they contend for the same lock when
 * they call `auth.getUser()` at the same moment — which showed up as the
 * dashboard and bookings pages stuck on their spinners, with no request to
 * Supabase ever being made. Sharing one instance removes the contention.
 *
 * Module scope is per-tab in the browser, which is the right lifetime. Server
 * code must use `createClient` from `lib/server.ts`, which deliberately builds
 * a new client per request.
 */
function makeBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

// Derived from the local factory, not from `createBrowserClient` itself:
// that one is generic, so `ReturnType` of it widens the client's callbacks
// to `any` and silently drops type-checking at every call site.
let browserClient: ReturnType<typeof makeBrowserClient> | null = null

export function createClient() {
  browserClient ??= makeBrowserClient()
  return browserClient
}
