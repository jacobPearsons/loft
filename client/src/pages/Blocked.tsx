import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'
import PageShell from '@/components/layout/PageShell'

export default function Blocked() {
  return (
    <PageShell showFooter={false}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Restricted</h1>
          <p className="text-neutral-400 leading-relaxed">
            This service is not available in your current region. If you believe this is an error, please contact support.
          </p>
        </motion.div>
      </div>
    </PageShell>
  )
}
