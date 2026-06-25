import { motion } from 'framer-motion'
import { Target, Eye, Heart } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'

const values = [
  { icon: Target, title: 'Our Mission', description: 'To connect ambitious professionals with opportunity-rich employers through transparent, skill-first matching — eliminating the noise of traditional hiring.' },
  { icon: Eye, title: 'Our Vision', description: 'A world where finding the right job or the right talent is as simple as a single conversation.' },
  { icon: Heart, title: 'Our Promise', description: 'Job seekers get clarity on application status. Employers get pre-qualified, ranked candidates. No ghosting, no guesswork.' },
]

export default function MissionSection() {
  const { ref, variants } = useReveal<HTMLDivElement>()

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-neutral-950" ref={ref}>
      <div className="container px-4 md:px-6">
        <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {values.map((item) => (
            <div key={item.title} className="glass glass-hover rounded-xl p-6 sm:p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-4 sm:mb-5">
                <item.icon className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
