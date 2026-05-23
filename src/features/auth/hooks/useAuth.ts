'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut as nextAuthSignOut, getSession } from 'next-auth/react'
import type { 
  AuthUser, 
  AuthState, 
  LoginInput, 
  RegisterInput, 
  ResetPasswordInput,
  AuthStatus 
} from '../types'
import * as authService from '../services/authService'

const AUTH_STORAGE_KEY = 'Loft Community_auth'
const AUTH_TOKEN_KEY = 'Loft Community_token'

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
}

function sessionToAuthUser(session: any): AuthUser | null {
  if (!session?.user?.email) return null
  const nameParts = (session.user.name || '').split(' ')
  return {
    id: session.user.id,
    email: session.user.email,
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    name: session.user.name || session.user.email,
    profileImage: session.user.image || undefined,
    role: session.user.isEmployer ? 'employer' : 'job_seeker',
    isVerified: true,
    tier: 'Free',
    credits: '10',
    createdAt: new Date(),
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(initialState)
  const nextAuthSession = useSession()
  const router = useRouter()

  useEffect(() => {
    if (nextAuthSession.status === 'loading') return

    if (nextAuthSession.status === 'authenticated' && nextAuthSession.data?.user) {
      const authUser = sessionToAuthUser(nextAuthSession.data)
      if (authUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
        localStorage.setItem(AUTH_TOKEN_KEY, `session_${authUser.id}`)
        setState({ user: authUser, status: 'authenticated', error: null })
        return
      }
    }

    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)

    if (storedAuth && storedToken) {
      try {
        const user = JSON.parse(storedAuth) as AuthUser
        setState({ user, status: 'authenticated', error: null })
      } catch {
        setState({ user: null, status: 'unauthenticated', error: null })
      }
    } else {
      setState({ user: null, status: 'unauthenticated', error: null })
    }
  }, [nextAuthSession.status, nextAuthSession.data])

  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, error: null }))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state.error])

  const login = useCallback(async (input: LoginInput) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }))

    try {
      const response = await authService.loginUser(input)
      
      if (response.success && response.user) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.token || '')
        setState({
          user: response.user,
          status: 'authenticated',
          error: null,
        })
        return { success: true }
      } else {
        setState(prev => ({
          ...prev,
          status: 'unauthenticated',
          error: response.message,
        }))
        return { success: false, error: response.message }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during login'
      setState(prev => ({
        ...prev,
        status: 'unauthenticated',
        error: message,
      }))
      return { success: false, error: message }
    }
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }))

    try {
      const response = await authService.registerUser(input)
      
      if (response.success && response.user) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.token || '')
        setState({
          user: response.user,
          status: 'authenticated',
          error: null,
        })
        return { success: true }
      } else {
        setState(prev => ({
          ...prev,
          status: 'unauthenticated',
          error: response.message,
        }))
        return { success: false, error: response.message }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during registration'
      setState(prev => ({
        ...prev,
        status: 'unauthenticated',
        error: message,
      }))
      return { success: false, error: message }
    }
  }, [])

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'loading', error: null }))

    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    
    setState({ user: null, status: 'unauthenticated', error: null })

    try {
      await nextAuthSignOut({ redirect: false })
    } catch {}

    router.push('/')
    return { success: true }
  }, [router])

  const requestPasswordReset = useCallback(async (input: ResetPasswordInput) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }))

    try {
      const response = await authService.requestPasswordReset(input)
      
      if (response.success) {
        setState(prev => ({ ...prev, status: 'unauthenticated', error: null }))
        return { success: true, message: response.message }
      } else {
        setState(prev => ({ ...prev, error: response.message }))
        return { success: false, error: response.message }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, error: message }))
      return { success: false, error: message }
    }
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const hasRole = useCallback((role: 'employer' | 'job_seeker'): boolean => {
    return state.user?.role === role
  }, [state.user])

  const isAuthenticated = state.status === 'authenticated' && state.user !== null

  return {
    user: state.user,
    status: state.status,
    error: state.error,
    isAuthenticated,
    login,
    register,
    logout,
    requestPasswordReset,
    clearError,
    hasRole,
  }
}
