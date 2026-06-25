import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className, width = 40, height = 40 }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="LoftCommunity"
      width={width}
      height={height}
      className={cn('object-contain', className)}
    />
  )
}

export function LogoWithText({ className, width = 100, height = 35 }: LogoProps) {
  return (
    <Link to="/" className={cn('flex items-center gap-2 shrink-0', className)} aria-label="Loft Community Home">
      <Logo width={Math.min(width, 32)} height={Math.min(height, 32)} />
      <span className="font-semibold text-white hidden sm:block">LoftCommunity</span>
    </Link>
  )
}

export function LogoIcon({ className, width = 40, height = 40 }: LogoProps) {
  return (
    <Link to="/" className={cn('block', className)} aria-label="Loft Community Home">
      <Logo width={width} height={height} />
    </Link>
  )
}
