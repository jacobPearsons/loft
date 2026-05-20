/**
 * Register Form Component
 * 
 * Native registration form with role selection for Employer/Job Seeker.
 * Uses the registration API
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface RegisterFormProps {
  onSwitchToLogin?: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    }
  }

  const passwordReqs = validatePassword(formData.password)
  const isPasswordStrong = passwordReqs.minLength && passwordReqs.hasUppercase && passwordReqs.hasNumber

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.role) {
      setError('Please fill in all required fields')
      return
    }

    if (!formData.role) {
      setError('Please select your account type')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!isPasswordStrong) {
      setError('Password does not meet requirements')
      return
    }

    setLoading(true)

    try {
      // Register the user via API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role === 'employer' ? 'EMPLOYER' : 'JOB_SEEKER',
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'Registration failed')
        setLoading(false)
        return
      }

      // Sign in after registration
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError('Registration successful but login failed. Please try signing in.')
      } else {
        router.push('/onboarding/role-selection')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }

    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Join the employment platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md p-3">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              I am a <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('role', 'employer')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.role === 'employer'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-border hover:border-emerald-500/50'
                }`}
              >
                <div className="font-medium text-foreground">Employer</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Hiring talent
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('role', 'job_seeker')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.role === 'job_seeker'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-border hover:border-emerald-500/50'
                }`}
              >
                <div className="font-medium text-foreground">Job Seeker</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Looking for work
                </div>
              </button>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                First Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                Last Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address <span className="text-destructive">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password <span className="text-destructive">*</span>
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              disabled={loading}
              autoComplete="new-password"
              required
            />
            {/* Password Requirements */}
            <div className="grid grid-cols-3 gap-1 text-xs mt-2">
              <div className={`flex items-center gap-1 ${passwordReqs.minLength ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                <span>{passwordReqs.minLength ? '✓' : '○'}</span>
                <span>8+ chars</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordReqs.hasUppercase ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                <span>{passwordReqs.hasUppercase ? '✓' : '○'}</span>
                <span>Uppercase</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordReqs.hasNumber ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                <span>{passwordReqs.hasNumber ? '✓' : '○'}</span>
                <span>Number</span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password <span className="text-destructive">*</span>
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              disabled={loading}
              autoComplete="new-password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading || !isPasswordStrong}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-emerald-500 hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
    </motion.div>
  )
}