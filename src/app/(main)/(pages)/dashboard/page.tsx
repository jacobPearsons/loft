/**
 * Dashboard Page
 * 
 * User dashboard showing personalized job search data.
 * Follows frontend-lifecycle:
 * - UI Composition: Page → Section → Component hierarchy
 * - State Initialization: Uses useDashboardData hook
 * - Data Access: Hook calls service (mock for now)
 */

'use client';

export const dynamic = 'force-dynamic'

import { useDashboardData } from '@/features/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  FileText, 
  Eye, 
  TrendingUp, 
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  UserPlus,
  Upload,
  BookOpen,
  Briefcase as WorkIcon,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { JobSummary, SavedJobItem } from '@/features/dashboard';
import { MapPin, Globe, Bookmark, Flag, Bell } from 'lucide-react';
import { EmailVerificationBanner } from '@/components/global/email-verification-banner';
import { toast } from 'sonner';

/**
 * Get status badge color based on application status
 */
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'interview': 
      return 'bg-emerald-500';
    case 'shortlisted':
      return 'bg-blue-500';
    case 'pending':
    case 'reviewing':
      return 'bg-yellow-500';
    case 'rejected':
    case 'withdrawn':
      return 'bg-red-500';
    case 'offered':
    case 'hired':
      return 'bg-purple-500';
    default:
      return 'bg-neutral-500';
  }
};

/**
 * Format status label for display
 */
const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Profile Completion Component
 * Shows profile completion progress and prompts
 */
