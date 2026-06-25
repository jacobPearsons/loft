'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BlockedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🚫</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          This page couldn&apos;t load
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Reload to try again, or go back.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.refresh()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border text-foreground/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
