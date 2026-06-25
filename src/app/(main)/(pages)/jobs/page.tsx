'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import ApplyJobModal, { JobApplicationData } from '@/components/forms/ApplyJobModal'
import { 
  Search, MapPin, Clock, DollarSign, Briefcase, Filter, ChevronDown, Loader2
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SaveJobButton } from '@/components/global/save-job-button'

interface JobListing {
  id: number
  title: string
  slug: string
  description: string
  jobType: string
  experienceLevel: string
  workMode: string
  location: string
  city: string
  remoteWork: boolean
  salaryMin: number
  salaryMax: number
  salaryCurrency: string
  applicationsCount: number
  publishedAt: string
  company: { companyName: string; companyLogo: string; city: string }
  skills: string[]
  source?: string
}

const jobTypes = ['', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']
const jobTypeLabels: Record<string, string> = { '': 'All', FULL_TIME: 'Full Time', PART_TIME: 'Part Time', CONTRACT: 'Contract', INTERNSHIP: 'Internship' }
const experienceLevels = ['', 'ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']
const expLabels: Record<string, string> = { '': 'All Levels', ENTRY: 'Entry', JUNIOR: 'Junior', MID: 'Mid', SENIOR: 'Senior', LEAD: 'Lead' }
const workModes = ['', 'ONSITE', 'REMOTE', 'HYBRID']
const workLabels: Record<string, string> = { '': 'All', ONSITE: 'On-site', REMOTE: 'Remote', HYBRID: 'Hybrid' }

export default function JobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [selectedWorkMode, setSelectedWorkMode] = useState('')
  const [selectedSort, setSelectedSort] = useState('recent')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobApplicationData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (location) params.set('location', location)
      if (selectedType) params.set('jobType', selectedType)
      if (selectedExperience) params.set('experience', selectedExperience)
      if (selectedWorkMode) params.set('workMode', selectedWorkMode)
      if (selectedSort) params.set('sort', selectedSort)
      params.set('page', page.toString())
      params.set('limit', '12')

      const res = await fetch(`/api/jobs?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch jobs')
      const data = await res.json()
      setJobs(data.jobs || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, location, selectedType, selectedExperience, selectedWorkMode, selectedSort, page])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleSearch = () => {
    setPage(1)
  }

  const openApplyModal = (job: JobListing) => {
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: job.salaryCurrency || 'USD', maximumFractionDigits: 0 }).format(n)
    const salaryRange = job.salaryMin && job.salaryMax ? `${fmt(job.salaryMin)} - ${fmt(job.salaryMax)}` : undefined
    setSelectedJob({
      id: job.id,
      title: job.title,
      company: job.company?.companyName || '',
      location: job.location || job.city,
      jobType: jobTypeLabels[job.jobType] || job.jobType,
      salaryRange,
      requiredSkills: job.skills || [],
      remoteWork: job.remoteWork,
    })
    setIsModalOpen(true)
  }

  const handleSubmitApplication = async (applicationData: {
    jobId: number | undefined
    jobTitle: string
    companyName: string
    coverLetter: string
    resumeUrl?: string
  }) => {
    const res = await fetch(`/api/jobs/${applicationData.jobId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coverLetter: applicationData.coverLetter,
        resumeUrl: applicationData.resumeUrl,
      }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed to apply')
    }
    setIsModalOpen(false)
    setSelectedJob(null)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border">
        <div className="container px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Find Your Dream Job</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Job title, keywords, or company" 
                className="pl-10 bg-muted border text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="City, state, or remote" 
                className="pl-10 bg-muted border text-foreground"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSearch}>Search Jobs</Button>
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="border text-muted-foreground hover:text-foreground"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Job Type</label>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? 'default' : 'outline'}
                      size="sm"
                      className={selectedType === type ? 'bg-emerald-600' : 'border'}
                      onClick={() => { setSelectedType(type); setPage(1); }}
                    >
                      {jobTypeLabels[type]}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Experience</label>
                <div className="flex flex-wrap gap-2">
                  {experienceLevels.map((level) => (
                    <Button
                      key={level}
                      variant={selectedExperience === level ? 'default' : 'outline'}
                      size="sm"
                      className={selectedExperience === level ? 'bg-emerald-600' : 'border'}
                      onClick={() => { setSelectedExperience(level); setPage(1); }}
                    >
                      {expLabels[level]}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Work Mode</label>
                <div className="flex flex-wrap gap-2">
                  {workModes.map((mode) => (
                    <Button
                      key={mode}
                      variant={selectedWorkMode === mode ? 'default' : 'outline'}
                      size="sm"
                      className={selectedWorkMode === mode ? 'bg-emerald-600' : 'border'}
                      onClick={() => { setSelectedWorkMode(mode); setPage(1); }}
                    >
                      {workLabels[mode]}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Sort By</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'recent', label: 'Most Recent' },
                    { value: 'salary_high', label: 'Highest Salary' },
                    { value: 'salary_low', label: 'Lowest Salary' },
                  ].map((opt) => (
                    <Button
                      key={opt.value}
                      variant={selectedSort === opt.value ? 'default' : 'outline'}
                      size="sm"
                      className={selectedSort === opt.value ? 'bg-emerald-600' : 'border'}
                      onClick={() => { setSelectedSort(opt.value); setPage(1); }}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="container px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={handleSearch} variant="outline">Try Again</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">{total} job{total !== 1 ? 's' : ''} found</p>
            </div>
            
            {jobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <Image
                    src="/images/No%20Jobs.png"
                    alt="No jobs found"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl text-foreground font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="bg-card/50 border hover:border-emerald-500/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {job.company?.companyLogo ? (
                            <Image src={job.company.companyLogo} alt={job.company.companyName} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                          ) : (
                            <Image
                              src="/images/Company%20Avatar%20Placeholder.png"
                              alt=""
                              width={64}
                              height={64}
                              className="object-cover opacity-60"
                            />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground hover:text-emerald-400">
                                <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
                              </h3>
                              <p className="text-muted-foreground">{job.company?.companyName}</p>
                              {job.source === 'jobicy' && (
                                <Badge className="ml-2 bg-blue-500/20 text-blue-400 text-xs">Jobicy</Badge>
                              )}
                            </div>
                            <SaveJobButton jobId={job.id} />
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" /> {job.location || job.city || 'Remote'}
                              {job.remoteWork && <Badge variant="outline" className="ml-2 text-xs border-emerald-500/30 text-emerald-400">Remote</Badge>}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" /> {jobTypeLabels[job.jobType] || job.jobType}
                            </span>
                            {job.salaryMin && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" /> 
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: job.salaryCurrency || 'USD', maximumFractionDigits: 0 }).format(job.salaryMin)}
                                {job.salaryMax ? ` - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: job.salaryCurrency || 'USD', maximumFractionDigits: 0 }).format(job.salaryMax)}` : ''}
                              </span>
                            )}
                            {job.publishedAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {new Date(job.publishedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills?.map((skill) => (
                              <Badge key={skill} variant="outline" className="border text-muted-foreground">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => openApplyModal(job)}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  className="border"
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="flex items-center text-muted-foreground px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  className="border"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <ApplyJobModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedJob(null) }}
        job={selectedJob || undefined}
        onSubmit={handleSubmitApplication}
      />
    </div>
  )
}
