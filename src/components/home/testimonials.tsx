'use client'

import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    quote: "Loft Community helped me land my dream job within 2 weeks! The resume upload feature and job matching made the process incredibly smooth.",
    name: "Sarah Johnson",
    role: "Software Engineer at Google",
    avatar: "S",
  },
  {
    quote: "As an employer, finding qualified candidates has never been easier. The English proficiency test feature saves us so much screening time.",
    name: "Michael Chen",
    role: "HR Director at TechCorp",
    avatar: "M",
  },
  {
    quote: "The platform's clean interface and easy application process made job hunting less stressful. Highly recommended!",
    name: "Emily Rodriguez",
    role: "Product Designer at Figma",
    avatar: "E",
  },
]

export function Testimonials() {
  return (
    <section className="w-full py-20 bg-neutral-950">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Join thousands of satisfied job seekers and employers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-neutral-900/50 border-neutral-800">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="text-emerald-400 text-4xl">&quot;</div>
                  <p className="text-neutral-300 italic">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-neutral-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
