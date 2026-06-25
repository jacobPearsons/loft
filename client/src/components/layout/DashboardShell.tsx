import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuIcon, Book, Headphones, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Sidebar from './Sidebar'
import { useAuth } from '@/providers/AuthProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function DashboardShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const reduced = useReducedMotion()

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      <Sidebar />
      <Sidebar mobile isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-4 px-4 py-3 border-b border-white/10 shrink-0 bg-background">
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="text-foreground"
            >
              <MenuIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors" title="Guide">
              <Book className="h-4 w-4" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors" title="Contact Support">
              <Headphones className="h-4 w-4" />
            </button>
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline max-w-[120px] truncate">
                  {user.name || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.15 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
