'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ApplyJobModal, { JobApplicationData } from '@/components/forms/ApplyJobModal'
import { 
  Briefcase, MapPin, Clock, DollarSign, Calendar, Eye, Users, ArrowLeft, Building, Globe, Loader2, AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface JobDetail {
  id: number
  title: string
  description: string
  requirements: string
  benefits: string
  jobType: string
  experienceLevel: string
  workMode: string
  location: string
  city: string
  remoteWork: boolean
  salaryMin: number
  salaryMax: number
  salaryCurrency: string
  salaryPeriod: string
  isSalaryVisible: boolean
  requiredSkills: string[]
  preferredSkills: string[]
  status: string
  isFeatured: boolean
  viewsCount: number
  applicationsCount: number
  publishedAt: string
  deadline: string
  company: {
    companyName: string
    companyLogo: string
    city: string
    industry: string
    description: string
    companySize: string
    hiringMode: string
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${params.id}`)
        if (!res.ok) throw new Error('Job not found')
        const data = await res.json()
        setJob(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job')
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [params.id])

  const onSubmit = async (applicationData: {
    jobId: number | undefined
    jobTitle: string
    companyName: string
    coverLetter: string
    resumeUrl?: string
  }) => {
    const res = await fetch(`/api/jobs/${params.id}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coverLetter: applicationData.coverLetter }),
    })
    if (!res.ok) throw new Error('Failed to apply')
    setIsModalOpen(false)
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

  const formatSalary = () => {
    if (!job.isSalaryVisible) return 'Not disclosed'
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: job.salaryCurrency, maximumFractionDigits: 0 }).format(n)
    if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} - ${fmt(job.salaryMax)}`
    if (job.salaryMin) return `From ${fmt(job.salaryMin)}`
    if (job.salaryMax) return `Up to ${fmt(job.salaryMax)}`
    return 'Not disclosed'
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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border bg-card">
        <div className="container px-4 py-4">
          <Link href="/jobs" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
          </Link>
        </div>
      </div>

      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <Card className="bg-card border mb-6">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
                  {job.isFeatured && <Badge className="bg-emerald-500/20 text-emerald-400">Featured</Badge>}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="w-4 h-4" />
                  <span>{job.company?.companyName}</span>
                  {job.company?.city && <><span>·</span><MapPin className="w-4 h-4" /><span>{job.company.city}</span></>}
                </div>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsModalOpen(true)}>
                Apply Now
              </Button>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-foreground font-semibold">{formatSalary()}</p>
                <p className="text-xs text-muted-foreground">Salary</p>
              </div>
              <div className="text-center">
                <MapPin className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-foreground font-semibold">{job.location || job.city || 'Remote'}</p>
                <p className="text-xs text-muted-foreground">Location</p>
              </div>
              <div className="text-center">
                <Eye className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-foreground font-semibold">{job.viewsCount}</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </div>
              <div className="text-center">
                <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-foreground font-semibold">{job.applicationsCount}</p>
                <p className="text-xs text-muted-foreground">Applicants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card border">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
              <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{job.description}</div>
            </CardContent>
          </Card>

          {job.requirements && (
            <Card className="bg-card border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Requirements</h2>
                <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{job.requirements}</div>
              </CardContent>
            </Card>
          )}

          {job.requiredSkills.length > 0 && (
            <Card className="bg-card border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, i) => (
                    <Badge key={i} className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {job.benefits && (
            <Card className="bg-card border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Benefits</h2>
                <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{job.benefits}</div>
              </CardContent>
            </Card>
          )}

          {job.publishedAt && (
            <Card className="bg-card border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-2">About {job.company?.companyName}</h2>
                <div className="text-foreground/80 leading-relaxed">{job.company?.description || 'No company description provided.'}</div>
                {job.company?.industry && (
                  <div className="mt-3 text-muted-foreground text-sm">Industry: {job.company.industry}</div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center py-4">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsModalOpen(true)}>
              Apply for this Position
            </Button>
          </div>
        </div>
      </div>

      <ApplyJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={{
          id: job.id,
          title: job.title,
          company: job.company?.companyName,
          location: job.location || job.city,
          jobType: jobLabels[job.jobType] || job.jobType,
          salaryRange: formatSalary(),
          description: job.description,
          requiredSkills: job.requiredSkills,
          remoteWork: job.remoteWork,
        }}
        onSubmit={onSubmit}
      />
    </div>
  )
}
