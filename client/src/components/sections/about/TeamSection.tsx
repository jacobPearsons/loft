import { motion } from 'framer-motion'
import { Linkedin, Twitter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useReveal, useStaggerReveal } from '@/hooks/useReveal'

const team = [
  { name: 'Adaobi Nwosu', role: 'CEO & Founder', initials: 'AN', gradient: 'from-emerald-500 to-emerald-700' },
  { name: 'Emeka Okafor', role: 'CTO', initials: 'EO', gradient: 'from-blue-500 to-blue-700' },
  { name: 'Chioma Eze', role: 'Head of Product', initials: 'CE', gradient: 'from-purple-500 to-purple-700' },
  { name: 'Tunde Balogun', role: 'Lead Engineer', initials: 'TB', gradient: 'from-cyan-500 to-cyan-700' },
]

export default function TeamSection() {
  const { ref, variants } = useReveal<HTMLDivElement>()
  const { containerVariants, itemVariants } = useStaggerReveal(0.1)

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-neutral-900/50" ref={ref}>
      <div className="container px-4 md:px-6">
        <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="section-title">
            Meet Our{' '}
            <span className="text-gradient">Team</span>
          </h2>
          <p className="section-subtitle">
            Passionate people building the future of hiring
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
        >
          {team.map((member) => (
            <motion.div key={member.name} variants={itemVariants}>
              <Card className="text-center h-full hover:border-emerald-500/20 transition-all duration-300 group">
                <CardContent className="p-6 sm:p-8 flex flex-col items-center">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-xl sm:text-2xl font-bold text-white">{member.initials}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-neutral-400 mb-4">{member.role}</p>
                  <div className="flex gap-2">
                    <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-emerald-600/20 text-neutral-400 hover:text-emerald-400 flex items-center justify-center transition-all min-w-[44px] min-h-[44px]">
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-emerald-600/20 text-neutral-400 hover:text-emerald-400 flex items-center justify-center transition-all min-w-[44px] min-h-[44px]">
                      <Twitter className="h-4 w-4" />
                    </a>
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
