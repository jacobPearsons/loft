'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, MapPin, Clock, ArrowLeft, Loader2, AlertCircle, Calendar, Building, FileText } from 'lucide-react'
import Link from 'next/link'

interface ApplicationDetail {
  id: number
  jobId: number
  status: string
  coverLetter: string
  resumeUrl: string
  appliedAt: string
  reviewedAt: string
  interviewAt: string
  rejectedAt: string
  acceptedAt: string
  employerNotes: string
  englishTestRequired: boolean
  englishTestScore: number
  passedScreening: boolean
  job: {
    id: number
    title: string
    slug: string
    location: string
    city: string
    jobType: string
    experienceLevel: string
    workMode: string
    salaryMin: number
    salaryMax: number
    salaryCurrency: string
    skills: string[]
    company: { companyName: string; companyLogo: string; city: string; industry: string }
  }
  candidate: { firstName: string; lastName: string; email: string; profileImage: string }
  interview: {
    id: number
    scheduledAt: string
    duration: number
    type: string
    meetingLink: string
    location: string
    status: string
    feedback: string
    rating: number
  }
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  REVIEWING: 'bg-blue-500/20 text-blue-400',
  SHORTLISTED: 'bg-purple-500/20 text-purple-400',
  INTERVIEW: 'bg-emerald-500/20 text-emerald-400',
  OFFERED: 'bg-green-500/20 text-green-400',
  HIRED: 'bg-emerald-500/20 text-emerald-400',
  REJECTED: 'bg-red-500/20 text-red-400',
  WITHDRAWN: 'bg-neutral-500/20 text-muted-foreground',
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const [app, setApp] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchApplication() {
      try {
        const res = await fetch(`/api/applications/${params.id}`)
        if (!res.ok) throw new Error('Application not found')
        const data = await res.json()
        setApp(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetchApplication()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-muted-foreground">{error || 'Application not found'}</p>
          <Link href="/applications"><Button className="mt-4">Back to Applications</Button></Link>
        </div>
      </div>
    )
  }

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/applications" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applications
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{app.job.title}</h1>
              <Badge className={`${statusColors[app.status] || ''}`}>{app.status}</Badge>
            </div>
            <p className="text-muted-foreground text-lg">{app.job.company?.companyName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-card border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Application Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Applied</p>
                      <p className="text-foreground">{formatDate(app.appliedAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={`${statusColors[app.status] || ''}`}>{app.status}</Badge>
                    </div>
                    {app.reviewedAt && <div><p className="text-sm text-muted-foreground">Reviewed</p><p className="text-foreground">{formatDate(app.reviewedAt)}</p></div>}
                    {app.interviewAt && <div><p className="text-sm text-muted-foreground">Interview</p><p className="text-foreground">{formatDate(app.interviewAt)}</p></div>}
                    {app.acceptedAt && <div><p className="text-sm text-muted-foreground">Accepted</p><p className="text-foreground">{formatDate(app.acceptedAt)}</p></div>}
                    {app.rejectedAt && <div><p className="text-sm text-muted-foreground">Rejected</p><p className="text-foreground">{formatDate(app.rejectedAt)}</p></div>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {app.coverLetter && (
              <Card className="bg-card border">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">Cover Letter</h2>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
                </CardContent>
              </Card>
            )}

            {app.employerNotes && (
              <Card className="bg-card border">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">Employer Notes</h2>
                  <p className="text-foreground/80 leading-relaxed">{app.employerNotes}</p>
                </CardContent>
              </Card>
            )}

            {app.interview && (
              <Card className="bg-card border border-emerald-500/30">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" /> Interview Scheduled
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span>{formatDate(app.interview.scheduledAt)} ({app.interview.duration} min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      <span>{app.interview.type}</span>
                    </div>
                    {app.interview.meetingLink && (
                      <a href={app.interview.meetingLink} target="_blank" className="inline-block">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">Join Meeting</Button>
                      </a>
                    )}
                    {app.interview.feedback && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Feedback</p>
                        <p className="text-foreground/80">{app.interview.feedback}</p>
                        {app.interview.rating && (
                          <p className="text-sm text-emerald-400 mt-2">Rating: {app.interview.rating}/5</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-card border">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Job Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-foreground/80">
                    <MapPin className="w-4 h-4 text-muted-foreground" /> {app.job.location || app.job.city || 'Remote'}
                  </div>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Briefcase className="w-4 h-4 text-muted-foreground" /> {app.job.jobType}
                  </div>
                  {app.job.skills?.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {app.job.skills.map((s, i) => (
                          <Badge key={i} variant="outline" className="border text-muted-foreground text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Link href={`/jobs/${app.job.id}`}>
              <Button variant="outline" className="w-full border">
                <FileText className="w-4 h-4 mr-2" /> View Job Posting
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
