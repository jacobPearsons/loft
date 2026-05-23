'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmailVerificationProps {
  email: string
  isVerified: boolean
}

export function EmailVerification({ email, isVerified }: EmailVerificationProps) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

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
        setSent(true)
        toast.success('Verification email sent! Check your inbox.')
      } else {
        toast.error(data.message || 'Failed to send verification email')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSending(false)
    }
  }

  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Verified
      </span>
    )
  }

  if (sent) {
    return (
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 text-sm text-yellow-400">
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          Pending
        </span>
        <p className="text-xs text-muted-foreground">
          Verification link sent! Check your email and click the link to verify.
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-sm text-yellow-400">
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        Unverified
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={sendVerification}
        disabled={sending}
        className="text-xs"
      >
        {sending ? (
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
        ) : (
          <Mail className="h-3 w-3 mr-1" />
        )}
        {sending ? 'Sending...' : 'Verify Email'}
      </Button>
    </div>
  )
}
