import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useReveal } from '@/hooks/useReveal'

export default function CTABanner() {
  const { ref, variants } = useReveal<HTMLDivElement>()

  return (
    <section className="w-full py-16 sm:py-20 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-neutral-950 to-neutral-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />

      <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="container px-4 md:px-6 relative z-10 text-center">
        <h2 className="section-title mb-4">
          Join Us in{' '}
          <span className="text-gradient">Shaping the Future</span> of Hiring
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto mb-8">
          Whether you&apos;re looking for your next role or building your team, LoftCommunity is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link to="/register">
            <Button size="xl" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
              Get Started Free
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="xl" variant="outline" className="border-white/20 text-white hover:bg-white/5 w-full sm:w-auto">
              Contact Us
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
