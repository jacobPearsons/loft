'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Code, Database, Palette, Smartphone, Cloud, BarChart, Briefcase, Heart, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  { name: 'Software Development', icon: Code, count: 12500, color: 'bg-blue-500' },
  { name: 'Data Science', icon: Database, count: 8200, color: 'bg-purple-500' },
  { name: 'Design', icon: Palette, count: 6800, color: 'bg-pink-500' },
  { name: 'Mobile Development', icon: Smartphone, count: 5400, color: 'bg-blue-500' },
  { name: 'Cloud Computing', icon: Cloud, count: 4100, color: 'bg-cyan-500' },
  { name: 'Business Analyst', icon: BarChart, count: 3900, color: 'bg-orange-500' },
  { name: 'Project Management', icon: Briefcase, count: 3200, color: 'bg-yellow-500' },
  { name: 'Healthcare', icon: Heart, count: 2800, color: 'bg-red-500' },
  { name: 'Cybersecurity', icon: Shield, count: 2400, color: 'bg-indigo-500' },
]

export function JobCategories() {
  return (
    <section className="w-full py-20 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/images/Job%20Category%20Illustrations.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden
        />
      </div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Browse Jobs by Category
          </h2>
<p className="text-neutral-400 max-w-2xl mx-auto">
            Explore opportunities across various industries and find the perfect role for your skills
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link href={`/jobs?category=${category.name.toLowerCase().replace(' ', '-')}`} key={category.name}>
              <Card className="bg-neutral-900/50 border-neutral-800 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${category.color} bg-opacity-20 group-hover:bg-opacity-30 transition-colors`}>
                    <category.icon className={`h-6 w-6 ${category.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {category.count.toLocaleString()} open positions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/jobs" 
            className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  )
}
