'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ApplyJobModal, { JobApplicationData } from '@/components/forms/ApplyJobModal'
import {
  Briefcase, MapPin, DollarSign, Eye, Users, ArrowLeft, Building, Globe, Loader2, AlertCircle, ExternalLink,
  Bookmark, Twitter, Linkedin, Mail, Link as LinkIcon, Check
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SaveJobButton } from '@/components/global/save-job-button'

interface JobDetail {
  id: number
  title: string
  description: string
  requirements?: string
  benefits?: string
  jobType: string
  experienceLevel: string
  workMode: string
  location: string
  city: string
  remoteWork: boolean
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  salaryPeriod?: string
  isSalaryVisible?: boolean
  requiredSkills: string[]
  preferredSkills?: string[]
  status?: string
  isFeatured?: boolean
  viewsCount?: number
  applicationsCount?: number
  publishedAt?: string
  deadline?: string
  company?: {
    companyName: string
    companyLogo?: string
    city?: string
    industry?: string
    description?: string
    companySize?: string
    hiringMode?: string
  }
  source?: string
}

const jobLabels: Record<string, string> = {
  FULL_TIME: 'Full Time', PART_TIME: 'Part Time', CONTRACT: 'Contract',
  INTERNSHIP: 'Internship', TEMPORARY: 'Temporary',
}

const expLabels: Record<string, string> = {
  ENTRY: 'Entry Level', JUNIOR: 'Junior', MID: 'Mid-Level', SENIOR: 'Senior', LEAD: 'Lead', EXECUTIVE: 'Executive',
}

