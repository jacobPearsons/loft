import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'

export default function MapSection() {
  const { ref, variants } = useReveal<HTMLDivElement>()

  return (
    <section ref={ref} className="w-full">
      <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.05]">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-950">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
            <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-400" />
          </div>
          <p className="text-sm sm:text-base text-neutral-400">123 Innovation Drive, Tech Valley, CA</p>
          <p className="text-xs text-neutral-600 mt-1">Interactive map coming soon</p>
        </div>
      </motion.div>
    </section>
  )
}
