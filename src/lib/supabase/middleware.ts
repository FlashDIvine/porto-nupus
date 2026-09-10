import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { User, SupabaseClient } from '@supabase/supabase-js'

export type UpdateSessionResult = NextResponse & {
  response: NextResponse
  supabaseResponse: NextResponse
  user: User | null
  supabase: SupabaseClient | null
}

export async function updateSession(request: NextRequest): Promise<UpdateSessionResult> {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return Object.assign(supabaseResponse, {
      response: supabaseResponse,
      supabaseResponse,
      user: null,
      supabase: null,
    })
  }

  let user: User | null = null
  let supabase: SupabaseClient | null = null

  try {
    supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            const prevCookies = supabaseResponse.cookies.getAll()
            supabaseResponse = NextResponse.next({
              request,
            })
            prevCookies.forEach((cookie) => supabaseResponse.cookies.set(cookie))
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: DO NOT REMOVE auth.getUser()

    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser()

    user = fetchedUser
  } catch (error) {
    console.error('Error in Supabase updateSession:', error)
  }

  return Object.assign(supabaseResponse, {
    response: supabaseResponse,
    supabaseResponse,
    user,
    supabase,
  })
}