const workLabels: Record<string, string> = {
  ONSITE: 'On-site', REMOTE: 'Remote', HYBRID: 'Hybrid',
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const slug = typeof params.slug === 'string' ? params.slug : ''

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/jobs/${encodeURIComponent(slug)}`)
        if (!res.ok) throw new Error('Job not found')
        const data = await res.json()
        setJob(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job')
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchJob()
  }, [slug])

  const formatSalary = () => {
    if (!job) return null
    if (job.isSalaryVisible === false) return 'Not disclosed'
    const currency = job.salaryCurrency || 'USD'
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
    if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} - ${fmt(job.salaryMax)}`
    if (job.salaryMin) return `From ${fmt(job.salaryMin)}`
    if (job.salaryMax) return `Up to ${fmt(job.salaryMax)}`
    return null
  }

  const handleSaveJob = () => {
    setIsSaved(!isSaved)
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = job ? `${job.title} at ${job.company?.companyName}` : ''

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank')
        break
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`)
        break
      case 'link':
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{error || 'Job not found'}</p>
          <Link href="/jobs"><Button>Back to Jobs</Button></Link>
        </div>
      </div>
    )
  }

  const isRemote = job.source === 'jobicy'

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border bg-card">
        <div className="container px-4 py-4">
          <Link href="/jobs" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
          </Link>
        </div>
      </div>

      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:flex lg:gap-8"
        >
          {/* Main Content */}
          <section className="lg:grow lg:order-1">
            {/* Job Header */}
            <Card className="bg-card border mb-6">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground break-words">{job.title}</h1>
                      {job.isFeatured && <Badge className="bg-emerald-500/20 text-emerald-400 shrink-0">Featured</Badge>}
                      {isRemote && <Badge className="bg-blue-500/20 text-blue-400 shrink-0">Jobicy</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="w-4 h-4" />
                      <span>{job.company?.companyName}</span>
                      {job.company?.city && <><span>·</span><MapPin className="w-4 h-4" /><span>{job.company.city}</span></>}
                    </div>
                  </div>
                  <div className="hidden lg:flex gap-2 items-center">
                    <SaveJobButton jobId={job.id} />
                    {!isRemote && (
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsModalOpen(true)}>
                        Apply Now
                      </Button>
                    )}
                    {isRemote && (
                      <a href={`https://jobicy.com/jobs/${slug}`} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          <ExternalLink className="w-4 h-4 mr-2" /> Apply on Jobicy
                        </Button>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <Badge variant="outline" className="border text-foreground/80">
                    <Briefcase className="w-3 h-3 mr-1" /> {jobLabels[job.jobType] || job.jobType}
                  </Badge>
                  <Badge variant="outline" className="border text-foreground/80">
                    {expLabels[job.experienceLevel] || job.experienceLevel}
                  </Badge>
                  <Badge variant="outline" className="border text-foreground/80">
                    <Globe className="w-3 h-3 mr-1" /> {workLabels[job.workMode] || job.workMode}
                  </Badge>
                  {job.remoteWork && <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">Remote</Badge>}
                </div>

                {!isRemote && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <p className="text-foreground font-semibold">{formatSalary() || 'Not disclosed'}</p>
                      <p className="text-xs text-muted-foreground">Salary</p>
                    </div>
                    <div className="text-center">
                      <MapPin className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <p className="text-foreground font-semibold">{job.location || job.city || 'Remote'}</p>
                      <p className="text-xs text-muted-foreground">Location</p>
                    </div>
                    <div className="text-center">
                      <Eye className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <p className="text-foreground font-semibold">{job.viewsCount ?? '-'}</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div className="text-center">
                      <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <p className="text-foreground font-semibold">{job.applicationsCount ?? '-'}</p>
                      <p className="text-xs text-muted-foreground">Applicants</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mobile Apply + Save */}
            <div className="flex gap-2 mb-6 lg:hidden">
              <Button
                variant="outline"
                className={`flex-1 gap-2 ${isSaved ? 'border-emerald-500/30 text-emerald-400' : ''}`}
                onClick={handleSaveJob}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-400' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              {!isRemote ? (
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsModalOpen(true)}>
                  Apply Now
                </Button>
              ) : (
                <a href={`https://jobicy.com/jobs/${slug}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <ExternalLink className="w-4 h-4 mr-2" /> Apply
                  </Button>
                </a>
              )}
            </div>

            <div className="space-y-6">
              {/* Skills */}
              {job.requiredSkills.length > 0 && (
                <Card className="bg-card border overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-emerald-500/50 to-emerald-500/10" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="p-1.5 rounded-md bg-emerald-500/10">
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">Required Skills</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, i) => (
                        <Link key={i} href={`/jobs?skill=${encodeURIComponent(skill)}`}>
                          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer transition-all px-3 py-1 text-sm font-medium">
                            {skill}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card className="bg-card border overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500/50 to-blue-500/10" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="p-1.5 rounded-md bg-blue-500/10">
                      <Globe className="w-4 h-4 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Description</h2>
                  </div>
                  <div className="text-foreground/80 leading-[1.8] whitespace-pre-wrap text-[0.95rem]">{job.description}</div>
                </CardContent>
              </Card>

              {/* Requirements */}
              {job.requirements && (
                <Card className="bg-card border overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-amber-500/50 to-amber-500/10" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="p-1.5 rounded-md bg-amber-500/10">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">Requirements</h2>
                    </div>
                    {job.requirements.includes('\n') ? (
                      <ul className="space-y-3">
                        {job.requirements.split('\n').filter(Boolean).map((req, i) => (
                          <li key={i} className="flex items-start gap-3 text-foreground/80 leading-relaxed">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                              <span className="text-xs font-bold">{i + 1}</span>
                            </span>
                            <span className="text-[0.95rem]">{req}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-[0.95rem]">{job.requirements}</div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits && (
                <Card className="bg-card border overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-emerald-500/50 to-emerald-500/10" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-1.5 rounded-md bg-emerald-500/10">
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">Benefits & Perks</h2>
                    </div>
                    {job.benefits.includes('\n') ? (
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {job.benefits.split('\n').filter(Boolean).map((benefit, i) => (
                          <div
                            key={i}
                            className="group flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/[0.06] to-transparent border border-emerald-500/10 hover:border-emerald-500/25 hover:from-emerald-500/[0.10] transition-all duration-200"
                          >
                            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all duration-200">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-foreground/80 text-[0.9rem] leading-snug font-medium">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500/[0.06] to-transparent border border-emerald-500/10 hover:border-emerald-500/25 hover:from-emerald-500/[0.10] transition-all duration-200">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all duration-200">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-foreground/80 text-[0.95rem] leading-relaxed font-medium">{job.benefits}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Apply CTA */}
              <Card className="bg-card border overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 mb-4">
                    <Briefcase className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Interested in this job?</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Apply now and take the first step towards your new career!
                  </p>
                  {!isRemote ? (
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 px-8 h-12 text-base" onClick={() => setIsModalOpen(true)}>
                      Apply for this Position
                    </Button>
                  ) : (
                    <div>
                      <a href={`https://jobicy.com/jobs/${slug}`} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 px-8 h-12 text-base">
                          <ExternalLink className="w-5 h-5 mr-2" /> Apply on Employer&apos;s Website
                        </Button>
                      </a>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        You will be redirected to an external application form.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bottom Share */}
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Share this job</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 transition-colors"
                      aria-label="Share via Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('link')}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400 transition-colors"
                      aria-label="Copy link"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-80 lg:shrink-0 lg:order-2">
            <div className="sticky top-8">
              <div className="border rounded-xl p-6 bg-card">
                {/* Company Logo & Name */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                    {job.company?.companyLogo && !logoError ? (
                      <Image
                        src={job.company.companyLogo}
                        alt={`${job.company.companyName} logo`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                        onError={() => setLogoError(true)}
                      />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">
                        {job.company?.companyName?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{job.company?.companyName}</h2>
                  </div>
                </div>

                {/* Company Stats */}
                <div className="space-y-3 mb-6">
                  {job.company?.industry && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building className="w-3.5 h-3.5 mr-3 shrink-0" />
                      <span>{job.company.industry}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-3.5 h-3.5 mr-3 shrink-0" />
                    <span>Active employer</span>
                  </div>
                  {job.company?.hiringMode && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="w-3.5 h-3.5 mr-3 shrink-0" />
                      <span>Hiring mode: {job.company.hiringMode}</span>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <Button
                  variant="outline"
                  className={`w-full gap-2 mb-3 ${isSaved ? 'border-emerald-500/30 text-emerald-400' : ''}`}
                  onClick={handleSaveJob}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-400' : ''}`} />
                  {isSaved ? 'Saved' : 'Save job'}
                </Button>

                {/* Apply Button */}
                {!isRemote ? (
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mb-3" onClick={() => setIsModalOpen(true)}>
                    Apply Now
                  </Button>
                ) : (
                  <a href={`https://jobicy.com/jobs/${slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mb-3">
                      <ExternalLink className="w-4 h-4 mr-2" /> Apply on Jobicy
                    </Button>
                  </a>
                )}

                {/* View Company Profile */}
                <div className="text-center mt-4 mb-6">
                  <span className="text-sm font-medium text-emerald-400 hover:underline cursor-pointer">
                    View company profile →
                  </span>
                </div>

                {/* Share Section */}
                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Share this job</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 transition-colors"
                      aria-label="Share via Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('link')}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400 transition-colors"
                      aria-label="Copy link"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Promo Section */}
                <div className="bg-emerald-500/5 rounded-2xl p-6 mt-6 border border-emerald-500/10">
                  <h2 className="text-lg font-bold mb-3 text-foreground">
                    Tired of Manually Applying?
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Set your preferences and let AI handle the job search while you sleep.
                  </p>
                  <ul className="mb-6 text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                      <span>Applies for jobs that match your skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                      <span>Tailors your resume automatically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                      <span>Works 24/7</span>
                    </li>
                  </ul>
                  <Link href="/job-copilot">
                    <Button variant="outline" className="w-full">
                      Activate JobCopilot
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </motion.div>
      </div>

      {!isRemote && job && (
        <ApplyJobModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          job={{
            id: job.id,
            title: job.title,
            company: job.company?.companyName || '',
            location: job.location || job.city,
            jobType: jobLabels[job.jobType] || job.jobType,
            salaryRange: formatSalary() || undefined,
            description: job.description,
            requiredSkills: job.requiredSkills,
            remoteWork: job.remoteWork,
          }}
          onSubmit={async (applicationData) => {
            const res = await fetch(`/api/jobs/${encodeURIComponent(slug)}/apply`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                coverLetter: applicationData.coverLetter,
                resumeUrl: applicationData.resumeUrl,
              }),
            })
            if (!res.ok) throw new Error('Failed to apply')
            setIsModalOpen(false)
            router.push('/dashboard')
          }}
        />
      )}
    </div>
  )
}
