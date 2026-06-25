import { motion } from 'framer-motion'
import { Shield, Zap, Users, Sparkles } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'

const values = [
  { icon: Shield, title: 'Transparency', description: 'Every application comes with a status. No more wondering if anyone saw your application. We believe candidates deserve to know where they stand.' },
  { icon: Zap, title: 'Speed', description: 'We value your time. Our skill-first matching surfaces the best candidates and roles instantly, cutting hiring time in half.' },
  { icon: Users, title: 'Fairness', description: 'Skills matter more than pedigree. We level the playing field so talent from any background can shine.' },
  { icon: Sparkles, title: 'Innovation', description: 'We continually evolve our platform to use the latest in matching technology, always putting user experience first.' },
]

const icons = [Shield, Zap, Users, Sparkles]

export default function ValuesSection() {
  const { ref, variants } = useReveal<HTMLDivElement>()

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-neutral-950" ref={ref}>
      <div className="container px-4 md:px-6">
        <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="section-title">
            Our{' '}
            <span className="text-gradient">Values</span>
          </h2>
          <p className="section-subtitle">
            The principles that guide everything we build
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {values.map((value, index) => (
            <ValueItem
              key={value.title}
              icon={icons[index]}
              title={value.title}
              description={value.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ValueItem({ icon: Icon, title, description, index }: { icon: any; title: string; description: string; index: number }) {
  const { ref, variants } = useReveal<HTMLDivElement>({ delay: index * 0.1 })

  return (
    <motion.div ref={ref} variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative pl-12 sm:pl-16 pb-10 sm:pb-12 last:pb-0">
      {index < 3 && (
        <div className="absolute left-[17px] sm:left-[23px] top-10 sm:top-12 bottom-0 w-[1px] bg-gradient-to-b from-emerald-500/40 to-transparent" />
      )}

      <div className="absolute left-0 top-1 sm:top-1.5 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
      </div>

      <div className="glass glass-hover rounded-xl p-5 sm:p-6 md:p-8">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}
