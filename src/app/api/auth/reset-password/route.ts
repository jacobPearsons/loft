/**
 * Reset Password API Route
 * 
 * POST /api/auth/reset-password
 */

import { NextRequest, NextResponse } from 'next/server'
import * as authService from '@/features/auth/services/authService'
import type { ResetPasswordInput } from '@/features/auth/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ResetPasswordInput
    
    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const response = await authService.requestPasswordReset(body)
    
    // Always return success to prevent email enumeration
    return NextResponse.json(
      { 
        success: true, 
        message: response.success 
          ? 'If an account exists, you will receive a password reset link'
          : 'Failed to process request'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
