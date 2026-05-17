import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * PUBLIC ROUTES — everything else is protected and requires a logged-in user.
 *
 * Strings are matched as prefixes, so '/auth' covers '/auth/login',
 * '/auth/signup', '/auth/callback', etc.
 *
 * Add a new entry here to make a route publicly accessible.
 */
const PUBLIC_ROUTES = [
  '/',        // landing page
  '/auth',    // login, signup, callback, error
  '/ai',      // AI Concierge diagnostics
  '/terms-of-service',
  '/privacy-policy'
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  )
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and getClaims().
  // getClaims() validates the JWT signature against the project's published
  // public keys — never use getSession() here as it does not validate.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  // If user is logged in, redirect them away from any signup or login pages to /
  if (user && (request.nextUrl.pathname.startsWith('/auth/login') || request.nextUrl.pathname.startsWith('/auth/signup'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (!user && !isPublicRoute(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: return supabaseResponse as-is. If you create a new response,
  // copy cookies over or users will be randomly logged out.
  return supabaseResponse
}
