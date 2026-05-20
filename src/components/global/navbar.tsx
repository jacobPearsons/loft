'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MenuIcon } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogoWithText } from './logo'

export default function Navbar() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const isAuthenticated = !!session

  return (
    <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between">
      <aside className="flex items-center gap-[2px]">
        <LogoWithText />
      </aside>
      <nav className="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block">
        <ul className="flex items-center gap-4 list-none">
          <li>
            <Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">Jobs</Link>
          </li>
          <li>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          </li>
          <li>
            <Link href="/employer" className="text-muted-foreground hover:text-foreground transition-colors">Employers</Link>
          </li>
          <li>
            <Link href="/contact-us" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
          </li>
          <li>
            <Link href="/about-us" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
          </li>
          <li>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Enterprise</Link>
          </li>
        </ul>
      </nav>
      <aside className="flex items-center gap-4">
        {!isLoading && (
          <>
            {isAuthenticated ? (
              <>
                <Link href={(session.user as any).isEmployer ? "/employer/dashboard" : "/dashboard"}>
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {session.user.name || session.user.email}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link
                  href="/sign-up"
                  className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#34D399_0%,#059669_50%,#34D399_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Get Started
                  </span>
                </Link>
              </>
            )}
          </>
        )}
        <MenuIcon className="md:hidden" />
      </aside>
    </header>
  )
}
