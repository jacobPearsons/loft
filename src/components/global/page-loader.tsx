import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8">
      <Image
        src="/logo.png"
        alt="LoftCommunity"
        width={100}
        height={35}
        className="object-contain opacity-80"
        priority
      />
      <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
    </div>
  )
}
