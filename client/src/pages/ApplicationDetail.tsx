import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Mail, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useApplication } from '@/lib/api-hooks'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatRelativeTime } from '@/lib/mappers'

const statusColor: Record<string, string> = {
  PENDING: 'text-yellow-400 bg-yellow-500/10',
  REVIEWING: 'text-blue-400 bg-blue-500/10',
  SHORTLISTED: 'text-emerald-400 bg-emerald-500/10',
  INTERVIEW: 'text-purple-400 bg-purple-500/10',
  OFFERED: 'text-emerald-400 bg-emerald-500/10',
  HIRED: 'text-green-400 bg-green-500/10',
  REJECTED: 'text-red-400 bg-red-500/10',
  WITHDRAWN: 'text-neutral-400 bg-white/5',
}

export default function ApplicationDetail() {
  const { id } = useParams()
  const reduced = useReducedMotion()
  const { application, loading, error } = useApplication(id)

  if (loading) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
    )
  }

  if (error || !application) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-neutral-400 mb-4">{error || 'Application not found'}</p>
          <Link to="/applications">
            <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Applications</Button>
          </Link>
        </div>
    )
  }

  return (
      <div className="container px-4 md:px-6 py-16 sm:py-20 max-w-4xl mx-auto">
        <motion.div initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/applications" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-emerald-400" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {application.job?.title || 'Application'}
                </h1>
                <p className="text-sm text-neutral-400">{application.job?.company?.companyName}</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor[application.status] || 'text-neutral-400 bg-white/5'}`}>
              {application.status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                    {application.coverLetter || 'No cover letter provided'}
                  </p>
                </CardContent>
              </Card>

              {application.employerNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Employer Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">{application.employerNotes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Mail className="h-4 w-4 text-emerald-400" />
                    <span>{application.candidate?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <span>Applied {formatRelativeTime(application.appliedAt)}</span>
                  </div>
                </CardContent>
              </Card>

              <Link to={`/jobs/${application.job?.slug}`}>
                <Button variant="outline" className="w-full border-white/10">
                  View Job Posting
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
  )
}
