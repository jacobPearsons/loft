import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ApplicationListSkeleton from '@/components/skeletons/ApplicationListSkeleton'
import { useApplications } from '@/lib/api-hooks'
import { useAuth } from '@/providers/AuthProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatRelativeTime } from '@/lib/mappers'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'outline',
  REVIEWING: 'default',
  SHORTLISTED: 'default',
  INTERVIEW: 'default',
  OFFERED: 'default',
  HIRED: 'default',
  REJECTED: 'destructive',
  WITHDRAWN: 'outline',
}

export default function Applications() {
  const { user } = useAuth()
  const reduced = useReducedMotion()
  const { applications, loading } = useApplications(user?.email)

  return (
      <div className="container px-4 md:px-6 py-16 sm:py-20 max-w-4xl mx-auto">
        <motion.div initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-6 w-6 text-emerald-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">My Applications</h1>
              <p className="text-sm text-neutral-400 mt-1">Track your job applications</p>
            </div>
          </div>

          {loading ? (
            <ApplicationListSkeleton />
          ) : applications.length === 0 ? (
            <div className="text-center py-20">
              <img
                src="/images/No%20Applications.png"
                alt="No applications yet"
                className="w-48 h-48 object-contain mx-auto mb-4 opacity-60"
              />
              <p className="text-neutral-400 mb-2">No applications yet</p>
              <p className="text-sm text-neutral-500">Start applying to jobs to see them here</p>
              <Link to="/jobs" className="inline-block mt-4 text-sm text-emerald-400 hover:text-emerald-300 font-medium">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: reduced ? 0 : i * 0.05 }}
                >
                  <Link to={`/applications/${app.id}`}>
                    <Card className="hover:border-emerald-500/30 transition-all duration-300 group">
                      <CardContent className="p-4 sm:p-6 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                            {app.job?.company?.companyLogo ? (
                              <img src={app.job.company.companyLogo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <img
                                src="/images/Company%20Avatar%20Placeholder.png"
                                alt=""
                                className="w-full h-full object-cover opacity-60"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors truncate">
                              {app.job?.title || 'Position'}
                            </h3>
                            <p className="text-sm text-neutral-400 truncate">{app.job?.company?.companyName || 'Company'}</p>
                            <p className="text-xs text-neutral-500 mt-1">
                              Applied {formatRelativeTime(app.appliedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge variant={statusVariant[app.status] || 'outline'}>
                            {app.status}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-emerald-400 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
  )
}
