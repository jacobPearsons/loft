import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useReveal } from '@/hooks/useReveal'

export default function CTABanner() {
  const { ref, variants } = useReveal<HTMLDivElement>()

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-neutral-950 to-neutral-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]" />

      <motion.div
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="container px-4 md:px-6 relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
          <div className="text-center lg:text-left max-w-2xl">
            <h2 className="section-title mb-3 sm:mb-4">
              Ready to Start Your{' '}
              <span className="text-gradient">Career Journey</span>?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed">
              Join Loft Community today and take the first step towards your dream job.
              Upload your resume, take our English proficiency test, and get discovered by top employers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="xl" className="bg-white text-emerald-900 hover:bg-neutral-100 w-full">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login?type=employer" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="border-white/20 text-white hover:bg-white/5 w-full">
                Hire Talent
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
