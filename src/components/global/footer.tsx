'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react'
import { LogoWithText } from './logo'

export function Footer() {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-800">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <LogoWithText />
            </Link>
            <p className="text-neutral-400 text-sm">
              Your trusted platform for finding your dream job and connecting with top employers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* For Job Seekers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">For Job Seekers</h3>
            <ul className="space-y-2">
              <li><Link href="/jobs" className="text-neutral-400 hover:text-emerald-400 text-sm">Browse Jobs</Link></li>
              <li><Link href="/companies" className="text-neutral-400 hover:text-emerald-400 text-sm">Companies</Link></li>
              <li><Link href="/salaries" className="text-neutral-400 hover:text-emerald-400 text-sm">Salaries</Link></li>
              <li><Link href="/interviews" className="text-neutral-400 hover:text-emerald-400 text-sm">Interview Prep</Link></li>
            </ul>
          </div>
          
          {/* For Employers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">For Employers</h3>
            <ul className="space-y-2">
              <li><Link href="/post-job" className="text-neutral-400 hover:text-emerald-400 text-sm">Post a Job</Link></li>
              <li><Link href="/talent-search" className="text-neutral-400 hover:text-emerald-400 text-sm">Search Talent</Link></li>
              <li><Link href="/pricing" className="text-neutral-400 hover:text-emerald-400 text-sm">Pricing</Link></li>
              <li><Link href="/employer-branding" className="text-neutral-400 hover:text-emerald-400 text-sm">Employer Branding</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-neutral-400 hover:text-emerald-400 text-sm">Blog</Link></li>
              <li><Link href="/help" className="text-neutral-400 hover:text-emerald-400 text-sm">Help Center</Link></li>
              <li><Link href="/privacy" className="text-neutral-400 hover:text-emerald-400 text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-neutral-400 hover:text-emerald-400 text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} LoftCommunity. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-neutral-500 hover:text-white text-sm">Privacy</Link>
            <Link href="/terms" className="text-neutral-500 hover:text-white text-sm">Terms</Link>
            <Link href="/cookies" className="text-neutral-500 hover:text-white text-sm">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
