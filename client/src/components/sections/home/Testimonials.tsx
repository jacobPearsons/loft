import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { useReveal, useStaggerReveal } from '@/hooks/useReveal'

const testimonials = [
  { quote: 'Loft Community helped me land my dream job within 2 weeks! The resume upload feature and job matching made the process incredibly smooth.', name: 'Sarah Johnson', role: 'Software Engineer at Google', avatar: 'SJ' },
  { quote: 'As an employer, finding qualified candidates has never been easier. The English proficiency test feature saves us so much screening time.', name: 'Michael Chen', role: 'HR Director at TechCorp', avatar: 'MC' },
  { quote: 'The platform\'s clean interface and easy application process made job hunting less stressful. Highly recommended!', name: 'Emily Rodriguez', role: 'Product Designer at Figma', avatar: 'ER' },
]

const avatarColors = ['from-emerald-500 to-emerald-700', 'from-blue-500 to-blue-700', 'from-purple-500 to-purple-700']

export default function Testimonials() {
  const { ref, variants } = useReveal<HTMLDivElement>()
  const { containerVariants, itemVariants } = useStaggerReveal(0.1)

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-neutral-950" ref={ref}>
      <div className="container px-4 md:px-6">
        <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="section-title">
            What Our{' '}
            <span className="text-gradient">Users Say</span>
          </h2>
          <p className="section-subtitle">
            Join thousands of satisfied job seekers and employers
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:border-emerald-500/20 transition-all duration-300">
                <CardContent className="p-5 sm:p-6 md:p-8 flex flex-col h-full">
                  <div className="text-emerald-400 text-3xl sm:text-4xl leading-none mb-2">&ldquo;</div>
                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed flex-1">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/[0.05]">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${avatarColors[index]} flex items-center justify-center text-white text-xs sm:text-sm font-bold shrink-0`}>
                      {testimonial.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-white truncate">{testimonial.name}</div>
                      <div className="text-xs sm:text-sm text-neutral-500 truncate">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
