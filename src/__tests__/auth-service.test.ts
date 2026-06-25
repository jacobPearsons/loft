import {
  validatePassword,
  isPasswordStrongEnough,
  loginUser,
} from '@/features/auth/services/authService'
import type { PasswordRequirements, LoginInput } from '@/features/auth/types'

const mockFindUnique = jest.fn()

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}))

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}))

jest.mock('@/lib/logger', () => ({
  createLogger: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }),
}))

const bcrypt = require('bcryptjs')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('validatePassword', () => {
  it('returns all false for empty password', () => {
    const result = validatePassword('')
    expect(result).toEqual({
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false,
    })
  })

  it('returns minLength true for password >= 8 chars', () => {
    expect(validatePassword('1234567').minLength).toBe(false)
    expect(validatePassword('12345678').minLength).toBe(true)
    expect(validatePassword('123456789').minLength).toBe(true)
  })

  it('detects uppercase letters', () => {
    expect(validatePassword('abc').hasUppercase).toBe(false)
    expect(validatePassword('Abc').hasUppercase).toBe(true)
    expect(validatePassword('ABC').hasUppercase).toBe(true)
  })

  it('detects lowercase letters', () => {
    expect(validatePassword('ABC').hasLowercase).toBe(false)
    expect(validatePassword('Abc').hasLowercase).toBe(true)
  })

  it('detects numbers', () => {
    expect(validatePassword('abc').hasNumber).toBe(false)
    expect(validatePassword('ab1').hasNumber).toBe(true)
  })

  it('detects special characters', () => {
    expect(validatePassword('abc').hasSpecialChar).toBe(false)
    expect(validatePassword('!abc').hasSpecialChar).toBe(true)
    expect(validatePassword('@abc').hasSpecialChar).toBe(true)
    expect(validatePassword('#abc').hasSpecialChar).toBe(true)
  })

  it('returns all true for a strong password', () => {
    const result = validatePassword('StrongP@ss1')
    expect(result).toEqual({
      minLength: true,
      hasUppercase: true,
      hasLowercase: true,
      hasNumber: true,
      hasSpecialChar: true,
    })
  })
})

describe('isPasswordStrongEnough', () => {
  it('returns true when all requirements met', () => {
    const req: PasswordRequirements = {
      minLength: true,
      hasUppercase: true,
      hasLowercase: true,
      hasNumber: true,
      hasSpecialChar: true,
    }
    expect(isPasswordStrongEnough(req)).toBe(true)
  })

  it('returns false when any requirement is false', () => {
    const base: PasswordRequirements = {
      minLength: true,
      hasUppercase: true,
      hasLowercase: true,
      hasNumber: true,
      hasSpecialChar: true,
    }
    const keys: (keyof PasswordRequirements)[] = [
      'minLength', 'hasUppercase', 'hasLowercase', 'hasNumber', 'hasSpecialChar',
    ]
    keys.forEach(key => {
      expect(isPasswordStrongEnough({ ...base, [key]: false })).toBe(false)
    })
  })

  it('returns false when all requirements are false', () => {
    const req: PasswordRequirements = {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false,
    }
    expect(isPasswordStrongEnough(req)).toBe(false)
  })
})

describe('loginUser', () => {
  const validInput: LoginInput = {
    email: 'test@example.com',
    password: 'CorrectP@ss1',
  }

  const mockDbUser = {
    id: 1,
    clerkId: 'clerk_123',
    email: 'test@example.com',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    profileImage: null,
    isEmployer: false,
    isVerified: true,
    tier: 'free',
    credits: '0',
    createdAt: new Date('2024-01-01'),
    hashedPassword: '$2a$12$hashed',
  }

  it('returns error for invalid email format', async () => {
    const result = await loginUser({ email: 'invalid', password: 'pass' })
    expect(result).toEqual({
      success: false,
      message: 'Please enter a valid email address',
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('returns error when user not found', async () => {
    mockFindUnique.mockResolvedValue(null)

    const result = await loginUser(validInput)
    expect(result).toEqual({
      success: false,
      message: 'Invalid email or password',
    })
  })

  it('returns error when user has no hashedPassword', async () => {
    mockFindUnique.mockResolvedValue({ ...mockDbUser, hashedPassword: null })

    const result = await loginUser(validInput)
    expect(result).toEqual({
      success: false,
      message: 'Invalid email or password',
    })
  })

  it('returns error on wrong password', async () => {
    mockFindUnique.mockResolvedValue(mockDbUser)
    bcrypt.compare.mockResolvedValue(false)

    const result = await loginUser(validInput)
    expect(result).toEqual({
      success: false,
      message: 'Invalid email or password',
    })
  })

  it('returns success on valid credentials', async () => {
    mockFindUnique.mockResolvedValue(mockDbUser)
    bcrypt.compare.mockResolvedValue(true)

    const result = await loginUser(validInput)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Login successful')
    expect(result.user).toBeDefined()
    expect(result.user?.email).toBe('test@example.com')
    expect(result.user?.firstName).toBe('Test')
    expect(result.user?.lastName).toBe('User')
    expect(result.token).toMatch(/^session_clerk_123_\d+$/)
  })

  it('looks up user by lowercased email', async () => {
    mockFindUnique.mockResolvedValue(null)
    await loginUser({ email: 'Test@Example.Com', password: 'pass' })
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    })
  })

  it('maps employer role correctly via toAuthUser', async () => {
    const employerUser = {
      ...mockDbUser,
      isEmployer: true,
      firstName: null,
      lastName: null,
      name: null,
    }
    mockFindUnique.mockResolvedValue(employerUser)
    bcrypt.compare.mockResolvedValue(true)

    const result = await loginUser(validInput)
    expect(result.user?.role).toBe('employer')
    expect(result.user?.firstName).toBeUndefined()
    expect(result.user?.lastName).toBeUndefined()
    expect(result.user?.name).toBeUndefined()
  })
})
