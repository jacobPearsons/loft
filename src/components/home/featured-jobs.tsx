'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const featuredJobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full Time',
    salary: '$120k - $180k',
    posted: '2 days ago',
    tags: ['React', 'Node.js', 'TypeScript'],
    featured: true,
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'DesignHub',
    location: 'Remote',
    type: 'Full Time',
    salary: '$90k - $140k',
    posted: '1 day ago',
    tags: ['Figma', 'UI/UX', 'Design Systems'],
    featured: true,
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'DataMinds',
    location: 'New York, NY',
    type: 'Full Time',
    salary: '$130k - $170k',
    posted: '3 days ago',
    tags: ['Python', 'ML', 'TensorFlow'],
    featured: false,
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudFirst',
    location: 'Austin, TX',
    type: 'Full Time',
    salary: '$110k - $160k',
    posted: '5 hours ago',
    tags: ['AWS', 'Kubernetes', 'Docker'],
    featured: true,
  },
  {
    id: 5,
    title: 'Frontend Developer',
    company: 'WebWorks',
    location: 'Remote',
    type: 'Contract',
    salary: '$60 - $80/hr',
    posted: '1 day ago',
    tags: ['Vue.js', 'JavaScript', 'CSS'],
    featured: false,
  },
  {
    id: 6,
    title: 'Marketing Manager',
    company: 'GrowthLabs',
    location: 'Chicago, IL',
    type: 'Full Time',
    salary: '$80k - $120k',
    posted: '4 days ago',
    tags: ['Digital Marketing', 'SEO', 'Analytics'],
    featured: false,
  },
]

export function FeaturedJobs() {
  return (
    <section className="w-full py-20 bg-neutral-950">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Jobs
            </h2>
            <p className="text-neutral-400">
              Hand-picked jobs from top companies
            </p>
          </div>
          <Link href="/jobs">
            <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <Card key={job.id} className="bg-neutral-900/50 border-neutral-800 hover:border-emerald-500/50 transition-all duration-300 group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white group-hover:text-emerald-400 transition-colors">
                      {job.title}
                    </CardTitle>
                    <p className="text-neutral-400 text-sm mt-1">{job.company}</p>
                  </div>
                  {job.featured && (
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-neutral-700 text-neutral-400">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-col gap-2 text-sm text-neutral-500 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {job.posted}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                </div>
                
                <Link href={`/jobs/${job.id}`}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Apply Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
