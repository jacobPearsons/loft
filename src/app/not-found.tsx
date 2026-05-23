import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h1 className="text-8xl font-bold text-emerald-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Go Home</Button>
          </Link>
          <Link href="/jobs">
            <Button variant="outline" className="border text-foreground/80">Browse Jobs</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
