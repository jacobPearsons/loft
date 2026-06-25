import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, LogOut } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { applicantLinks, employerLinks, type SidebarLink } from '@/lib/sidebar-constants'
import { Logo, LogoWithText } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  mobile?: boolean
}

function SidebarLinkItem({ link, isActive, onClick }: { link: SidebarLink; isActive: boolean; onClick?: () => void }) {
  const Icon = link.icon
  return (
    <Link
      to={link.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{link.label}</span>
    </Link>
  )
}

export default function Sidebar({ isOpen, onClose, mobile }: SidebarProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const reduced = useReducedMotion()

  const isEmployer = user?.isEmployer ?? false
  const links = isEmployer ? employerLinks : applicantLinks

  const isActive = (href: string) => {
    const path = href.split('?')[0]
    if (path === '/employer/dashboard') {
      return location.pathname === '/employer/dashboard'
    }
    return location.pathname === path
  }

  const content = (
    <nav className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0">
        <Logo width={28} height={28} />
        <span className="font-semibold text-white text-sm">LoftCommunity</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => (
          <SidebarLinkItem
            key={link.href}
            link={link}
            isActive={isActive(link.href)}
            onClick={onClose}
          />
        ))}
      </div>

      <div className="border-t border-white/10 p-3 space-y-1 shrink-0">
        <Link
          to="/notifications"
          onClick={onClose}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive('/notifications')
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <Bell className="h-5 w-5 shrink-0" />
          <span>Notifications</span>
        </Link>
        <button
          onClick={() => { logout(); onClose?.() }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  )

  if (mobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="fixed inset-0 bg-black/60" onClick={onClose} />
            <motion.div
              initial={reduced ? { x: 0 } : { x: '-100%' }}
              animate={{ x: 0 }}
              exit={reduced ? { x: 0 } : { x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-background border-r border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 shrink-0">
                <LogoWithText />
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-3 pb-2 uppercase tracking-wider">
                  {isEmployer ? 'Employer' : 'Menu'}
                </p>
                {links.map((link) => (
                  <SidebarLinkItem
                    key={link.href}
                    link={link}
                    isActive={isActive(link.href)}
                    onClick={onClose}
                  />
                ))}
              </nav>
              <div className="border-t border-white/10 p-3 space-y-1 shrink-0">
                <Link
                  to="/notifications"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <div className="hidden md:flex w-56 shrink-0 border-r border-white/10 bg-background">
      {content}
    </div>
  )
}
