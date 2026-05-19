/**
 * Login API Route
 * 
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server'
import * as authService from '@/features/auth/services/authService'
import type { LoginInput } from '@/features/auth/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LoginInput
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
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
