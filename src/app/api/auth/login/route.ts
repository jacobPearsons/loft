/**
 * Login API Route
 * 
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server'
import * as authService from '@/features/auth/services/authService'
import type { LoginInput } from '@/features/auth/types'
import { rateLimit } from '@/lib/rate-limit'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const { success, remaining } = rateLimit(`login:${ip}`, 5, 60000)
  if (!success) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Try again later.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    )
  }

  try {
    const body = await request.json() as LoginInput
    
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const dbUser = await db.user.findUnique({ where: { email: body.email.toLowerCase() } })
    if (dbUser && !dbUser.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'Please verify your email before logging in. Check your inbox.' },
        { status: 403 }
      )
    }

    const response = await authService.loginUser(body)
    
    if (response.success) {
      return NextResponse.json(response, { status: 200 })
    } else {
      return NextResponse.json(response, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
