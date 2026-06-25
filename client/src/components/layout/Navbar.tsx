import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard, User, Bookmark, MessageSquare, LogOut, Briefcase, GitBranch, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoWithText } from '@/components/ui/logo'
import NavbarDropdown from './NavbarDropdown'
import { useAuth } from '@/providers/AuthProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const authLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, status, logout } = useAuth()
  const reduced = useReducedMotion()

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <header className="fixed right-0 left-0 top-0 z-[100]">
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="container flex items-center justify-between h-16 sm:h-20">
          <LogoWithText />

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-white bg-white/10'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {status === 'loading' ? null : isAuthenticated ? (
              <NavbarDropdown />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="fixed inset-0 top-16 sm:top-20 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <motion.nav
              initial={reduced ? { x: 0 } : { x: '100%' }}
              animate={{ x: 0 }}
              exit={reduced ? { x: 0 } : { x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-16 sm:top-20 bottom-0 w-[280px] max-w-[85vw] bg-neutral-950 border-l border-white/10 p-6 flex flex-col gap-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-lg text-base transition-colors ${
                    isActive(link.href)
                      ? 'text-white bg-white/10'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  {user?.isEmployer && (
                    <div className="border-t border-white/10 mt-4 pt-4">
                      <p className="text-xs text-neutral-500 px-4 pb-2 uppercase tracking-wider">Employer</p>
                      {[
                        { href: '/employer/dashboard', label: 'Employer Dashboard', icon: Briefcase },
                        { href: '/hiring-workflow', label: 'Hiring Workflow', icon: GitBranch },
                        { href: '/employer/company', label: 'Company Profile', icon: Building2 },
                      ].map((link) => {
                        const Icon = link.icon
                        return (
                          <Link
                            key={link.href}
                            to={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors ${
                              isActive(link.href)
                                ? 'text-white bg-white/10'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {link.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                  <div className="border-t border-white/10 mt-4 pt-4">
                    <p className="text-xs text-neutral-500 px-4 pb-2 uppercase tracking-wider">Account</p>
                    {authLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors ${
                            isActive(link.href)
                              ? 'text-white bg-white/10'
                              : 'text-neutral-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                </>
              )}

              <div className="border-t border-white/10 mt-4 pt-4 flex flex-col gap-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => { setMobileOpen(false); logout() }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
