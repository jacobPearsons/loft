/**
 * Logout API Route
 * 
 * POST /api/auth/logout
 */

import { NextRequest, NextResponse } from 'next/server'
import * as authService from '@/features/auth/services/authService'

export async function POST(_request: NextRequest) {
  try {
    const response = await authService.logoutUser()
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
