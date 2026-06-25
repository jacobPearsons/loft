import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import PageShell from '@/components/layout/PageShell'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Privacy() {
  const reduced = useReducedMotion()

  return (
    <PageShell>
      <div className="container px-4 md:px-6 py-16 sm:py-20 max-w-3xl mx-auto">
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-6 w-6 text-emerald-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-sm text-neutral-400 mt-1">Last updated: June 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-neutral-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Information We Collect</h2>
              <p>We collect information you provide when creating an account, including your name, email address, phone number, and professional details such as work history, skills, and education. We also collect information about your interactions with our platform, including job applications, messages, and saved searches.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <p>We use your information to provide and improve our job matching services, process applications, facilitate communication between job seekers and employers, send relevant job recommendations, and improve platform security and user experience.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Information Sharing</h2>
              <p>We share your information with employers when you apply for a job through our platform. We do not sell your personal information to third parties. We may share anonymized, aggregate data for analytics purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Data Security</h2>
              <p>We implement industry-standard security measures including encryption at rest and in transit, secure authentication protocols, and regular security audits to protect your personal information from unauthorized access.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data at any time through your account settings. You can also request a copy of your data or ask us to restrict processing by contacting our support team.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Cookies</h2>
              <p>We use essential cookies for authentication and platform functionality. Analytics cookies help us understand usage patterns. You can manage cookie preferences through your browser settings.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Contact</h2>
              <p>For privacy-related inquiries, please contact us at hiring.pathmatch@gmail.com. We aim to respond to all queries within 48 hours.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
