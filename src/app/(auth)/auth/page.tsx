/**
 * Authentication Page
 * 
 * Main authentication page with login, register, and reset password forms.
 * Follows docs/frontend-lifecycle.md for route structure.
 * Features:
 * - Split layout with visual panel and form
 * - Fully responsive design
 * - Animated background effects
 * - Glassmorphism styling
 */

'use client'

import { useState } from 'react'
import { LoginForm, RegisterForm, ResetPasswordForm } from '@/features/auth/components'
import { motion } from 'framer-motion'
import { Briefcase, Users, Search, TrendingUp } from 'lucide-react'
import LogoWithText from "@/components/global/logo";

type AuthMode = 'login' | 'register' | 'reset'

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToRegister={() => setMode('register')}
            onSwitchToResetPassword={() => setMode('reset')}
          />
        )
      case 'register':
        return (
          <RegisterForm
            onSwitchToLogin={() => setMode('login')}
          />
        )
      case 'reset':
        return (
          <ResetPasswordForm
            onBackToLogin={() => setMode('login')}
          />
        )
      default:
        return null
    }
  }

  const features = [
    { icon: Search, title: 'Find Jobs', description: 'Discover opportunities that match your skills' },
    { icon: Users, title: 'Connect', description: 'Network with employers and recruiters' },
    { icon: Briefcase, title: 'Apply', description: 'Submit applications with ease' },
    { icon: TrendingUp, title: 'Grow', description: 'Track your career progression' },
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Visual/Branding */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-40 w-80 h-80 bg-emerald-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center px-12 py-16 text-white">
          {/* Logo */}
          <div className="mb-12">
            <LogoWithText />
          </div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Your Career Journey<br />Starts Here
            </h1>
            <p className="text-emerald-100 text-lg md:text-xl max-w-md mx-auto">
              Connect with top employers and find your dream job in minutes
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 w-full max-w-lg"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-colors"
              >
                <feature.icon className="w-6 h-6 mb-2 text-emerald-200" />
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-emerald-100 text-xs mt-1">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex gap-8 text-center"
          >
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-emerald-200 text-sm">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5K+</div>
              <div className="text-emerald-200 text-sm">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-emerald-200 text-sm">Job Seekers</div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.05"/>
          </svg>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <LogoWithText />
          </div>

          {/* Form Container with Glass Effect */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
            {renderForm()}
          </div>

          {/* Footer */}
          <p className="text-center text-muted-foreground text-xs mt-8">
            © 2026 LoftCommunity. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
