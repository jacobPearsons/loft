import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import PageShell from '@/components/layout/PageShell'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Terms() {
  const reduced = useReducedMotion()

  return (
    <PageShell>
      <div className="container px-4 md:px-6 py-16 sm:py-20 max-w-3xl mx-auto">
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-6 w-6 text-emerald-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Terms of Service</h1>
              <p className="text-sm text-neutral-400 mt-1">Last updated: June 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-neutral-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>By creating an account or using LoftCommunity, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. We may update these terms at any time, and continued use constitutes acceptance of changes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Account Responsibilities</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate information and keep it updated. Notify us immediately of any unauthorized use.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Job Listings</h2>
              <p>Employers are responsible for the accuracy of their job listings. We reserve the right to remove listings that violate our guidelines, including discriminatory requirements, misleading information, or prohibited content.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Prohibited Uses</h2>
              <p>You agree not to use the platform for any unlawful purpose, to impersonate others, to spam or solicit, to scrape or harvest data, to distribute malware, or to engage in any activity that disrupts the platform or its users.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Limitation of Liability</h2>
              <p>LoftCommunity provides a platform for job matching but is not responsible for the accuracy of job listings, the quality of employers, or employment decisions made by either party. We are not liable for indirect or consequential damages.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Termination</h2>
              <p>We reserve the right to suspend or terminate accounts that violate these terms or engage in prohibited activities. You may delete your account at any time through your settings or by contacting support.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Contact</h2>
              <p>For questions about these terms, please contact us at hiring.pathmatch@gmail.com.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
