import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  FileText,
  Eye,
  Mail,
  ArrowRight,
  Search,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useAuth } from '@/providers/AuthProvider'
import { useDashboardData } from '@/lib/api-hooks'

const statusConfig: Record<string, { label: string; variant: 'default' | 'destructive' | 'outline'; icon: typeof Clock }> = {
  PENDING: { label: 'Pending', variant: 'outline', icon: Clock },
  REVIEWING: { label: 'Reviewing', variant: 'default', icon: AlertCircle },
  SHORTLISTED: { label: 'Shortlisted', variant: 'default', icon: CheckCircle },
  INTERVIEW: { label: 'Interview', variant: 'default', icon: AlertCircle },
  OFFERED: { label: 'Offered', variant: 'default', icon: CheckCircle },
  HIRED: { label: 'Hired', variant: 'default', icon: CheckCircle },
  REJECTED: { label: 'Rejected', variant: 'destructive', icon: XCircle },
  WITHDRAWN: { label: 'Withdrawn', variant: 'outline', icon: Clock },
}

function getStatusConfig(status: string) {
  return statusConfig[status] || statusConfig.pending
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const { user } = useAuth()
  const reduced = useReducedMotion()
  const { data, loading, error, refresh } = useDashboardData(user?.email)

  const stats = data?.stats
  const recentApplications: any[] = data?.recentApplications || []

  if (loading) {
    return (
        <DashboardSkeleton />
    )
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-400" />
              <p className="text-neutral-400">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
    )
  }

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          variants={reduced ? undefined : containerVariants}
          initial={reduced ? undefined : 'hidden'}
          animate={reduced ? undefined : 'visible'}
          className="space-y-8"
        >
          {/* Welcome */}
          <motion.div variants={reduced ? undefined : itemVariants} className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Welcome back, {user?.name || 'User'}
              </h1>
              <p className="text-sm text-neutral-400">
                Here&apos;s what&apos;s happening with your account today.
              </p>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
              title="Refresh dashboard"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={reduced ? undefined : itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-xl bg-emerald-500/10 p-3">
                  <FileText className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.totalApplications ?? 0}</p>
                  <p className="text-xs text-neutral-400">Total Applications</p>
                </div>
              </CardContent>
            </Card>

            {user?.isEmployer && (
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-xl bg-blue-500/10 p-3">
                    <Briefcase className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.activeJobs ?? 0}</p>
                    <p className="text-xs text-neutral-400">Active Jobs</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <Eye className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.profileViews ?? 0}</p>
                  <p className="text-xs text-neutral-400">Profile Views</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-xl bg-amber-500/10 p-3">
                  <Mail className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.messages ?? 0}</p>
                  <p className="text-xs text-neutral-400">Messages</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Applications */}
          <motion.div variants={reduced ? undefined : itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Recent Applications</h2>
                  <Link
                    to="/applications"
                    className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Send className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400 mb-4">No applications yet</p>
                    <Button asChild>
                      <Link to="/jobs">Browse Jobs</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((app: any, i: number) => {
                      const status = getStatusConfig(app.status)
                      const StatusIcon = status.icon
                      return (
                        <motion.div
                          key={app.id || i}
                          initial={reduced ? undefined : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduced ? 0 : i * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="rounded-lg bg-white/5 p-2 shrink-0">
                              <Briefcase className="h-4 w-4 text-neutral-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {app.job?.title || app.jobTitle || 'Untitled Position'}
                              </p>
                              <p className="text-xs text-neutral-400 truncate">
                                {app.job?.company?.companyName || app.job?.company || 'Unknown Company'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-3">
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500">
                              <Clock className="h-3 w-3" />
                              {app.appliedAt || app.createdAt
                                ? new Date(app.appliedAt || app.createdAt).toLocaleDateString()
                                : ''}
                            </div>
                            <Badge variant={status.variant}>
                              <StatusIcon className="h-3 w-3 mr-1 inline" />
                              {status.label}
                            </Badge>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={reduced ? undefined : itemVariants}>
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button asChild variant="outline" className="h-auto py-4 justify-start gap-3">
                <Link to="/jobs">
                  <Search className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Browse Jobs</p>
                    <p className="text-xs text-neutral-500 font-normal">Find your next opportunity</p>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 justify-start gap-3">
                <Link to="/applications">
                  <FileText className="h-5 w-5 text-blue-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium">View Applications</p>
                    <p className="text-xs text-neutral-500 font-normal">Track your progress</p>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 justify-start gap-3">
                <Link to="/profile">
                  <User className="h-5 w-5 text-purple-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Edit Profile</p>
                    <p className="text-xs text-neutral-500 font-normal">Update your details</p>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 justify-start gap-3">
                <Link to="/messages">
                  <Mail className="h-5 w-5 text-amber-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Messages</p>
                    <p className="text-xs text-neutral-500 font-normal">View your inbox</p>
                  </div>
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
  )
}
