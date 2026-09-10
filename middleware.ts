import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  const { pathname } = request.nextUrl

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')

  if (isAdminRoute) {
    const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/'

    // Kalau user sudah login dan akses /admin/login, redirect ke /admin (dashboard)
    if (isLoginPage && response.user) {
      const redirectResponse = NextResponse.redirect(new URL('/admin', request.url))
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie)
      })
      return redirectResponse
    }

    // Kalau path dimulai dengan /admin (kecuali /admin/login), cek apakah user punya session Supabase yang valid
    // Kalau tidak ada session valid, redirect ke /admin/login
    if (!isLoginPage && !response.user) {
      const redirectResponse = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie)
      })
      return redirectResponse
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - file assets (e.g. .svg, .png, .jpg, .jpeg, .gif, .webp, .ico)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
