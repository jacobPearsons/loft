import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicRoutes = [
  '/',
  '/jobs',
  '/api/jobs',
  '/companies',
  '/about',
  '/contact',
  '/auth',
  '/sign-in',
  '/sign-up',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/reset-password',
  '/api/payment/success',
  '/api/auth/[...nextauth]',
]

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/notifications',
  '/hiring-workflow',
  '/applications',
  '/messages',
  '/employer',
  '/jobs/create',
  '/api/users/notifications',
]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token && isProtectedRoute(pathname)) {
    const loginUrl = new URL('/auth', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!.*\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js)$|_next).*)',
    '/(api|trpc)(/.*)?$',
  ],
}
