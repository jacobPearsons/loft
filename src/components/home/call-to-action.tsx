'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CallToAction() {
  return (
    <section className="w-full py-20 bg-gradient-to-br from-emerald-900 to-neutral-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Career Journey?
            </h2>
            <p className="text-neutral-300 text-lg max-w-xl">
              Join Loft Community today and take the first step towards your dream job. 
              Upload your resume, take our English proficiency test, and get discovered by top employers.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-neutral-100">
                Get Started Free
              </Button>
            </Link>
            <Link href="/employer/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Hire Talent
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
