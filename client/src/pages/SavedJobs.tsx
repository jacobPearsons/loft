import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, MapPin, Briefcase, Loader2, BookmarkX, AlertCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSavedJobs } from '@/lib/api-hooks'
import { useAuth } from '@/providers/AuthProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { displayJobType, formatRelativeTime } from '@/lib/mappers'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SavedJobs() {
  const { user } = useAuth()
  const reduced = useReducedMotion()
  const { savedJobs, loading, error, toggleSave } = useSavedJobs(user?.email)

  return (
      <div className="container px-4 md:px-6 py-16 sm:py-20 max-w-4xl mx-auto">
        <motion.div
          variants={reduced ? undefined : containerVariants}
          initial={reduced ? undefined : 'hidden'}
          animate={reduced ? undefined : 'visible'}
        >
          <motion.div variants={reduced ? undefined : itemVariants} className="flex items-center gap-3 mb-8">
            <Bookmark className="h-6 w-6 text-emerald-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Saved Jobs</h1>
              <p className="text-sm text-neutral-400 mt-1">Jobs you've bookmarked for later</p>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            </div>
          ) : error ? (
            <motion.div variants={reduced ? undefined : itemVariants} className="text-center py-20">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-neutral-400 mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </motion.div>
          ) : savedJobs.length === 0 ? (
            <motion.div variants={reduced ? undefined : itemVariants} className="text-center py-20">
              <img
                src="/images/No%20Saved%20Jobs.png"
                alt="No saved jobs"
                className="w-48 h-48 object-contain mx-auto mb-4 opacity-60"
              />
              <p className="text-neutral-400 mb-2">No saved jobs yet</p>
              <p className="text-sm text-neutral-500 mb-6">
                Save jobs you're interested in to find them easily later
              </p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div variants={reduced ? undefined : itemVariants} className="space-y-3">
              {savedJobs.map((sj) => (
                <motion.div
                  key={sj.id}
                  variants={reduced ? undefined : itemVariants}
                  className="group"
                >
                  <Card className="hover:border-emerald-500/30 transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <Link to={`/jobs/${sj.job.slug}`} className="flex items-start gap-4 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                            {sj.job.company?.companyLogo ? (
                              <img src={sj.job.company.companyLogo} alt="" className="w-full h-full object-cover" />
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
                              {sj.job.title}
                            </h3>
                            <p className="text-sm text-neutral-400 truncate">
                              {sj.job.company?.companyName || 'Unknown Company'}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-neutral-500">
                              {sj.job.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {sj.job.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {displayJobType(sj.job.jobType)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Saved {formatRelativeTime(sj.savedAt)}
                              </span>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={(e) => { e.preventDefault(); toggleSave(sj.jobId) }}
                          className="shrink-0 p-2 text-neutral-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label={`Remove ${sj.job.title} from saved jobs`}
                        >
                          <BookmarkX className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
  )
}
