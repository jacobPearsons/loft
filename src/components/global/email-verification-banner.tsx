'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AlertTriangle, Loader2, X, Mail } from 'lucide-react'

interface EmailVerificationBannerProps {
  email: string
  isVerified: boolean
}

export function EmailVerificationBanner({ email, isVerified }: EmailVerificationBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [sending, setSending] = useState(false)

  if (isVerified || dismissed) return null

  const sendVerification = async () => {
    setSending(true)
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Verification email sent! Check your inbox.')
        setDismissed(true)
      } else {
        toast.error(data.message || 'Failed to send verification email')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm">
      <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0" />
      <p className="text-foreground/80 flex-1">
        Please verify your email address to access all features.
      </p>
      <button
        onClick={sendVerification}
        disabled={sending}
        className="text-xs font-medium text-yellow-400 hover:text-yellow-300 disabled:opacity-50 flex items-center gap-1"
      >
        {sending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Mail className="h-3 w-3" />
        )}
        {sending ? 'Sending...' : 'Send verification'}
      </button>
      <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
