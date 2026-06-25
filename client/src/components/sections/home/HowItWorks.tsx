import { motion } from 'framer-motion'
import { Search, FileText, TrendingUp, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useReveal, useStaggerReveal } from '@/hooks/useReveal'

const steps = [
  { icon: Search, title: 'Search Jobs', description: 'Browse thousands of job listings from top companies. Filter by location, salary, and more.', number: '01' },
  { icon: FileText, title: 'Upload Resume', description: 'Create your profile and upload your resume. Make a great first impression on employers.', number: '02' },
  { icon: TrendingUp, title: 'Take Assessment', description: 'Complete our English proficiency test to showcase your skills and stand out.', number: '03' },
  { icon: CheckCircle, title: 'Get Hired', description: 'Apply to jobs, track your applications, and land your dream job.', number: '04' },
]

export default function HowItWorks() {
  const { ref, variants } = useReveal<HTMLDivElement>()
  const { containerVariants, itemVariants } = useStaggerReveal(0.12)

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-neutral-900/50" ref={ref}>
      <div className="container px-4 md:px-6">
        <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="section-title">
            How{' '}
            <span className="text-gradient">Loft Community</span>
            {' '}Works
          </h2>
          <p className="section-subtitle">
            Your journey to finding the perfect job in four simple steps
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
        >
          {steps.map((step, index) => (
            <motion.div key={step.number} variants={itemVariants} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[calc(100%-40px)] h-[1px] bg-gradient-to-r from-emerald-500/40 to-transparent" />
              )}
              <Card className="text-center h-full hover:border-emerald-500/20 transition-all duration-300 group">
                <CardContent className="p-5 sm:p-6 md:p-8 flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-white/5 mb-2 sm:mb-3 select-none">{step.number}</div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
