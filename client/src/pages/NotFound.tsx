import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageShell from '@/components/layout/PageShell'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function NotFound() {
  const reduced = useReducedMotion()

  return (
    <PageShell>
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.5 }}
          className="text-center max-w-md"
        >
          <motion.h1
            initial={reduced ? { scale: 1 } : { scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.1 }}
            className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"
          >
            404
          </motion.h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mt-4">
            Page not found
          </h2>
          <p className="text-neutral-400 mt-3 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/jobs">
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
