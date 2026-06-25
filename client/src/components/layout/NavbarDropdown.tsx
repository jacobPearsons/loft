import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  User,
  Bookmark,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Briefcase,
  GitBranch,
  Building2,
} from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const dropdownItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const employerItems = [
  { href: '/employer/dashboard', label: 'Employer Dashboard', icon: Briefcase },
  { href: '/hiring-workflow', label: 'Hiring Workflow', icon: GitBranch },
  { href: '/employer/company', label: 'Company Profile', icon: Building2 },
]

export default function NavbarDropdown() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map(n => n?.charAt(0).toUpperCase())
    .join('') || user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 min-w-[44px] min-h-[44px] px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        aria-label="User menu"
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center text-sm font-medium text-emerald-400">
          {initials}
        </div>
        <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: reduced ? 0 : 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-neutral-950 backdrop-blur-xl shadow-xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-white/[0.05]">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
              </p>
              <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
            </div>

            <div className="p-1.5">
              {user?.isEmployer && (
                <>
                  {employerItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    )
                  })}
                  <div className="mx-3 my-1.5 border-t border-white/[0.05]" />
                </>
              )}
              {dropdownItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="border-t border-white/[0.05] p-1.5">
              <button
                onClick={() => { setOpen(false); logout(); navigate('/') }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