function ProfileCompletionSection({ 
  profileCompletion, 
  profileProgress 
}: { 
  profileCompletion: {
    basicInfo: boolean;
    resume: boolean;
    englishTest: boolean;
    workExperience: boolean;
  };
  profileProgress: number;
}) {
  const completionItems = [
    { key: 'basicInfo', label: 'Basic Information', icon: UserPlus, completed: profileCompletion.basicInfo },
    { key: 'resume', label: 'Upload Resume', icon: Upload, completed: profileCompletion.resume },
    { key: 'englishTest', label: 'English Proficiency Test', icon: BookOpen, completed: profileCompletion.englishTest },
    { key: 'workExperience', label: 'Add Work Experience', icon: WorkIcon, completed: profileCompletion.workExperience },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 via-neutral-900 to-neutral-950 p-6 md:p-8"
    >
      {/* Decorative glow */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-500/5 blur-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">Complete Your Profile</h2>
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Unlock personalized job recommendations and stand out to employers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-400">{profileProgress}%</div>
              <div className="text-xs text-muted-foreground">complete</div>
            </div>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="mb-6">
          <Progress 
            value={profileProgress} 
            className="h-2.5 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-300" 
          />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {completionItems.map((item) => (
            <div
              key={item.key}
              className={`rounded-xl border p-4 transition-all ${
                item.completed
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border bg-card/50 hover:border-emerald-500/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                {item.completed ? (
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                ) : (
                  <item.icon className="h-6 w-6 text-muted-foreground" />
                )}
                <span className={`text-xs font-medium ${item.completed ? 'text-emerald-300' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
                {!item.completed && (
                  <Link href="/profile" className="mt-1">
                    <Button size="sm" className="h-10 px-3 text-xs bg-emerald-600 hover:bg-emerald-700">
                      Add
                    </Button>
                  </Link>
                )}
                {item.completed && (
                  <span className="text-[10px] text-emerald-500/60 mt-1">Done</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-4">
          <Link href="/profile" className="block">
            <Button variant="outline" className="w-full border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200">
              Go to Profile Settings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Stats Card Component
 */
function StatsCard({ 
  label, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'positive' 
}: { 
  label: string; 
  value: string | number; 
  icon: React.ElementType; 
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}) {
  const changeColor = changeType === 'positive' ? 'text-emerald-400' : changeType === 'negative' ? 'text-red-400' : 'text-muted-foreground';

  return (
    <Card className="bg-card border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/20">
            <Icon className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className={`h-4 w-4 ${changeColor}`} />
            <span className={`${changeColor} text-sm`}>{change}</span>
            <span className="text-muted-foreground text-sm">this month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Loading State Component
 */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
      <p className="text-muted-foreground">Loading your dashboard...</p>
    </div>
  );
}

/**
 * Error State Component
 */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button onClick={onRetry} variant="outline" className="border">
        Try Again
      </Button>
    </div>
  );
}

/**
 * Main Dashboard Page Component
 */
const DashboardPage = () => {
  const { 
    data, 
    isLoading, 
    error, 
    user, 
    emailVerified, 
    profileCompletion, 
    profileProgress, 
    needsProfileCompletion,
    refetch 
  } = useDashboardData();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <LoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  // Get user display name
  const userName = user?.firstName || user?.name || 'User';

  return (
    <div className="flex flex-col gap-6 p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground">
            {needsProfileCompletion 
              ? "Get started by completing your profile."
              : "Here's your job search overview."
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-emerald-400">
              <Bell className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/jobs">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Email Verification Banner */}
      {user?.email && (
        <EmailVerificationBanner
          email={user.email}
          isVerified={emailVerified}
        />
      )}

      {/* Profile Completion Hero - full-width banner below header */}
      {needsProfileCompletion && (
        <ProfileCompletionSection 
          profileCompletion={profileCompletion}
          profileProgress={profileProgress}
        />
      )}

      {/* Stats Grid - Show for all authenticated users */}
      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              label="Profile Views" 
              value={data.stats.profileViews} 
              icon={Eye} 
              change="+12%"
            />
            <StatsCard 
              label="Applications" 
              value={data.stats.applicationsCount} 
              icon={FileText} 
              change="+5%"
            />
            <StatsCard 
              label="Saved Jobs" 
              value={data.stats.savedJobsCount} 
              icon={Briefcase} 
              change="+2"
            />
            <StatsCard 
              label="Interview Requests" 
              value={data.stats.interviewRequests} 
              icon={Users} 
              change="+1"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <Card className="bg-card border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Recent Applications</CardTitle>
                <Link href="/applications">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {data.recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {data.recentApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-foreground">{app.jobTitle}</p>
                          <p className="text-sm text-muted-foreground">{app.company}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(app.status)} text-white`}>
                            {formatStatus(app.status)}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{app.appliedAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No applications yet</p>
                    <Link href="/jobs">
                      <Button variant="outline" className="mt-4 border">
                        Browse Jobs
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Interviews */}
            <Card className="bg-card border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Upcoming Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                {data.upcomingInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {data.upcomingInterviews.map((interview) => (
                      <div key={interview.id} className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white">{interview.jobTitle}</p>
                            <p className="text-sm text-muted-foreground">{interview.company}</p>
                          </div>
                          <Badge className="bg-emerald-500 text-white">Confirmed</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {interview.appliedAt}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            Join Meeting
                          </Button>
                          <Button size="sm" variant="outline" className="border">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No upcoming interviews</p>
                    <Link href="/jobs">
                      <Button variant="outline" className="mt-4 border">
                        Apply to Jobs
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Current Job Listings */}
          {data.currentJobs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  {needsProfileCompletion ? 'Latest Jobs' : 'Recommended For You'}
                </h2>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.currentJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.slug || job.id}`} className="block">
                    <Card className="bg-card border hover:border-emerald-500/30 transition-all h-full group">
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-foreground font-medium truncate">{job.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{job.company || 'Unknown Company'}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toast('Report this job?', {
                                action: {
                                  label: 'Report',
                                  onClick: async () => {
                                    try {
                                      const res = await fetch(`/api/jobs/${job.id}/report`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ reason: 'Inappropriate content' }),
                                      })
                                      if (res.ok) toast.success('Job reported')
                                      else toast.error('Failed to report')
                                    } catch {
                                      toast.error('Something went wrong')
                                    }
                                  }
                                }
                              })
                            }}
                            className="md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                            title="Report job"
                          >
                            <Flag className="h-3.5 w-3.5 text-muted-foreground hover:text-red-400" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location || 'Remote'}
                          </span>
                          {job.workMode && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {job.workMode}
                            </span>
                          )}
                          {job.salaryMin && (
                            <span className="text-emerald-400">${job.salaryMin.toLocaleString()}{job.salaryMax ? ` - $${job.salaryMax.toLocaleString()}` : ''}</span>
                          )}
                        </div>
                        {job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border">
                            {job.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs bg-muted text-foreground/80">
                                {skill}
                              </Badge>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="text-xs text-muted-foreground self-center">+{job.skills.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Saved Jobs */}
          {data.savedJobs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-emerald-400" />
                  Saved Jobs
                </h2>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    Browse More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.savedJobs.slice(0, 3).map((sj) => (
                  <Link key={sj.id} href={`/jobs/${sj.job.slug || sj.jobId}`} className="block">
                    <Card className="bg-card/50 border hover:border-emerald-500/30 transition-all h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-foreground font-medium text-sm truncate">{sj.job.title}</h3>
                            <p className="text-xs text-muted-foreground truncate">{sj.job.company?.companyName || 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {sj.job.remoteWork ? 'Remote' : sj.job.location || sj.job.city || 'N/A'}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Fallback when no jobs but profile is complete */}
          {data.currentJobs.length === 0 && !needsProfileCompletion && (
            <Card className="bg-card border">
              <CardHeader>
                <CardTitle className="text-foreground">Recommended For You</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-4">
                  Check out the latest jobs matching your profile
                </p>
                <Link href="/jobs" className="block">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
