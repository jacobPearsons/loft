import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface PageShellProps {
  children: React.ReactNode
  showFooter?: boolean
}

export default function PageShell({ children, showFooter = true }: PageShellProps) {
  const reduced = useReducedMotion()

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <motion.main
        className="flex-1"
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
        transition={{ duration: reduced ? 0 : 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.main>
      {showFooter && <Footer />}
    </div>
  )
}
