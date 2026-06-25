import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'

const contactInfo = [
  { icon: MapPin, label: 'Address', value: '123 Innovation Drive, Tech Valley, CA 94025' },
  { icon: Mail, label: 'Email', value: 'hiring.pathmatch@gmail.com', href: 'mailto:hiring.pathmatch@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: Clock, label: 'Hours', value: 'Mon-Fri, 9:00 AM - 6:00 PM PST' },
]

export default function InfoPanel() {
  const { ref, variants } = useReveal<HTMLDivElement>({ direction: 'left' })

  return (
    <motion.div ref={ref} variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="section-title text-left mb-3 sm:mb-4">
          Get in{' '}
          <span className="text-gradient">Touch</span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-400">
          Have a question, feedback, or need help? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="space-y-4">
        {contactInfo.map((item) => (
          <div key={item.label} className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center shrink-0">
              <item.icon className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-neutral-500">{item.label}</p>
              {item.href ? (
                <a href={item.href} className="text-sm sm:text-base text-white hover:text-emerald-400 transition-colors break-all">
                  {item.value}
                </a>
              ) : (
                <p className="text-sm sm:text-base text-white">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
