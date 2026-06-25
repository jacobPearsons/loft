import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HiringStage, TimelineEntry } from '../types'
import { STAGE_CONFIG } from '../services/hiringService'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  Clock,
  Circle,
  ChevronRight,
  ArrowRight,
  FileText,
  User,
  TestTube,
  Code,
  Users,
  Briefcase,
  Shield,
  Mail,
  PartyPopper,
  GraduationCap
} from 'lucide-react'

interface StageCardProps {
  stage: HiringStage
  status: 'completed' | 'current' | 'pending'
  date?: Date
  applicationCount?: number
  onClick?: () => void
  className?: string
}

const stageIcons: Record<HiringStage, React.ReactNode> = {
  JOB_IDENTIFIED: <Briefcase className="w-5 h-5" />,
  JOB_APPLICATION: <FileText className="w-5 h-5" />,
  APPLICATIONS_RECEIVED: <Circle className="w-5 h-5" />,
  RESUME_SCREENING: <FileText className="w-5 h-5" />,
  HR_INTERVIEW: <User className="w-5 h-5" />,
  SKILLS_TEST: <TestTube className="w-5 h-5" />,
  TECHNICAL_INTERVIEW: <Code className="w-5 h-5" />,
  BEHAVIORAL_INTERVIEW: <Users className="w-5 h-5" />,
  FINAL_HIRING_MANAGER: <User className="w-5 h-5" />,
  BACKGROUND_CHECKS: <Shield className="w-5 h-5" />,
  OFFER_LETTER: <Mail className="w-5 h-5" />,
  HIRING: <PartyPopper className="w-5 h-5" />,
  ONBOARDING: <GraduationCap className="w-5 h-5" />,
}

const statusStyles: Record<'completed' | 'current' | 'pending', {
  card: string
  icon: string
  title: string
  badge: string
  iconBadge: string
}> = {
  completed: {
    card: 'border-emerald-500/30 bg-emerald-500/5',
    icon: 'bg-emerald-500 text-white',
    title: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-400',
    iconBadge: 'bg-emerald-500',
  },
  current: {
    card: 'border-blue-500/30 bg-blue-500/5',
    icon: 'bg-blue-500 text-white',
    title: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-400',
    iconBadge: 'bg-blue-500',
  },
  pending: {
    card: 'border bg-card/30',
    icon: 'bg-muted text-muted-foreground',
    title: 'text-foreground/80',
    badge: 'bg-muted/20 text-muted-foreground',
    iconBadge: 'bg-neutral-600',
  },
}

export function StageCard({
  stage,
  status,
  date,
  applicationCount,
  onClick,
  className,
}: StageCardProps) {
  const config = STAGE_CONFIG[stage]
  const styles = statusStyles[status]
  const icon = stageIcons[stage]

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <Card
        className={cn(
          'cursor-pointer transition-all',
          status === 'pending' ? 'border bg-card/30' : styles.card,
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full',
              styles.icon
            )}>
              {status === 'completed' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                icon
              )}
            </div>
            <Badge className={cn('flex items-center gap-1', styles.badge)}>
              {status === 'completed' ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Complete
                </>
              ) : status === 'current' ? (
                <>
                  <Clock className="w-3 h-3" />
                  In Progress
                </>
              ) : (
                <>
                  <Circle className="w-3 h-3" />
                  Pending
                </>
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className={cn('text-base', styles.title)}>
                {config.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {config.description}
              </p>
            </div>
            {onClick && (
              <ArrowRight className="w-5 h-5 text-neutral-600" />
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {date && (
                <span>
                  {status === 'completed' ? 'Completed' : 'Started'}:{' '}
                  {new Date(date).toLocaleDateString()}
                </span>
              )}
            </div>
            {applicationCount !== undefined && applicationCount > 0 && (
              <Badge variant="outline" className="border-border">
                {applicationCount} applicant{applicationCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface StageProgressProps {
  timeline: TimelineEntry[]
  className?: string
}

export function StageProgress({ timeline, className }: StageProgressProps) {
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-2', className)}>
      {timeline.map((entry, index) => {
        const config = STAGE_CONFIG[entry.stage]
        const isLast = index === timeline.length - 1

        return (
          <React.Fragment key={entry.stage}>
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap',
                entry.status === 'completed' && 'bg-emerald-500/20 text-emerald-400',
                entry.status === 'current' && 'bg-blue-500/20 text-blue-400',
                entry.status === 'pending' && 'bg-muted text-muted-foreground'
              )}
            >
              {entry.status === 'completed' ? (
                <CheckCircle className="w-3 h-3" />
              ) : entry.status === 'current' ? (
                <Clock className="w-3 h-3" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
              <span className="text-xs font-medium">{config.name}</span>
            </div>
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-neutral-700 shrink-0" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default StageCard
