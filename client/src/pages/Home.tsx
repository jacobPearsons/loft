import PageShell from '@/components/layout/PageShell'
import HeroSection from '@/components/sections/home/HeroSection'
import JobCategories from '@/components/sections/home/JobCategories'
import HowItWorks from '@/components/sections/home/HowItWorks'
import Testimonials from '@/components/sections/home/Testimonials'
import CTABanner from '@/components/sections/home/CTABanner'

export default function Home() {
  return (
    <PageShell>
      <HeroSection />
      <JobCategories />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </PageShell>
  )
}
