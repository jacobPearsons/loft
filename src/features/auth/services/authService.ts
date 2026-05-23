/**
 * Authentication Service
 * 
 * Handles all authentication-related business logic.
 * Follows the docs/backend-architecture-framework.md pattern.
 * 
 * Responsibilities:
 * - User registration
 * - User login
 * - Password reset
 * - Session management
 * - Password validation and hashing
 */

import type { 
  LoginInput, 
  RegisterInput, 
  ResetPasswordInput, 
  UpdatePasswordInput,
  AuthResponse,
  LogoutResponse,
  AuthUser,
  PasswordRequirements
} from '../types'

// Simulated in-memory user store (in production, use database via Prisma)
const users: Map<string, AuthUser & { passwordHash: string }> = new Map()

// Password validation
export function validatePassword(password: string): PasswordRequirements {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }
}

export function isPasswordStrongEnough(requirements: PasswordRequirements): boolean {
  return Object.values(requirements).every(Boolean)
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Simple hash function (in production, use bcrypt)
function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return `hashed_${Math.abs(hash).toString(16)}_${password.length}`
}

// Generate user ID
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Register a new user
export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  // Validate email format
  if (!isValidEmail(input.email)) {
    return {
      success: false,
      message: 'Please enter a valid email address',
    }
  }

  // Check if user already exists
  const existingUser = users.get(input.email.toLowerCase())
  if (existingUser) {
    return {
      success: false,
      message: 'An account with this email already exists',
    }
  }

  // Validate password strength
  const passwordRequirements = validatePassword(input.password)
  if (!isPasswordStrongEnough(passwordRequirements)) {
    return {
      success: false,
      message: 'Password does not meet all requirements',
    }
  }

  // Check password match
  if (input.password !== input.confirmPassword) {
    return {
      success: false,
      message: 'Passwords do not match',
    }
  }

  // Create new user
  const userId = generateUserId()
  const now = new Date()
  
  const newUser: AuthUser & { passwordHash: string } = {
    id: userId,
    clerkId: undefined,
    email: input.email.toLowerCase(),
    firstName: input.firstName,
    lastName: input.lastName,
    name: `${input.firstName} ${input.lastName}`,
    profileImage: undefined,
    role: input.role,
    isVerified: false,
    tier: 'Free',
    credits: '10',
    createdAt: now,
    passwordHash: simpleHash(input.password),
  }

  // Store user
  users.set(input.email.toLowerCase(), newUser)

  // Return user without password
  const { passwordHash, ...userWithoutPassword } = newUser

  return {
    success: true,
    message: 'Registration successful. Please verify your email.',
    user: userWithoutPassword,
  }
}

// Login user
export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  // Validate email format
  if (!isValidEmail(input.email)) {
    return {
      success: false,
      message: 'Please enter a valid email address',
    }
  }

  // Find user
  const user = users.get(input.email.toLowerCase())
  if (!user) {
    return {
      success: false,
      message: 'Invalid email or password',
    }
  }

  // Verify password
  const passwordHash = simpleHash(input.password)
  if (user.passwordHash !== passwordHash) {
    return {
      success: false,
      message: 'Invalid email or password',
    }
  }

  // Return user without password
  const { passwordHash: _, ...userWithoutPassword } = user

  return {
    success: true,
    message: 'Login successful',
    user: userWithoutPassword,
    token: `token_${user.id}_${Date.now()}`,
  }
}

// Logout user
export async function logoutUser(): Promise<LogoutResponse> {
  // In a real app, invalidate the session/token
  return {
    success: true,
    message: 'Logged out successfully',
  }
}

// Request password reset
export async function requestPasswordReset(input: ResetPasswordInput): Promise<AuthResponse> {
  // Validate email format
  if (!isValidEmail(input.email)) {
    return {
      success: false,
      message: 'Please enter a valid email address',
    }
  }

  // Check if user exists
  const user = users.get(input.email.toLowerCase())
  if (!user) {
    // Don't reveal whether user exists
    return {
      success: true,
      message: 'If an account exists, a password reset link has been sent',
    }
  }

  // In production, generate reset token and send email
  // For now, simulate success
  return {
    success: true,
    message: 'If an account exists, a password reset link has been sent',
  }
}

// Update password with reset token
export async function updatePassword(input: UpdatePasswordInput): Promise<AuthResponse> {
  // Validate password strength
  const passwordRequirements = validatePassword(input.newPassword)
  if (!isPasswordStrongEnough(passwordRequirements)) {
    return {
      success: false,
      message: 'Password does not meet all requirements',
    }
  }

  // Check password match
  if (input.newPassword !== input.confirmPassword) {
    return {
      success: false,
      message: 'Passwords do not match',
    }
  }

  // In production, validate token and find user
  // For now, simulate that token is invalid (since we're not generating real tokens)
  return {
    success: false,
    message: 'Invalid or expired reset token',
  }
}

// Get current user (simulated)
export async function getCurrentUser(token?: string): Promise<AuthUser | null> {
  if (!token) return null
  
  // In production, validate token and fetch user from session/database
  return null
}
