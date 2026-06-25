import { motion } from 'framer-motion'
import { useReveal } from '@/hooks/useReveal'

export default function HeroSection() {
  const { ref, variants } = useReveal<HTMLDivElement>()

  return (
    <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center max-w-4xl mx-auto">
          <h1 className="section-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            About{' '}
            <span className="text-gradient">LoftCommunity</span>
          </h1>
          <p className="section-subtitle text-base sm:text-lg md:text-xl max-w-3xl mt-6">
            We&apos;re on a mission to transform hiring — making it transparent, skill-first, 
            and human. No more black holes. No more noise.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
