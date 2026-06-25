import PageShell from '@/components/layout/PageShell'
import HeroSection from '@/components/sections/about/HeroSection'
import MissionSection from '@/components/sections/about/MissionSection'
import TeamSection from '@/components/sections/about/TeamSection'
import ValuesSection from '@/components/sections/about/ValuesSection'
import CTABanner from '@/components/sections/about/CTABanner'

export default function About() {
  return (
    <PageShell>
      <HeroSection />
      <MissionSection />
      <TeamSection />
      <ValuesSection />
      <CTABanner />
    </PageShell>
  )
}
