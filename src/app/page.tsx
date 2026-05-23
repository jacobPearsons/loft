import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import { HeroSection } from '@/components/home/hero-section'
import { JobCategories } from '@/components/home/job-categories'
import { FeaturedJobs } from '@/components/home/featured-jobs'
import { HowItWorks } from '@/components/home/how-it-works'
import { Testimonials } from '@/components/home/testimonials'
import { CallToAction } from '@/components/home/call-to-action'

export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <JobCategories />
      <FeaturedJobs />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  )
}
