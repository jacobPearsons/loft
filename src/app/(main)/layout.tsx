'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/sidebar'
import Infobar from '@/components/infobar'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = { children: React.ReactNode }

const Layout = (props: Props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex overflow-hidden h-screen bg-background">
      <Sidebar />
      <Sidebar mobile isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="w-full flex flex-col overflow-hidden">
        <div className="flex items-center md:hidden px-4 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="text-foreground"
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
        </div>
        <Infobar />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {props.children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default Layout
