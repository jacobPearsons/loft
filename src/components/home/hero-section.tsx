'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Briefcase, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches && videoRef.current) {
      videoRef.current.pause()
    }
  }, [])

  return (
    <section className="w-full min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden bg-neutral-950">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="/Professionals_in_modern_office_202606050752.mp4" type="video/mp4" />
      </video>
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-neutral-950/60"></div>
      
      {/* Background gradient accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>

      {/* Decorative background image */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/Hero%20Background.png"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden
        />
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-1.5 text-sm text-neutral-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            Trusted by 10,000+ Job Seekers
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl">
            Find Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              Dream Job
            </span>{' '}
            Today
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            Connect with top employers, showcase your skills, and land your perfect opportunity. 
            Your career journey starts here.
          </p>
          
          {/* Search Box */}
          <div className="w-full max-w-3xl mt-8">
            <div className="flex flex-col md:flex-row gap-3 p-3 bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl">
              <div className="flex items-center flex-1 gap-3 px-4">
                <Search className="h-5 w-5 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company" 
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="h-8 w-px bg-neutral-800 hidden md:block"></div>
              <div className="flex items-center flex-1 gap-3 px-4">
                <Briefcase className="h-5 w-5 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Location or remote" 
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-neutral-500"
                />
              </div>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                Search Jobs
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">50K+</div>
              <div className="text-neutral-500">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">10K+</div>
              <div className="text-neutral-500">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">100K+</div>
              <div className="text-neutral-500">Hired</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Users className="h-5 w-5" />
              Find Jobs
            </Button>
            <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 gap-2">
              Post a Job
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
