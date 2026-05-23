'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Search, FileText, TrendingUp, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Search Jobs',
    description: 'Browse thousands of job listings from top companies. Filter by location, salary, and more.',
    number: '01',
  },
  {
    icon: FileText,
    title: 'Upload Resume',
    description: 'Create your profile and upload your resume. Make a great first impression on employers.',
    number: '02',
  },
  {
    icon: TrendingUp,
    title: 'Take Assessment',
    description: 'Complete our English proficiency test to showcase your skills and stand out.',
    number: '03',
  },
  {
    icon: CheckCircle,
    title: 'Get Hired',
    description: 'Apply to jobs, track your applications, and land your dream job.',
    number: '04',
  },
]

export function HowItWorks() {
  return (
    <section className="w-full py-20 bg-neutral-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How Loft Community Works
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Your journey to finding the perfect job in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className=" Connectorrelative">
              {/* Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-neutral-800 -translate-y-1/2 z-0"></div>
              )}
              
              <Card className="bg-neutral-950 border-neutral-800 relative z-10">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="text-4xl font-bold text-neutral-800 mb-2">{step.number}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-neutral-400 text-sm">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
